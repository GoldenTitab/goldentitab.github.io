/* Ali's Koi Pond — interactive layer.
 * Builds the pond from data.json (regenerated nightly), then lets the koi
 * swim after the pointer with realistic motion: burst-and-coast strokes,
 * a body wave that travels head-to-tail, smooth turning with the body
 * bending into the turn, gentle hovering when it arrives, and a slow
 * wander when the pointer is idle. Bubbles from the mouth, a soft
 * shadow, ripples on click. Hover a colour on the koi to see its
 * language (name only); hover a tile to see that day's count. The
 * language hover is pixel-perfect: the pointer is mapped into the
 * sprite and looked up against the actual patch pixels (with a small
 * tolerance), so the 1 px-tall patch rects themselves are never the
 * hover target.
 * Tap or click the water to drop food: pellets float for ~14 s, the
 * koi turns to the nearest one, swims at it and gulps it down (a ripple
 * and a couple of bubbles). The loop pauses when the tab is hidden, the
 * pond is scrolled offscreen, or the visitor presses Pause.
 * Vanilla JS, no dependencies.
 *
 * The koi is the original git-koi pixel-art sprite (yalongwastaken/git-koi,
 * MIT, (c) 2026 Anthony Yalong) in sprite.json, recoloured to Ali's
 * languages — the same data koi/generate_pond.py uses for the README SVG.
 *
 * Motion model (real koi, after Wu et al. 2007 and the git-koi cruise
 * model): koi swim burst-and-coast — a few tail beats, then a glide
 * with the body straight. The body wave travels head-to-tail with the
 * amplitude growing toward the tail; the tail lags the wave; speed
 * peaks just after each stroke. In a turn the body bends into the
 * turn (up to ~0.6 body lengths in a hard turn) with the tail
 * sweeping outside. Even with prefers-reduced-motion the fish keeps
 * swimming, only slower and gentler — it never freezes.
 */
