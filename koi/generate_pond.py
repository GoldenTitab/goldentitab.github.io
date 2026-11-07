#!/usr/bin/env python3
"""Generate Ali's koi pond: an animated SVG for the GitHub profile README and
the data.json that powers the interactive pond page.

Data: daily contribution counts for the last 364 days + primary-language
shares of public, non-fork repositories, fetched through the GitHub GraphQL
API (``gh`` CLI). Token resolution: $KOI_TOKEN, then $GH_TOKEN, then
``gh auth token``. In GitHub Actions $GH_TOKEN is the workflow's built-in
token. Stdlib only.

Pond rules (Ali, 2026-11-07):
- Range = the contribution graph: 53 Sunday-start week columns x 7 rows.
- Empty tile: light-grey fill; EVERY tile has the same blue border.
- Intensity: 4 levels like GitHub, from quartiles of the positive counts.
- Fish colours come from the account's languages (body white + patches).
- The README SVG animates with SMIL only (no script can run in a README).

Outputs (next to this script): pond.svg, data.json.
"""
import argparse
import json
import os
import subprocess
import sys
import urllib.request
from datetime import date, datetime, timedelta
from pathlib import Path

LOGIN = "GoldenTitab"
HERE = Path(__file__).resolve().parent

# --- pond style (locked by Ali's answers) -----------------------------------
CELL = 12
GAP = 4
GRID_X = 18
GRID_Y = 206
EMPTY_FILL = "#E8EDF2"          # light grey, no contributions
BORDER = "#00D9FF"              # same blue border on every tile
LEVEL_COLORS = ["#A8E2FF", "#5CC8FF", "#1E96FF", "#0066D6"]  # 4 blues
WATER_TOP = "#0C2D42"
WATER_BOTTOM = "#061524"
LABEL_FILL = "#6FA8C9"
CAPTION_FILL = "#7FB3D5"
SVG_W, SVG_H = 880, 380

# --- the koi (side view, facing right, centred on 0,0; ~230 long) ----------
BODY_PATH = (
    "M -108,2 C -96,-26 -56,-40 0,-40 C 56,-40 100,-28 112,-6 "
    "C 116,2 112,10 104,16 C 84,32 40,42 -5,40 C -56,38 -100,24 -108,2 Z"
)
TAIL_PATH = (
    "M -102,-6 C -138,-30 -172,-36 -194,-20 C -178,-10 -170,-2 -170,4 "
    "C -188,12 -194,26 -180,34 C -158,42 -128,28 -102,10 Z"
)
DORSAL_PATH = "M -24,-38 C -8,-58 22,-60 44,-44 C 24,-40 -2,-38 -24,-38 Z"
PECTORAL_PATH = "M 18,12 C 34,30 56,34 70,24 C 56,12 36,6 18,12 Z"
PELVIC_PATH = "M -38,36 C -24,46 -6,46 4,38 C -10,34 -26,32 -38,36 Z"
# Patches are placed by language rank: 1st language = biggest patch, etc.
PATCH_PATHS = [
    "M -34,-38 C 2,-44 34,-32 30,-10 C 26,8 -6,16 -26,6 C -42,-2 -44,-28 -34,-38 Z",
    "M 52,-38 C 84,-36 104,-26 110,-12 C 100,-4 78,-6 64,-16 C 54,-22 48,-32 52,-38 Z",
    "M -62,8 C -42,4 -20,8 -28,24 C -38,38 -62,36 -68,22 C -70,14 -68,10 -62,8 Z",
    "M -102,-14 C -82,-24 -60,-20 -62,-2 C -64,12 -86,16 -100,8 C -108,2 -108,-8 -102,-14 Z",
]
SWIM_PATH = "M -260,120 C 100,70 300,170 520,110 C 700,60 900,150 1140,100"


def token():
    for name in ("KOI_TOKEN", "GH_TOKEN"):
        if os.environ.get(name):
            return os.environ[name]
    return subprocess.check_output(["gh", "auth", "token"], text=True).strip()


