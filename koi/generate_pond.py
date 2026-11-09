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
- The koi itself is the original git-koi pixel-art sprite
  (yalongwastaken/git-koi, MIT, (c) 2026 Anthony Yalong), extracted by
  extract_sprite.py (same folder, needs Pillow) into sprite.json and
  recoloured here so each patch shows one of Ali's languages.
- Motion is modelled on real koi (Wu et al. 2007 burst-and-coast; the
  git-koi cruise model): the README fish swims a closed loop, its body
  cut into 10 slices that undulate with a head-to-tail wave whose
  amplitude grows toward the tail, beating in strokes with glides
  between, and bending into the turns. The page (pond.js) runs the
  same model live with velocity physics.
- The README SVG animates with SMIL only (no script can run in a README).

Outputs (next to this script): pond.svg, pond-still.svg (no motion, for
prefers-reduced-motion), data.json.
"""
import argparse
import colorsys
import json
import math
import os
import random
import re
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

# --- the koi: the original git-koi pixel sprite (sprite.json) --------------
# Native 247x118, faces right, centred on (0,0) by the caller. The body is
# cut into 10 vertical slices (same bounds as pond.js); each slice gets a
# SMIL translate animation: a travelling wave + a bend into the turns.
SLICE_BOUNDS = [0, 25, 50, 74, 99, 124, 148, 173, 198, 222, 247]
BODY_L = 247
# The README fish swims one long closed route in the upper pond (no
# teleport back to the start). The route is an irregular loop (a closed
# Catmull-Rom spline through ROUTE) so no two stretches look alike; the
# fish's speed rises and falls with its strokes, the stroke schedule is
# irregular (seeded, so the file only changes when the data does), and the
# body bends by the path's real curvature. One lap = LOOP_DUR seconds.
ROUTE = [(170, 108), (280, 90), (420, 112), (560, 90), (690, 100), (752, 126),
         (728, 160), (600, 150), (468, 172), (330, 150), (215, 172), (150, 160),
         (128, 134)]
SHADOW_DY = 80                   # the shadow swims the same route, lower
LOOP_DUR = 34.0
SAMPLE_DT = 0.30                 # keyframe spacing (body wave stays > 4/cycle)
FINE_DT = 0.05                   # internal integration step
GLIDE_SPEED, STROKE_BOOST = 0.40, 1.10   # relative speed: coast / extra on a stroke
WAVE_BASE_HZ, WAVE_BEAT_HZ = 0.45, 0.35  # body-wave frequency: coast / extra
STROKE_LEN = 0.75                # one tail beat, seconds


def load_sprite():
    return json.loads((HERE / "sprite.json").read_text())


def shade_hex(hexcol, delta):
    """Shift a colour's lightness by delta (same math as pond.js)."""
    r, g, b = (int(hexcol[i:i + 2], 16) / 255 for i in (1, 3, 5))
    h, li, s = colorsys.rgb_to_hls(r, g, b)
    li = max(0.08, min(0.92, li + delta))
    r, g, b = colorsys.hls_to_rgb(h, li, s)
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))


def sprite_slices(languages, sprite):
    """Pixel runs as SVG rects, split into one string per body slice."""
    slices = [""] * (len(SLICE_BOUNDS) - 1)
    for y, x, w, group, rank, shade, orig in sprite["runs"]:
        if rank is not None and rank < len(languages):
            fill = shade_hex(languages[rank]["color"], shade)
        elif rank is not None:
            fill = shade_hex(orig, shade)
        else:
            fill = orig
        x0, x1 = x, x + w
        for s in range(len(slices)):
            ax0 = max(x0, SLICE_BOUNDS[s])
            ax1 = min(x1, SLICE_BOUNDS[s + 1])
            if ax1 <= ax0:
                continue
            slices[s] += (
                f'<rect x="{ax0}" y="{y}" width="{ax1 - ax0}" height="1" '
                f'fill="{fill}"/>'
            )
    return slices


