#!/usr/bin/env python3
"""Extract the original git-koi pixel-art koi (full-grown, white body) from the
reference render sheet (docs/bodies-light.png, cell row 0 / col 5) into
koi/sprite.json: run-length-encoded pixels of the exact original sprite, with
its colour patches mapped to Ali's language ranks.

Patch mapping (by patch area, matching repo-count rank):
  orange family (761 px) -> rank 0 (Dart)
  navy dark patch (497 px blob) -> rank 1 (HTML)
  red family (532 px) -> rank 2 (JavaScript)
  blue family (274 px) -> rank 3 (Python)
  yellow specks (70 px) -> rank 2 (JavaScript, yellow = JS colour anyway)
Small navy bits inside other patches become a dark shade of that patch's
language colour (they are the original's patch shading, not a patch).
Body / fins / outline keep the original's exact colours.

sprite.json format:
  {w, h, tail_x, pivot:[x,y], runs:[[y, x, w, group, rank, shade, hex|null]]}
  group: 0 = body (stays put), 1 = tail (wags around the pivot)
  rank: language rank (0..3) or null for body/outline pixels
  shade: lightness delta applied to the language colour (patch modelling)
  hex: exact colour for body/outline pixels; for patch runs the ORIGINAL
       colour (fallback if a rank has no language at build time).
"""
import json
from collections import deque
from pathlib import Path

HERE = Path(__file__).resolve().parent
REF = HERE / "reference" / "sprite-white-full.png"
OUT = HERE / "sprite.json"

ORANGE = {(254, 174, 52), (247, 118, 34), (215, 118, 67)}
RED = {(240, 96, 79), (228, 59, 68), (246, 117, 122)}
BLUE = {(0, 153, 219), (18, 78, 137)}
YELLOW = {(254, 231, 97)}
NAVY = {(38, 43, 68), (58, 68, 102)}
FAMS = {"orange": ORANGE, "red": RED, "blue": BLUE, "yellow": YELLOW, "navy": NAVY}
RANK = {"orange": 0, "navy": 1, "red": 2, "blue": 3, "yellow": 2}

# bbox of the fish inside the 256x256 cell (measured)
BX0, BY0, BX1, BY1 = 5, 69, 251, 186
TAIL_CUT_NATIVE = 82          # narrowest column (peduncle)
PIVOT_NATIVE = (82, 115.5)    # neck centre


def lum(rgb):
    return sum(rgb) / 3 / 255


def hexof(rgb):
    return "#%02X%02X%02X" % rgb


def main():
    from PIL import Image

    im = Image.open(REF).convert("RGBA")
    px = im.load()
    W, H = 256, 256

    def fish(x, y):
        return px[x, y][:3] != (255, 255, 255)

    def fam(x, y):
        c = px[x, y][:3]
        for name, s in FAMS.items():
            if c in s:
                return name
        return None

    # --- navy components: big blob = dark patch (rank 1), small bits = shading
    navy_seen = set()
    navy_rank = {}   # (x,y) -> (rank, shade)
    for y in range(H):
        for x in range(W):
            if px[x, y][:3] not in NAVY or (x, y) in navy_seen:
                continue
            q = deque([(x, y)])
            navy_seen.add((x, y))
            cells = []
            while q:
                cx, cy = q.popleft()
                cells.append((cx, cy))
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = cx + dx, cy + dy
                    if (0 <= nx < W and 0 <= ny < H and (nx, ny) not in navy_seen
                            and px[nx, ny][:3] in NAVY):
                        navy_seen.add((nx, ny))
                        q.append((nx, ny))
            if len(cells) >= 100:
                for c in cells:
                    navy_rank[c] = (1, None)  # dark patch, shade from luminance
            else:
                # shade of the neighbouring patch family (most adjacent pixels)
                adj = {}
                for cx, cy in cells:
                    for dx in (-1, 0, 1):
                        for dy in (-1, 0, 1):
                            f = fam(cx + dx, cy + dy) if 0 <= cx + dx < W and 0 <= cy + dy < H else None
                            if f and f != "navy":
                                adj[f] = adj.get(f, 0) + 1
                rank = RANK[max(adj, key=adj.get)] if adj else 1
                for c in cells:
                    navy_rank[c] = (rank, -0.18)

    # --- per-family mean luminance (for shade modelling)
    fam_lum = {}
    for name, s in FAMS.items():
        vals = [lum(c) for c in s]
        fam_lum[name] = sum(vals) / len(vals)

    def shade_for(name, rgb):
        return round(max(-0.22, min(0.22, (lum(rgb) - fam_lum[name]) * 0.8)), 3)

    # --- build runs (rebased to bbox origin), split at the tail cut
    tail_x = TAIL_CUT_NATIVE - BX0
    pivot = [PIVOT_NATIVE[0] - BX0, PIVOT_NATIVE[1] - BY0]
    w, h = BX1 - BX0 + 1, BY1 - BY0 + 1
    runs = []
    for yy in range(BY0, BY1 + 1):
        y = yy - BY0
        x = BX0
        while x <= BX1:
            if not fish(x, yy):
                x += 1
                continue
            f = fam(x, yy)
            if f == "navy":
                rank, shade = navy_rank[(x, yy)]
                if shade is None:
                    shade = shade_for("navy", px[x, yy][:3])
                key = ("patch", rank, shade)
                orig = hexof(px[x, yy][:3])
            elif f:
                rank = RANK[f]
                shade = shade_for(f, px[x, yy][:3])
                key = ("patch", rank, shade)
                orig = hexof(px[x, yy][:3])
            else:
                key = ("flat", hexof(px[x, yy][:3]))
                orig = None
            x0 = x
            x += 1
            while x <= BX1 and fish(x, yy):
                f2 = fam(x, yy)
                if f2 == "navy":
                    r2, s2 = navy_rank[(x, yy)]
                    if s2 is None:
                        s2 = shade_for("navy", px[x, yy][:3])
                    k2 = ("patch", r2, s2)
                elif f2:
                    k2 = ("patch", RANK[f2], shade_for(f2, px[x, yy][:3]))
                else:
                    k2 = ("flat", hexof(px[x, yy][:3]))
                if k2 != key:
                    break
                x += 1
            # split the run at the tail cut
            rx0, rx1 = x0 - BX0, x - 1 - BX0
            for seg0, seg1 in ((rx0, min(rx1, tail_x - 1)), (max(rx0, tail_x), rx1)):
                if seg0 > seg1:
                    continue
                group = 1 if seg1 < tail_x else 0
                if key[0] == "patch":
                    runs.append([y, seg0, seg1 - seg0 + 1, group, key[1], key[2], orig])
                else:
                    runs.append([y, seg0, seg1 - seg0 + 1, group, None, 0, key[1]])
    data = {"w": w, "h": h, "tail_x": tail_x, "pivot": pivot, "runs": runs}
    (HERE / "sprite.json").write_text(json.dumps(data))
    n_patch = sum(1 for r in runs if r[4] is not None)
    print(f"sprite.json: {w}x{h}, {len(runs)} runs ({n_patch} patch), "
          f"tail_x={tail_x}, pivot={pivot}")


if __name__ == "__main__":
    main()