def gh_graphql(query, variables):
    body = json.dumps({"query": query, "variables": variables}).encode()
    req = urllib.request.Request(
        "https://api.github.com/graphql",
        data=body,
        headers={
            "Authorization": f"Bearer {token()}",
            "Content-Type": "application/json",
            "User-Agent": "koi-pond-generator",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        payload = json.load(resp)
    if "errors" in payload:
        raise RuntimeError(json.dumps(payload["errors"], indent=2)[:2000])
    return payload["data"]


def fetch_snapshot():
    today = date.today()
    start = today - timedelta(days=364)  # GraphQL caps the range at 1 year
    cal = gh_graphql(
        """
        query($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks { contributionDays { date contributionCount } }
              }
            }
          }
        }
        """,
        {
            "login": LOGIN,
            "from": start.isoformat() + "T00:00:00Z",
            "to": today.isoformat() + "T23:59:59Z",
        },
    )["user"]["contributionsCollection"]["contributionCalendar"]
    days = [
        {"date": d["date"], "count": d["contributionCount"]}
        for week in cal["weeks"]
        for d in week["contributionDays"]
    ]
    repos = gh_graphql(
        """
        query($login: String!) {
          user(login: $login) {
            repositories(first: 100, ownerAffiliations: [OWNER], privacy: PUBLIC) {
              nodes { id isFork visibility primaryLanguage { name color } }
            }
            repositoriesContributedTo(first: 100, privacy: PUBLIC,
                includeUserRepositories: false,
                contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, PULL_REQUEST_REVIEW, REPOSITORY]) {
              nodes { id isFork visibility primaryLanguage { name color } }
            }
          }
        }
        """,
        {"login": LOGIN},
    )["user"]
    seen = {}
    for node in repos["repositories"]["nodes"] + repos["repositoriesContributedTo"]["nodes"]:
        seen[node["id"]] = node
    counts, colors = {}, {}
    for node in seen.values():
        if node["visibility"] != "PUBLIC" or node["isFork"]:
            continue
        lang = node["primaryLanguage"]
        if not lang:
            continue
        counts[lang["name"]] = counts.get(lang["name"], 0) + 1
        colors[lang["name"]] = lang["color"]
    total_repos = sum(counts.values())
    languages = [
        {"name": n, "color": colors[n], "repos": c,
         "share": round(c / total_repos, 4) if total_repos else 0}
        for n, c in sorted(counts.items(), key=lambda kv: -kv[1])
    ]
    return {
        "login": LOGIN,
        "fetched_on": today.isoformat(),
        "total_contributions": cal["totalContributions"],
        "days": days,
        "languages": languages,
    }


def level_thresholds(days):
    """GitHub-style quartiles of the positive daily counts -> [q1, q2, q3]."""
    pos = sorted(d["count"] for d in days if d["count"] > 0)
    if not pos:
        return [1, 1, 1]
    n = len(pos)
    return [pos[n // 4], pos[n // 2], pos[3 * n // 4]]


def level(count, thresholds):
    if count <= 0:
        return 0
    q1, q2, q3 = thresholds
    if count <= q1:
        return 1
    if count <= q2:
        return 2
    if count <= q3:
        return 3
    return 4


def build_weeks(days):
    """Sunday-start columns (GitHub graph layout), last 53 columns."""
    by_date = {d["date"]: d["count"] for d in days}
    dates = sorted(by_date)
    first = datetime.strptime(dates[0], "%Y-%m-%d").date()
    last = datetime.strptime(dates[-1], "%Y-%m-%d").date()
    # Back up to the Sunday on/before the first day.
    sunday = first - timedelta(days=(first.weekday() + 1) % 7)
    columns = []
    cur = sunday
    while cur <= last:
        col = []
        for i in range(7):
            day = cur + timedelta(days=i)
            col.append({
                "date": day.isoformat(),
                "count": by_date.get(day.isoformat(), 0),
            })
        columns.append(col)
        cur += timedelta(days=7)
    return columns[-53:]


def month_labels(columns):
    """(x, 'Mon') for each column where the month changes."""
    labels = []
    prev = None
    for idx, col in enumerate(columns):
        month = datetime.strptime(col[0]["date"], "%Y-%m-%d").strftime("%b")
        if month != prev:
            labels.append((GRID_X + idx * (CELL + GAP), month))
            prev = month
    return labels


def fish_group(languages):
    """The koi as an SVG group (SMIL-animated). Patches = top languages."""
    patches = ""
    for lang, path in zip(languages[:4], PATCH_PATHS):
        patches += (
            f'<path d="{path}" fill="{lang["color"]}" opacity="0.95">'
            f'<title>{lang["name"]}</title></path>'
        )
    return f"""
  <g>
    <animateMotion dur="26s" repeatCount="indefinite" rotate="auto" path="{SWIM_PATH}"/>
    <g>
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values="-12 -104 0; 12 -104 0; -12 -104 0" dur="1.1s" repeatCount="indefinite"/>
        <path d="{TAIL_PATH}" fill="#F4F7F9" opacity="0.9"/>
      </g>
      <path d="{DORSAL_PATH}" fill="#FFFFFF" opacity="0.55"/>
      <path d="{BODY_PATH}" fill="#F4F7F9" stroke="#08202F" stroke-opacity="0.35" stroke-width="1.5"/>
      <clipPath id="koiBodyClip"><path d="{BODY_PATH}"/></clipPath>
      <g clip-path="url(#koiBodyClip)">
        {patches}
        <ellipse cx="0" cy="-26" rx="70" ry="10" fill="#FFFFFF" opacity="0.18"/>
        <ellipse cx="-10" cy="32" rx="60" ry="8" fill="#0B2233" opacity="0.08"/>
      </g>
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values="-8 20 12; 8 20 12; -8 20 12" dur="1.1s" repeatCount="indefinite"/>
        <path d="{PECTORAL_PATH}" fill="#FFFFFF" opacity="0.65"/>
      </g>
      <path d="{PELVIC_PATH}" fill="#FFFFFF" opacity="0.5"/>
      <path d="M 64,-28 C 56,-8 56,10 64,26" fill="none" stroke="#0B2233" stroke-opacity="0.15" stroke-width="2"/>
      <path d="M 106,6 C 114,12 118,20 116,28" fill="none" stroke="#0B2233" stroke-opacity="0.45" stroke-width="1.5"/>
      <path d="M 100,14 C 104,22 104,28 100,34" fill="none" stroke="#0B2233" stroke-opacity="0.35" stroke-width="1.5"/>
      <circle cx="88" cy="-8" r="5" fill="#0B2233"/>
      <circle cx="90" cy="-10" r="1.8" fill="#FFFFFF"/>
    </g>
  </g>
  <ellipse cx="0" cy="200" rx="90" ry="8" fill="#000000" opacity="0.12">
    <animateMotion dur="26s" repeatCount="indefinite"
      path="M -260,200 L 1140,200"/>
  </ellipse>"""


def render_svg(snapshot):
    days = snapshot["days"]
    languages = snapshot["languages"]
    thresholds = level_thresholds(days)
    columns = build_weeks(days)
    total = snapshot["total_contributions"]

    tiles = []
    for ci, col in enumerate(columns):
        for ri, cell in enumerate(col):
            x = GRID_X + ci * (CELL + GAP)
            y = GRID_Y + ri * (CELL + GAP)
            lv = level(cell["count"], thresholds)
            fill = EMPTY_FILL if lv == 0 else LEVEL_COLORS[lv - 1]
            tiles.append(
                f'<rect x="{x}" y="{y}" width="{CELL}" height="{CELL}" rx="2" '
                f'fill="{fill}" stroke="{BORDER}" stroke-width="1"/>'
            )
    months = "".join(
        f'<text x="{x}" y="198" font-size="10" fill="{LABEL_FILL}" '
        f'font-family="sans-serif">{name}</text>'
        for x, name in month_labels(columns)
    )
    bubbles = ""
    for x, r, dur, begin in [(180, 4, 7, 0), (360, 3, 8, 1.5), (540, 5, 6, 3),
                             (700, 3.5, 7.5, 2), (820, 4, 6.5, 4.5)]:
        bubbles += f"""
    <circle cx="{x}" cy="345" r="{r}" fill="#FFFFFF" opacity="0">
      <animate attributeName="cy" values="345;30" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>
      <animate attributeName="cx" values="{x - 6};{x + 6};{x - 6}" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;0.5;0" keyTimes="0;0.2;1" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>
    </circle>"""
    ripples = ""
    for cx, begin in [(300, 0), (620, 1.6)]:
        ripples += f"""
    <ellipse cx="{cx}" cy="16" rx="10" ry="2" fill="none" stroke="#BFE9FF" stroke-width="1.5" opacity="0">
      <animate attributeName="rx" values="10;70" dur="3.2s" begin="{begin}s" repeatCount="indefinite"/>
      <animate attributeName="ry" values="2;7" dur="3.2s" begin="{begin}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;0" dur="3.2s" begin="{begin}s" repeatCount="indefinite"/>
    </ellipse>"""
    rays = ""
    for x1, x2, begin in [(120, 170, 0), (430, 470, 2), (700, 740, 4)]:
        rays += f"""
    <polygon points="{x1},0 {x2},0 {x2 - 40},380 {x1 - 40},380" fill="#FFFFFF" opacity="0.04">
      <animate attributeName="opacity" values="0.02;0.07;0.02" dur="7s" begin="{begin}s" repeatCount="indefinite"/>
    </polygon>"""
    legend_x = SVG_W - 18 - 5 * 16 - 62
    swatches = "".join(
        f'<rect x="{legend_x + 34 + i * 16}" y="336" width="12" height="12" rx="2" '
        f'fill="{c}" stroke="{BORDER}" stroke-width="1"/>'
        for i, c in enumerate([EMPTY_FILL] + LEVEL_COLORS)
    )
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{SVG_W}" height="{SVG_H}" viewBox="0 0 {SVG_W} {SVG_H}" role="img" aria-label="Ali's koi pond: a koi swimming over a year of GitHub contributions">
  <title>Ali's koi pond</title>
  <defs>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{WATER_TOP}"/>
      <stop offset="1" stop-color="{WATER_BOTTOM}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="{SVG_W}" height="{SVG_H}" rx="16" fill="url(#water)"/>
  <rect x="0" y="0" width="{SVG_W}" height="60" fill="#FFFFFF" opacity="0.04"/>
  {rays}
  {ripples}
  {months}
  {''.join(tiles)}
  {bubbles}
  {fish_group(languages)}
  <text x="18" y="352" font-size="11" fill="{CAPTION_FILL}" font-family="sans-serif">{total} contributions in the last year</text>
  <text x="{legend_x}" y="346" font-size="11" fill="{CAPTION_FILL}" font-family="sans-serif">Less</text>
  {swatches}
  <text x="{legend_x + 34 + 5 * 16 + 6}" y="346" font-size="11" fill="{CAPTION_FILL}" font-family="sans-serif">More</text>
</svg>
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--snapshot", help="use this snapshot.json instead of fetching")
    args = ap.parse_args()
    if args.snapshot:
        snapshot = json.loads(Path(args.snapshot).read_text())
    else:
        snapshot = fetch_snapshot()
    thresholds = level_thresholds(snapshot["days"])
    data = {
        "generated_at": datetime.now().date().isoformat(),
        "login": snapshot["login"],
        "total_contributions": snapshot["total_contributions"],
        "days": snapshot["days"],
        "languages": snapshot["languages"],
        "levels": {
            "thresholds": thresholds,
            "colors": LEVEL_COLORS,
            "empty": EMPTY_FILL,
            "border": BORDER,
        },
    }
    (HERE / "pond.svg").write_text(render_svg(snapshot))
    (HERE / "data.json").write_text(json.dumps(data, indent=2))
    print(f"pond.svg + data.json written: {len(snapshot['days'])} days, "
          f"{snapshot['total_contributions']} contributions, "
          f"thresholds={thresholds}, "
          f"languages={[l['name'] for l in snapshot['languages']]}")


if __name__ == "__main__":
    main()