def _route_segments():
    """Closed Catmull-Rom spline through ROUTE as cubic Bezier segments."""
    n = len(ROUTE)
    segs = []
    for i in range(n):
        p0, p1, p2, p3 = ROUTE[i - 1], ROUTE[i], ROUTE[(i + 1) % n], ROUTE[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        segs.append((p1, c1, c2, p2))
    return segs


def _path_d(segs, dy=0.0):
    d = f"M {segs[0][0][0]:.1f},{segs[0][0][1] + dy:.1f}"
    for _, c1, c2, p in segs:
        d += (f" C {c1[0]:.1f},{c1[1] + dy:.1f} {c2[0]:.1f},{c2[1] + dy:.1f}"
              f" {p[0]:.1f},{p[1] + dy:.1f}")
    return d + " Z"


def _bezier(seg, u):
    p0, c1, c2, p1 = seg
    m = 1 - u
    x = m**3 * p0[0] + 3 * m * m * u * c1[0] + 3 * m * u * u * c2[0] + u**3 * p1[0]
    y = m**3 * p0[1] + 3 * m * m * u * c1[1] + 3 * m * u * u * c2[1] + u**3 * p1[1]
    dx = 3 * (m * m * (c1[0] - p0[0]) + 2 * m * u * (c2[0] - c1[0]) + u * u * (p1[0] - c2[0]))
    dy = 3 * (m * m * (c1[1] - p0[1]) + 2 * m * u * (c2[1] - c1[1]) + u * u * (p1[1] - c2[1]))
    return x, y, math.atan2(dy, dx)


def _norm_rad(a):
    while a > math.pi:
        a -= 2 * math.pi
    while a < -math.pi:
        a += 2 * math.pi
    return a


def _strokes():
    """Irregular burst-and-coast schedule: bursts of 1-3 tail beats with
    glides of 1.4-3.2 s between, none crossing the lap boundary. Seeded,
    so the output is identical from night to night."""
    rng = random.Random(11)
    out, t = [], 1.0
    while True:
        beats = rng.choice([1, 2, 2, 3])
        strength = rng.uniform(0.6, 1.0)
        if t + beats * STROKE_LEN > LOOP_DUR - 1.2:
            break
        for k in range(beats):
            out.append((t + k * STROKE_LEN, strength))
        t += beats * STROKE_LEN + rng.uniform(1.4, 3.2)
    return out


_PLAN = None


def motion_plan():
    """Everything the SMIL needs, computed once: per-sample arc-length
    progress, stroke envelope, wave phase and signed turn rate."""
    global _PLAN
    if _PLAN:
        return _PLAN
    segs = _route_segments()
    # Arc-length table of the route.
    pts = []
    for seg in segs:
        for k in range(80):
            pts.append(_bezier(seg, k / 80))
    cum = [0.0]
    for i in range(1, len(pts) + 1):
        a, b = pts[i - 1], pts[i % len(pts)]
        cum.append(cum[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    length = cum[-1]

    def heading_at(s):
        s %= length
        lo, hi = 0, len(cum) - 1
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if cum[mid] <= s:
                lo = mid
            else:
                hi = mid
        return pts[lo % len(pts)][2]

    n = int(round(LOOP_DUR / FINE_DT))
    strokes = _strokes()
    env = []
    for i in range(n + 1):
        t = i * FINE_DT
        e = 0.0
        for st, strength in strokes:
            if st <= t < st + STROKE_LEN:
                e += strength * math.sin(math.pi * (t - st) / STROKE_LEN)
        env.append(min(1.0, e))
    # Speed lags the stroke a little (peaks just after it). A first-order
    # filter run over three laps gives the periodic steady state.
    tau, y, lag = 0.6, 0.0, []
    for lap in range(3):
        for i in range(n):
            y += (env[i] - y) * FINE_DT / tau
            if lap == 2:
                lag.append(y)
    lag.append(lag[0])
    speed_rel = [GLIDE_SPEED + STROKE_BOOST * v for v in lag]
    prog = [0.0]
    for i in range(1, n + 1):
        prog.append(prog[-1] + 0.5 * (speed_rel[i] + speed_rel[i - 1]))
    total = prog[-1]
    prog = [v / total for v in prog]                 # 0 .. 1 along the route
    # d(progress)/dt = speed_rel / (total * FINE_DT); times route length = px/s.
    px_per_s = [length * speed_rel[i] / (total * FINE_DT) for i in range(n + 1)]
    # Wave phase: faster while stroking, scaled to a whole number of cycles
    # so the lap wraps without a jump.
    ph = [0.0]
    for i in range(1, n + 1):
        f0 = WAVE_BASE_HZ + WAVE_BEAT_HZ * env[i - 1]
        f1 = WAVE_BASE_HZ + WAVE_BEAT_HZ * env[i]
        ph.append(ph[-1] + 2 * math.pi * 0.5 * (f0 + f1) * FINE_DT)
    cycles = round(ph[-1] / (2 * math.pi))
    ph = [v * (2 * math.pi * cycles) / ph[-1] + 0.8 for v in ph]
    # Signed turn rate (rad/s, + = clockwise on screen) from the route.
    ds = 12.0
    omega = []
    for i in range(n + 1):
        s = prog[i] * length
        dth = _norm_rad(heading_at(s + ds) - heading_at(s - ds))
        omega.append(dth / (2 * ds) * px_per_s[i])
    _PLAN = {
        "segs": segs, "length": length, "env": env, "prog": prog,
        "phase": ph, "omega": omega, "n": n,
    }
    return _PLAN


def _sample_indices():
    n = motion_plan()["n"]
    step = int(round(SAMPLE_DT / FINE_DT))
    idx = list(range(0, n, step)) + [n]
    return idx


def _key_times(idx):
    n = motion_plan()["n"]
    return "; ".join(f"{i / n:.4f}" for i in idx)


def _wave_keyframes(xc):
    """SMIL translate values/keyTimes for one slice over one lap."""
    plan = motion_plan()
    from_tail = 1 - xc / BODY_L
    base_amp = 1.5 + 11.5 * from_tail ** 1.4
    idx = _sample_indices()
    vals = []
    for i in idx:
        amp = base_amp * (0.35 + 0.65 * plan["env"][i])
        turn = max(-1.0, min(1.0, plan["omega"][i] / 0.8))
        off = (
            amp * math.sin(plan["phase"][i] - 2 * math.pi * xc / BODY_L)
            - 14 * from_tail ** 2 * turn
        )
        vals.append(f"0,{off:.2f}")
    return "; ".join(vals), _key_times(idx)


def _motion_attrs():
    """keyPoints/keyTimes that make the fish speed up on strokes."""
    plan = motion_plan()
    idx = _sample_indices()
    pts = "; ".join(f"{plan['prog'][i]:.5f}" for i in idx)
    return f'calcMode="linear" keyPoints="{pts}" keyTimes="{_key_times(idx)}"'


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


def fish_group(languages, sprite, animated=True):
    """The koi as an SVG group (SMIL-animated). Patches = top languages.
    animated=False gives the still version (prefers-reduced-motion)."""
    slices = sprite_slices(languages, sprite)
    cx, cy = sprite["w"] / 2, sprite["h"] / 2
    plan = motion_plan()
    slice_groups = ""
    for i, rects in enumerate(slices):
        xc = (SLICE_BOUNDS[i] + SLICE_BOUNDS[i + 1]) / 2
        if animated:
            values, key_times = _wave_keyframes(xc)
            slice_groups += (
                f'<g><animateTransform attributeName="transform" type="translate" '
                f'values="{values}" keyTimes="{key_times}" dur="{LOOP_DUR}s" '
                f'repeatCount="indefinite"/>{rects}</g>'
            )
        else:
            slice_groups += f"<g>{rects}</g>"
    loop_path = _path_d(plan["segs"])
    shadow_path = _path_d(plan["segs"], SHADOW_DY)
    if not animated:
        # Rest pose: heading right, a third of the way along the top run.
        return f"""
  <ellipse cx="420" cy="{114 + SHADOW_DY}" rx="120" ry="10" fill="#000000" opacity="0.22"/>
  <g shape-rendering="crispEdges" transform="translate(420,114)">
    <g transform="translate({-cx},{-cy})">
      {slice_groups}
    </g>
  </g>"""
    attrs = _motion_attrs()
    return f"""
  <g shape-rendering="crispEdges">
    <animateMotion dur="{LOOP_DUR}s" repeatCount="indefinite" rotate="auto" {attrs} path="{loop_path}"/>
    <g transform="translate({-cx},{-cy})">
      {slice_groups}
    </g>
  </g>
  <ellipse cx="0" cy="0" rx="120" ry="10" fill="#000000" opacity="0.22">
    <animateMotion dur="{LOOP_DUR}s" repeatCount="indefinite" {attrs} path="{shadow_path}"/>
  </ellipse>"""


def render_svg(snapshot, sprite, animated=True):
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
    if not animated:
        bubbles = ripples = ""
        rays = re.sub(r"\s*<animate [^>]*/>", "", rays)
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
  {fish_group(languages, sprite, animated)}
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
    sprite = load_sprite()
    (HERE / "pond.svg").write_text(render_svg(snapshot, sprite))
    (HERE / "pond-still.svg").write_text(render_svg(snapshot, sprite, animated=False))
    (HERE / "data.json").write_text(json.dumps(data, indent=2))
    print(f"pond.svg + pond-still.svg + data.json written: {len(snapshot['days'])} days, "
          f"{snapshot['total_contributions']} contributions, "
          f"thresholds={thresholds}, "
          f"languages={[l['name'] for l in snapshot['languages']]}")


if __name__ == "__main__":
    main()