(function () {
  'use strict';

  var SVG_W = 880, SVG_H = 380;
  var CELL = 12, GAP = 4, GRID_X = 18, GRID_Y = 206;
  var NS = 'http://www.w3.org/2000/svg';
  var KOI_SCALE = 1.0;   /* sprite 247x118, shown at native size: its
     bounding circle (radius ~137) then fits the 380-tall pond in any
     orientation, so the fish is never clipped at an edge */
  var BODY_L = 247;      /* sprite length in native pixels */

  /* Vertical slices of the sprite for the body wave (shared bounds with
     generate_pond.py). Each slice is a <g> shifted sideways per frame. */
  var SLICE_BOUNDS = [0, 25, 50, 74, 99, 124, 148, 173, 198, 222, 247];

  /* Burst-and-coast stroke: 2.4 s cycle, beat for the first 55%, glide. */
  var BEAT_PERIOD = 2.4, BEAT_SHARE = 0.55;
  var CRUISE_SPEED = 70, MAX_SPEED = 230, ACCEL = 300, TURN_MAX = 2.2;

  /* Feeding. */
  var MAX_PELLETS = 12, PELLET_LIFE = 14000, PELLET_FADE = 3000;
  var MOUTH = 172;       /* head tip, px ahead of the sprite centre */

  var svg = document.getElementById('pond');
  var wrap = document.getElementById('pondWrap');
  var tooltip = document.getElementById('tooltip');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function level(count, thresholds) {
    if (count <= 0) return 0;
    if (count <= thresholds[0]) return 1;
    if (count <= thresholds[1]) return 2;
    if (count <= thresholds[2]) return 3;
    return 4;
  }

  function buildWeeks(days) {
    var byDate = {};
    days.forEach(function (d) { byDate[d.date] = d.count; });
    var dates = Object.keys(byDate).sort();
    var first = new Date(dates[0] + 'T00:00:00');
    var last = new Date(dates[dates.length - 1] + 'T00:00:00');
    var sunday = new Date(first);
    sunday.setDate(first.getDate() - ((first.getDay() + 7) % 7));
    var columns = [];
    var cur = new Date(sunday);
    while (cur <= last) {
      var col = [];
      for (var i = 0; i < 7; i++) {
        var day = new Date(cur);
        day.setDate(cur.getDate() + i);
        var iso = day.toISOString().slice(0, 10);
        col.push({ date: iso, count: byDate[iso] || 0 });
      }
      columns.push(col);
      cur.setDate(cur.getDate() + 7);
    }
    return columns.slice(-53);
  }

  function fmtDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  function shadeHex(hex, delta) {
    /* Same lightness shift as generate_pond.py's shade_hex. */
    var r = parseInt(hex.slice(1, 3), 16) / 255;
    var g = parseInt(hex.slice(3, 5), 16) / 255;
    var b = parseInt(hex.slice(5, 7), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = 0; s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    l = Math.max(0.08, Math.min(0.92, l + delta));
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    function hue(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    r = hue(p, q, h + 1 / 3); g = hue(p, q, h); b = hue(p, q, h - 1 / 3);
    function hx(v) { var s2 = Math.round(v * 255).toString(16); return s2.length === 1 ? '0' + s2 : s2; }
    return '#' + hx(r) + hx(g) + hx(b);
  }

  function fishMarkup(languages, sprite) {
    /* Split the pixel runs at the slice bounds so each slice can move. */
    var slices = [];
    for (var i = 0; i < SLICE_BOUNDS.length - 1; i++) slices.push('');
    sprite.runs.forEach(function (run) {
      var y = run[0], x = run[1], w = run[2], rank = run[4], shade = run[5], orig = run[6];
      var fill, langAttr = '';
      if (rank !== null && rank < languages.length) {
        fill = shadeHex(languages[rank].color, shade);
        langAttr = ' class="patch" data-lang="' + languages[rank].name + '"';
      } else if (rank !== null) {
        fill = shadeHex(orig, shade);
      } else {
        fill = orig;
      }
      var x0 = x, x1 = x + w;
      for (var s = 0; s < slices.length; s++) {
        var ax0 = Math.max(x0, SLICE_BOUNDS[s]);
        var ax1 = Math.min(x1, SLICE_BOUNDS[s + 1]);
        if (ax1 <= ax0) continue;
        slices[s] += '<rect x="' + ax0 + '" y="' + y + '" width="' + (ax1 - ax0)
          + '" height="1" fill="' + fill + '"' + langAttr + '/>';
      }
    });
    var out = '<g transform="translate(' + (-sprite.w / 2) + ',' + (-sprite.h / 2)
      + ') scale(' + KOI_SCALE + ')" shape-rendering="crispEdges">';
    slices.forEach(function (rects, i) {
      out += '<g class="slice" data-slice="' + i + '">' + rects + '</g>';
    });
    return out + '</g>';
  }

  function ambientSVG() {
    var bubbles = '';
    [[180, 4, 7, 0], [360, 3, 8, 1.5], [540, 5, 6, 3], [700, 3.5, 7.5, 2], [820, 4, 6.5, 4.5]]
      .forEach(function (b) {
        bubbles += '<circle cx="' + b[0] + '" cy="345" r="' + b[1] + '" fill="#FFFFFF" opacity="0">'
          + '<animate attributeName="cy" values="345;30" dur="' + b[2] + 's" begin="' + b[3] + 's" repeatCount="indefinite"/>'
          + '<animate attributeName="cx" values="' + (b[0] - 6) + ';' + (b[0] + 6) + ';' + (b[0] - 6) + '" dur="' + b[2] + 's" begin="' + b[3] + 's" repeatCount="indefinite"/>'
          + '<animate attributeName="opacity" values="0;0.5;0" keyTimes="0;0.2;1" dur="' + b[2] + 's" begin="' + b[3] + 's" repeatCount="indefinite"/>'
          + '</circle>';
      });
    var ripples = '';
    [[300, 0], [620, 1.6]].forEach(function (r) {
      ripples += '<ellipse cx="' + r[0] + '" cy="16" rx="10" ry="2" fill="none" stroke="#BFE9FF" stroke-width="1.5" opacity="0">'
        + '<animate attributeName="rx" values="10;70" dur="3.2s" begin="' + r[1] + 's" repeatCount="indefinite"/>'
        + '<animate attributeName="ry" values="2;7" dur="3.2s" begin="' + r[1] + 's" repeatCount="indefinite"/>'
        + '<animate attributeName="opacity" values="0.5;0" dur="3.2s" begin="' + r[1] + 's" repeatCount="indefinite"/>'
        + '</ellipse>';
    });
    var rays = '';
    [[120, 170, 0], [430, 470, 2], [700, 740, 4]].forEach(function (r) {
      rays += '<polygon points="' + r[0] + ',0 ' + r[1] + ',0 ' + (r[1] - 40) + ',380 ' + (r[0] - 40) + ',380" fill="#FFFFFF" opacity="0.04">'
        + '<animate attributeName="opacity" values="0.02;0.07;0.02" dur="7s" begin="' + r[2] + 's" repeatCount="indefinite"/>'
        + '</polygon>';
    });
    return rays + ripples + bubbles;
  }

  function buildPond(data, sprite) {
    var columns = buildWeeks(data.days);
    var t = data.levels.thresholds;
    var colors = data.levels.colors;
    var tiles = '';
    columns.forEach(function (col, ci) {
      col.forEach(function (cell, ri) {
        var lv = level(cell.count, t);
        var fill = lv === 0 ? data.levels.empty : colors[lv - 1];
        tiles += '<rect class="tile" x="' + (GRID_X + ci * (CELL + GAP))
          + '" y="' + (GRID_Y + ri * (CELL + GAP))
          + '" width="' + CELL + '" height="' + CELL + '" rx="2" fill="' + fill
          + '" stroke="' + data.levels.border + '" stroke-width="1"'
          + ' data-date="' + cell.date + '" data-count="' + cell.count + '"/>';
      });
    });
    var months = '';
    var prev = null;
    columns.forEach(function (col, ci) {
      var m = new Date(col[0].date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' });
      if (m !== prev) {
        months += '<text x="' + (GRID_X + ci * (CELL + GAP)) + '" y="198" font-size="10" fill="#6FA8C9" font-family="sans-serif">' + m + '</text>';
        prev = m;
      }
    });
    svg.innerHTML = '<defs><linearGradient id="water" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#0C2D42"/><stop offset="1" stop-color="#061524"/>'
      + '</linearGradient></defs>'
      + '<rect x="0" y="0" width="' + SVG_W + '" height="' + SVG_H + '" rx="16" fill="url(#water)"/>'
      + '<rect x="0" y="0" width="' + SVG_W + '" height="60" fill="#FFFFFF" opacity="0.04"/>'
      + ambientSVG()
      + months + tiles
      + '<text x="18" y="352" font-size="11" fill="#7FB3D5" font-family="sans-serif">'
      + data.total_contributions + ' contributions in the last year</text>'
      + '<g id="fx"></g>'
      + '<ellipse id="koiShadow" cx="0" cy="0" rx="120" ry="10" fill="#000000" opacity="0.22"/>'
      + '<g id="koi">' + fishMarkup(data.languages, sprite) + '</g>';

    var langLegend = document.getElementById('langLegend');
    langLegend.innerHTML = data.languages.map(function (l) {
      return '<span class="item"><span class="dot" style="background:' + l.color + '"></span>'
        + l.name + ' &middot; ' + Math.round(l.share * 100) + '%</span>';
    }).join('');
    var swatches = ['<span>Less</span>'];
    [data.levels.empty].concat(colors).forEach(function (c) {
      swatches.push('<span class="swatch" style="background:' + c + '"></span>');
    });
    swatches.push('<span>More</span>');
    document.getElementById('levelLegend').innerHTML = swatches.join('');
    var active = data.days.filter(function (d) { return d.count > 0; }).length;
    document.getElementById('stats').textContent =
      data.total_contributions + ' contributions in the last year · '
      + active + ' active days · redrawn nightly';
  }

  /* --- the living koi ---------------------------------------------------- */
  var koi = null, shadow = null, fx = null, sliceGroups = [];
  var spriteData = null, patchMap = null, fishPixels = null;
  var pos = { x: 440, y: 120 }, vel = { x: 0, y: 0 };
  var heading = 0, turnRate = 0;
  var wavePhase = 0.8, beatClock = 0, lastT = 0, lastPointer = 0, lastBubble = 0;
  var curBeatEnv = 0, curTurnNorm = 0;   /* latest frame's wave state, for the hit-test */
  var pointer = { x: 440, y: 120 };
  var lastClient = { x: 0, y: 0 };
  var tooltipKind = null;   /* 'lang' | 'tile' | null */
  var wanderTarget = null, wanderUntil = 0;
  var bubbles = [], ripples = [];
  var pellets = [], gulpUntil = 0;
  var hoverActive = false;  /* true only while a mouse is over the page: touch has no hover */
  var rafId = 0, paused = false, hidden = false, offscreen = false;
  var PATCH_OFFS = (function () {   /* 4 px hit tolerance, nearest first, built once */
    var o = [];
    for (var dx = -4; dx <= 4; dx++)
      for (var dy = -4; dy <= 4; dy++)
        if (dx * dx + dy * dy <= 16) o.push([dx, dy, dx * dx + dy * dy]);
    o.sort(function (a, b) { return a[2] - b[2]; });
    return o;
  })();

  /* Screen -> pond coordinates, WITHOUT clamping: the hit-test must
     see the pointer where it really is. (An earlier version clamped
     here, which squashed every pointer outside the fish's roaming box
     onto its edge — so a yellow patch at the fish's nose read as the
     wrong colour, and empty water could read as a patch.) */
  function toSVG(clientX, clientY) {
    var pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    var p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: p.x, y: p.y };
  }

  /* Clamp a TARGET point to the fish's roaming box, so the whole fish
     stays inside the pond in ANY orientation: the centre stays one
     bounding-circle radius (137) plus a small margin from every edge.
     Only the target is clamped — never the pointer itself. */
  function clampToPond(p) {
    return {
      x: Math.max(145, Math.min(SVG_W - 145, p.x)),
      y: Math.max(145, Math.min(SVG_H - 145, p.y))
    };
  }

  function normRad(a) {
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
  }

  function spawnBubble() {
    /* Mouth = head tip, 172px ahead along the heading. */
    var bx = pos.x + 172 * Math.cos(heading);
    var by = pos.y + 172 * Math.sin(heading);
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', bx.toFixed(1));
    c.setAttribute('cy', by.toFixed(1));
    c.setAttribute('r', (2.5 + Math.random() * 2.5).toFixed(1));
    c.setAttribute('fill', '#FFFFFF');
    c.setAttribute('opacity', '0.55');
    fx.appendChild(c);
    bubbles.push({ el: c, x: bx, y: by, vy: 0.5 + Math.random() * 0.4, life: 0, seed: Math.random() * 6 });
    if (bubbles.length > 24) { var old = bubbles.shift(); old.el.remove(); }
  }

  function spawnRipple(x, y) {
    var e = document.createElementNS(NS, 'ellipse');
    e.setAttribute('cx', x); e.setAttribute('cy', y);
    e.setAttribute('rx', 8); e.setAttribute('ry', 3);
    e.setAttribute('fill', 'none'); e.setAttribute('stroke', '#BFE9FF');
    e.setAttribute('stroke-width', '1.5'); e.setAttribute('opacity', '0.5');
    fx.appendChild(e);
    ripples.push({ el: e, life: 0 });
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* Drop a few floating pellets around (x, y), in pond coordinates. */
  function dropFood(x, y, count) {
    if (!fx) return;
    var c = { x: clamp(x, 24, SVG_W - 24), y: clamp(y, 28, SVG_H - 28) };
    for (var k = 0; k < count && pellets.length < MAX_PELLETS; k++) {
      var px = clamp(c.x + (Math.random() - 0.5) * 34, 20, SVG_W - 20);
      var py = clamp(c.y + (Math.random() - 0.5) * 24, 24, SVG_H - 24);
      var el = document.createElementNS(NS, 'circle');
      el.setAttribute('r', '3.4');
      el.setAttribute('fill', '#E0A75E');
      el.setAttribute('stroke', '#8A5A22');
      el.setAttribute('stroke-width', '0.7');
      el.setAttribute('cx', px.toFixed(1)); el.setAttribute('cy', py.toFixed(1));
      fx.appendChild(el);
      pellets.push({ el: el, x: px, y: py, born: performance.now(), seed: Math.random() * 6.28 });
    }
    spawnRipple(c.x, c.y);
    wake();
  }

  function nearestPellet() {
    var best = null, bd = 1e9;
    for (var i = 0; i < pellets.length; i++) {
      var d = Math.hypot(pellets[i].x - pos.x, pellets[i].y - pos.y);
      if (d < bd) { bd = d; best = pellets[i]; }
    }
    return best;
  }

  function eatPellet(i, now) {
    var pl = pellets[i];
    spawnRipple(pl.x, pl.y);
    spawnBubble(); spawnBubble();
    pl.el.remove();
    pellets.splice(i, 1);
    gulpUntil = now + 450;   /* a brief pause: the koi gulps */
  }

  function updatePellets(now) {
    var mx = pos.x + MOUTH * Math.cos(heading);
    var my = pos.y + MOUTH * Math.sin(heading);
    for (var i = pellets.length - 1; i >= 0; i--) {
      var pl = pellets[i], age = now - pl.born;
      var life = reducedMotion ? PELLET_LIFE * 2.5 : PELLET_LIFE;   /* the slower koi needs longer */
      if (age > life) { pl.el.remove(); pellets.splice(i, 1); continue; }
      /* Eaten when the mouth reaches it (or the body swims right over it). */
      if (Math.hypot(mx - pl.x, my - pl.y) < 22 || Math.hypot(pos.x - pl.x, pos.y - pl.y) < 50) {
        eatPellet(i, now);
        continue;
      }
      if (!reducedMotion) {
        pl.el.setAttribute('cx', (pl.x + Math.sin(now * 0.0013 + pl.seed) * 1.3).toFixed(1));
        pl.el.setAttribute('cy', (pl.y + Math.cos(now * 0.0011 + pl.seed) * 1.0).toFixed(1));
      }
      if (age > life - PELLET_FADE) {
        pl.el.setAttribute('opacity', ((life - age) / PELLET_FADE).toFixed(2));
      }
    }
  }

  function frame(now) {
    rafId = 0;
    var dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
    lastT = now;
    var rm = reducedMotion;

    /* Target: the pointer, or a slow wander once it has been idle 6 s
       AND the fish has already arrived there. Until it arrives, it
       keeps chasing — parking the pointer somewhere new always brings
       the fish over. The switch to wandering is smooth: a wander
       waypoint is just another target for the same physics. */
    var target;
    var food = pellets.length ? nearestPellet() : null;
    var distToPointer = Math.hypot(pointer.x - pos.x, pointer.y - pos.y);
    if (food) {
      target = food;          /* food beats the pointer and the wander */
    } else if (!rm && (now - lastPointer < 12000 || distToPointer > 45)) {
      target = pointer;
    } else {
      if (!wanderTarget || now > wanderUntil ||
          Math.hypot(wanderTarget.x - pos.x, wanderTarget.y - pos.y) < 40) {
        wanderTarget = {
          x: 145 + Math.random() * (SVG_W - 290),
          y: 145 + Math.random() * (SVG_H - 290)
        };
        wanderUntil = now + 5000;
      }
      target = wanderTarget;
    }

    /* Burst-and-coast stroke: a smooth beat, then a glide. Speed peaks
       just after the stroke, like a real koi. */
    beatClock += dt;
    var cycle = (beatClock % BEAT_PERIOD) / BEAT_PERIOD;
    var beatEnv = cycle < BEAT_SHARE ? Math.sin(Math.PI * cycle / BEAT_SHARE) : 0;
    curBeatEnv = beatEnv;
    var cruise = rm ? 35 : CRUISE_SPEED;
    var maxSpeed = rm ? 55 : MAX_SPEED;
    var speedCap = cruise + (maxSpeed - cruise) * beatEnv;
    if (food) speedCap *= 1.25;                 /* a koi darts at food */
    if (now < gulpUntil) speedCap = Math.min(speedCap, 20);
    /* While the cursor rests on a coloured patch the fish holds its
       position (tail still beating — a koi hovering in place), so the
       patch stays under the pointer and its tooltip stays readable.
       On the plain body it just calms down. */
    var hoverPatch = hoverActive ? patchLangAt(lastClient.x, lastClient.y) : null;
    if (!food) {
      if (hoverPatch) {
        speedCap = 0;
      } else if (hoverActive && pointerOnFish()) {
        speedCap = Math.min(speedCap, 35);
      }
    }

    /* Arrived: orbit the pointer slowly instead of parking dead still. */
    var tx = target.x, ty = target.y;
    var dx = tx - pos.x, dy = ty - pos.y;
    var dist = Math.hypot(dx, dy);
    if (dist < 45 && target === pointer) {
      var orbit = now * 0.00045;
      tx = pointer.x + 26 * Math.cos(orbit);
      ty = pointer.y + 18 * Math.sin(orbit * 1.3);
      dx = tx - pos.x; dy = ty - pos.y; dist = Math.hypot(dx, dy);
    }

    /* Desired velocity, capped acceleration: smooth starts and stops. */
    var wantX = 0, wantY = 0;
    if (dist > 6) {
      var sp = Math.min(speedCap, 25 + dist * 0.85);
      wantX = dx / dist * sp; wantY = dy / dist * sp;
    }
    var ax = wantX - vel.x, ay = wantY - vel.y;
    var aLen = Math.hypot(ax, ay), maxA = ACCEL * dt;
    if (aLen > maxA) { ax = ax / aLen * maxA; ay = ay / aLen * maxA; }
    vel.x += ax; vel.y += ay;
    pos.x += vel.x * dt; pos.y += vel.y * dt;
    pos.x = Math.max(145, Math.min(SVG_W - 145, pos.x));
    pos.y = Math.max(145, Math.min(SVG_H - 145, pos.y));
    var speed = Math.hypot(vel.x, vel.y);

    /* Heading turns toward the velocity at a limited rate, so the fish
       steers instead of snapping. The sprite is a top-down koi, so it
       rotates freely through 360° — no horizontal flip (flipping would
       teleport the head across the body mid-turn). */
    if (speed > 8) {
      var desired = Math.atan2(vel.y, vel.x);
      var diff = normRad(desired - heading);
      var maxTurn = TURN_MAX * dt;
      var turn = Math.max(-maxTurn, Math.min(maxTurn, diff));
      heading += turn;
      turnRate += (turn / dt - turnRate) * 0.2;
    } else {
      turnRate *= 0.95;
    }
    koi.setAttribute('transform',
      'translate(' + pos.x.toFixed(1) + ' ' + pos.y.toFixed(1) + ')'
      + ' rotate(' + (heading * 180 / Math.PI).toFixed(1) + ')');

    /* Travelling body wave: amplitude grows head-to-tail, the tail lags
       the wave, and the body bends into the turn (tail sweeps outside). */
    var freq = (rm ? 0.45 : 0.6) + (rm ? 0.3 : 1.2) * beatEnv;
    wavePhase += 2 * Math.PI * freq * dt;
    var turnNorm = Math.max(-1, Math.min(1, turnRate / TURN_MAX));
    curTurnNorm = turnNorm;
    for (var i = 0; i < sliceGroups.length; i++) {
      var xc = (SLICE_BOUNDS[i] + SLICE_BOUNDS[i + 1]) / 2;
      sliceGroups[i].setAttribute('transform',
        'translate(0 ' + sliceOffAt(xc).toFixed(2) + ')');
    }

    /* Shadow follows under the fish, rotated with it so it hugs the
       belly in any orientation instead of lying flat as a streak. */
    shadow.setAttribute('transform',
      'translate(' + pos.x.toFixed(1) + ' ' + pos.y.toFixed(1) + ')'
      + ' rotate(' + (heading * 180 / Math.PI).toFixed(1) + ')'
      + ' translate(0 65)');
    shadow.setAttribute('rx', (120 + Math.min(18, speed * 0.06)).toFixed(1));
    if (speed > 60 && now - lastBubble > 320) { spawnBubble(); lastBubble = now; }

    /* A language tooltip must not outlive the hover: if the fish swam
       away from under a stationary pointer, hide it. */
    if (tooltipKind === 'lang' && !hoverPatch) {
      hideTooltip();
    }

    for (var i = bubbles.length - 1; i >= 0; i--) {
      var b = bubbles[i];
      b.life += 1; b.y -= b.vy; b.x += Math.sin((b.life + b.seed) * 0.15) * 0.4;
      b.el.setAttribute('cy', b.y.toFixed(1));
      b.el.setAttribute('cx', b.x.toFixed(1));
      b.el.setAttribute('opacity', Math.max(0, 0.55 - b.life * 0.008).toFixed(2));
      if (b.y < 20 || b.life > 300) { b.el.remove(); bubbles.splice(i, 1); }
    }
    for (var j = ripples.length - 1; j >= 0; j--) {
      var r = ripples[j];
      r.life += 1;
      r.el.setAttribute('rx', (8 + r.life * 1.6).toFixed(1));
      r.el.setAttribute('ry', (3 + r.life * 0.25).toFixed(1));
      r.el.setAttribute('opacity', Math.max(0, 0.5 - r.life * 0.012).toFixed(2));
      if (r.life > 45) { r.el.remove(); ripples.splice(j, 1); }
    }
    updatePellets(now);
    if (shouldRun()) rafId = requestAnimationFrame(frame);
  }

  /* --- loop control: no work while hidden, offscreen or paused ----------- */
  function shouldRun() { return koi && !paused && !hidden && !offscreen; }
  function wake() {
    if (!rafId && shouldRun()) {
      lastT = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  }
  document.addEventListener('visibilitychange', function () {
    hidden = document.hidden;
    wake();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      offscreen = !entries[0].isIntersecting;
      wake();
    }).observe(wrap);
  }

  /* --- tooltips ---------------------------------------------------------- */
  /* Map sprite pixel -> language name, for pixel-perfect patch hover,
     plus the set of all fish pixels (to tell when the cursor is on
     the fish at all). */
  function buildPatchMap(languages, sprite) {
    var map = {};
    var all = {};
    sprite.runs.forEach(function (run) {
      var rank = run[4];
      for (var x = run[1]; x < run[1] + run[2]; x++) {
        all[x + ',' + run[0]] = true;
        if (rank !== null && rank < languages.length) {
          map[x + ',' + run[0]] = languages[rank].name;
        }
      }
    });
    fishPixels = all;
    return map;
  }

  /* Vertical shift of the slice containing sprite x, right now — the
     same offset the renderer applies to that slice, so the hit-test
     looks the pointer up against the WAVED fish as rendered, not the
     flat sprite. (A slice is translated rigidly, so its centre offset
     is exact for every pixel in it.) */
  function sliceOffAt(sx) {
    var i = 0;
    while (i < SLICE_BOUNDS.length - 2 && sx >= SLICE_BOUNDS[i + 1]) i++;
    var xc = (SLICE_BOUNDS[i] + SLICE_BOUNDS[i + 1]) / 2;
    var fromTail = 1 - xc / BODY_L;
    var amp = (1.5 + 11.5 * Math.pow(fromTail, 1.4))
      * (0.35 + 0.65 * curBeatEnv) * (reducedMotion ? 0.6 : 1);
    return amp * Math.sin(wavePhase - (2 * Math.PI / BODY_L) * xc)
      - curTurnNorm * 14 * fromTail * fromTail;
  }

  /* Sprite coordinates under the pointer (undoing the fish's
     translate/rotate/scale), or null before the sprite loads. */
  function pointerToSprite(clientX, clientY) {
    if (!spriteData) return null;
    var p = toSVG(clientX, clientY);
    var dx = p.x - pos.x, dy = p.y - pos.y;
    var c = Math.cos(heading), s = Math.sin(heading);
    var lx = dx * c + dy * s, ly = -dx * s + dy * c;
    return {
      x: lx / KOI_SCALE + spriteData.w / 2,
      y: ly / KOI_SCALE + spriteData.h / 2
    };
  }

  /* Language under the pointer, if any: look the pixel up in the waved
     sprite, with a 4 px tolerance (nearest patch wins). */
  function patchLangAt(clientX, clientY) {
    if (!patchMap) return null;
    var sp = pointerToSprite(clientX, clientY);
    if (!sp) return null;
    var cx = Math.round(sp.x), cy = Math.round(sp.y - sliceOffAt(sp.x));
    var offs = PATCH_OFFS;
    for (var i = 0; i < offs.length; i++) {
      var lang = patchMap[(cx + offs[i][0]) + ',' + (cy + offs[i][1])];
      if (lang) return lang;
    }
    return null;
  }

  /* Is the pointer on the fish at all (any pixel, patch or body)? */
  function pointerOnFish() {
    if (!fishPixels) return false;
    var sp = pointerToSprite(lastClient.x, lastClient.y);
    if (!sp) return false;
    return !!fishPixels[Math.round(sp.x) + ',' + Math.round(sp.y - sliceOffAt(sp.x))];
  }

  function highlightLang(lang) {
    var all = svg.querySelectorAll('.patch[data-lang="' + lang + '"]');
    for (var i = 0; i < all.length; i++) all[i].classList.add('hl');
  }

  function showTooltip(text, clientX, clientY) {
    tooltip.textContent = text;
    tooltip.hidden = false;
    moveTooltip(clientX, clientY);
  }
  function moveTooltip(clientX, clientY) {
    var x = clientX + 14, y = clientY + 16;
    if (x > window.innerWidth - 190) x = clientX - 170;
    if (y > window.innerHeight - 60) y = clientY - 50;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }
  function hideTooltip() {
    tooltip.hidden = true;
    tooltipKind = null;
    var hl = svg.querySelectorAll('.patch.hl');
    for (var i = 0; i < hl.length; i++) hl[i].classList.remove('hl');
  }

  /* The pointer is tracked anywhere on the page, not just over the pond,
     so moving the mouse outside the SVG still steers the fish. */
  window.addEventListener('pointermove', function (e) {
    pointer = clampToPond(toSVG(e.clientX, e.clientY));
    lastPointer = performance.now();
    lastClient = { x: e.clientX, y: e.clientY };
    hoverActive = e.pointerType === 'mouse';
    if (!hoverActive) return;   /* touch / pen: steer only, no tooltips */
    var lang = patchLangAt(e.clientX, e.clientY);
    if (lang) {
      showTooltip(lang, e.clientX, e.clientY);
      tooltipKind = 'lang';
      highlightLang(lang);
      return;
    }
    var t = e.target;
    if (t && svg.contains(t) && t.dataset && t.dataset.date) {
      var n = parseInt(t.dataset.count, 10);
      var text = n === 0
        ? 'No contributions on ' + fmtDate(t.dataset.date)
        : n + (n === 1 ? ' contribution on ' : ' contributions on ') + fmtDate(t.dataset.date);
      showTooltip(text, e.clientX, e.clientY);
      tooltipKind = 'tile';
      return;
    }
    hideTooltip();
  });
  svg.addEventListener('pointerdown', function (e) {
    if (e.button > 0) return;
    var p = toSVG(e.clientX, e.clientY);
    dropFood(p.x, p.y, 3);
  });

  /* Buttons: keyboard- and touch-friendly alternatives. */
  var feedBtn = document.getElementById('feedBtn');
  var pauseBtn = document.getElementById('pauseBtn');
  if (feedBtn) feedBtn.addEventListener('click', function () {
    dropFood(170 + Math.random() * 540, 70 + Math.random() * 100, 3);
  });
  if (pauseBtn) pauseBtn.addEventListener('click', function () {
    paused = !paused;
    pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    pauseBtn.textContent = paused ? 'Resume animation' : 'Pause animation';
    wake();
  });

  Promise.all([
    fetch('data.json').then(function (r) { if (!r.ok) throw new Error('data.json ' + r.status); return r.json(); }),
    fetch('sprite.json').then(function (r) { if (!r.ok) throw new Error('sprite.json ' + r.status); return r.json(); })
  ])
    .then(function (parts) {
      var data = parts[0], sprite = parts[1];
      buildPond(data, sprite);
      spriteData = sprite;
      patchMap = buildPatchMap(data.languages, sprite);
      koi = document.getElementById('koi');
      shadow = document.getElementById('koiShadow');
      fx = document.getElementById('fx');
      sliceGroups = Array.prototype.slice.call(koi.querySelectorAll('.slice'));
      koi.setAttribute('transform', 'translate(440 120)');
      lastT = performance.now();
      lastPointer = performance.now();
      wake();
    })
    .catch(function (err) {
      document.getElementById('stats').textContent =
        'The pond could not load its data (' + err.message + '). It redraws nightly — please try again later.';
    });
})();
