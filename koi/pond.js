/* Ali's Koi Pond — interactive layer.
 * Builds the pond from data.json (regenerated nightly), then lets the koi
 * follow the pointer with realistic motion: eased turning, tail sway tied
 * to speed, bubbles from the mouth, a soft shadow, ripples on click.
 * Hover a colour on the koi to see its language (name only); hover a tile
 * to see that day's contribution count. Vanilla JS, no dependencies.
 */
(function () {
  'use strict';

  var SVG_W = 880, SVG_H = 380;
  var CELL = 12, GAP = 4, GRID_X = 18, GRID_Y = 206;
  var NS = 'http://www.w3.org/2000/svg';

  /* The koi — same drawing as koi/generate_pond.py (keep in sync). */
  var BODY_PATH = 'M -108,2 C -96,-26 -56,-40 0,-40 C 56,-40 100,-28 112,-6 '
    + 'C 116,2 112,10 104,16 C 84,32 40,42 -5,40 C -56,38 -100,24 -108,2 Z';
  var TAIL_PATH = 'M -102,-6 C -138,-30 -172,-36 -194,-20 C -178,-10 -170,-2 -170,4 '
    + 'C -188,12 -194,26 -180,34 C -158,42 -128,28 -102,10 Z';
  var DORSAL_PATH = 'M -24,-38 C -8,-58 22,-60 44,-44 C 24,-40 -2,-38 -24,-38 Z';
  var PECTORAL_PATH = 'M 18,12 C 34,30 56,34 70,24 C 56,12 36,6 18,12 Z';
  var PELVIC_PATH = 'M -38,36 C -24,46 -6,46 4,38 C -10,34 -26,32 -38,36 Z';
  var PATCH_PATHS = [
    'M -34,-38 C 2,-44 34,-32 30,-10 C 26,8 -6,16 -26,6 C -42,-2 -44,-28 -34,-38 Z',
    'M 52,-38 C 84,-36 104,-26 110,-12 C 100,-4 78,-6 64,-16 C 54,-22 48,-32 52,-38 Z',
    'M -62,8 C -42,4 -20,8 -28,24 C -38,38 -62,36 -68,22 C -70,14 -68,10 -62,8 Z',
    'M -102,-14 C -82,-24 -60,-20 -62,-2 C -64,12 -86,16 -100,8 C -108,2 -108,-8 -102,-14 Z'
  ];

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

  function fishMarkup(languages) {
    var patches = '';
    languages.slice(0, 4).forEach(function (lang, i) {
      patches += '<path class="patch" data-lang="' + lang.name + '" d="'
        + PATCH_PATHS[i] + '" fill="' + lang.color + '" opacity="0.95"/>';
    });
    return '<g class="tail"><path d="' + TAIL_PATH + '" fill="#F4F7F9" opacity="0.9"/></g>'
      + '<path d="' + DORSAL_PATH + '" fill="#FFFFFF" opacity="0.55"/>'
      + '<path d="' + BODY_PATH + '" fill="#F4F7F9" stroke="#08202F" stroke-opacity="0.35" stroke-width="1.5"/>'
      + '<clipPath id="koiBodyClip"><path d="' + BODY_PATH + '"/></clipPath>'
      + '<g clip-path="url(#koiBodyClip)">'
      + patches
      + '<ellipse cx="0" cy="-26" rx="70" ry="10" fill="#FFFFFF" opacity="0.18"/>'
      + '<ellipse cx="-10" cy="32" rx="60" ry="8" fill="#0B2233" opacity="0.08"/>'
      + '</g>'
      + '<g class="fin"><path d="' + PECTORAL_PATH + '" fill="#FFFFFF" opacity="0.65"/></g>'
      + '<path d="' + PELVIC_PATH + '" fill="#FFFFFF" opacity="0.5"/>'
      + '<path d="M 64,-28 C 56,-8 56,10 64,26" fill="none" stroke="#0B2233" stroke-opacity="0.15" stroke-width="2"/>'
      + '<path d="M 106,6 C 114,12 118,20 116,28" fill="none" stroke="#0B2233" stroke-opacity="0.45" stroke-width="1.5"/>'
      + '<path d="M 100,14 C 104,22 104,28 100,34" fill="none" stroke="#0B2233" stroke-opacity="0.35" stroke-width="1.5"/>'
      + '<circle cx="88" cy="-8" r="5" fill="#0B2233"/>'
      + '<circle cx="90" cy="-10" r="1.8" fill="#FFFFFF"/>';
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

  function buildPond(data) {
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
      + '<ellipse id="koiShadow" cx="440" cy="185" rx="90" ry="8" fill="#000000" opacity="0.12"/>'
      + '<g id="koi">' + fishMarkup(data.languages) + '</g>';

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
  var koi = null, shadow = null, fx = null;
  var pos = { x: 440, y: 120 }, target = { x: 440, y: 120 };
  var angle = 0, flip = false, speed = 0;
  var lastPointer = 0, lastBubble = 0;
  var bubbles = [], ripples = [];

  function toSVG(clientX, clientY) {
    var pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    var p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return {
      x: Math.max(40, Math.min(SVG_W - 40, p.x)),
      y: Math.max(50, Math.min(SVG_H - 50, p.y))
    };
  }

  function normAngle(a) {
    while (a > 180) a -= 360;
    while (a < -180) a += 360;
    return a;
  }

  function spawnBubble() {
    var rad = angle * Math.PI / 180;
    var mx = flip ? -112 : 112;
    var bx = pos.x + mx * Math.cos(rad) - 2 * Math.sin(rad);
    var by = pos.y + mx * Math.sin(rad) + 2 * Math.cos(rad);
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

  function frame(now) {
    if (reducedMotion) {
      koi.setAttribute('transform', 'translate(440 120)');
      return;
    }
    if (now - lastPointer > 4000) {
      target.x = 440 + 320 * Math.sin(now * 0.00008);
      target.y = 130 + 70 * Math.sin(now * 0.00013 + 1.3);
    }
    var dx = target.x - pos.x, dy = target.y - pos.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    speed = dist;
    pos.x += dx * 0.07;
    pos.y += dy * 0.07;
    if (dist > 2) {
      var desired = Math.atan2(dy, dx) * 180 / Math.PI;
      var newFlip = Math.cos(desired * Math.PI / 180) < 0;
      var display = newFlip ? normAngle(180 - desired) : desired;
      display = Math.max(-65, Math.min(65, display));
      if (newFlip !== flip) { angle = display; flip = newFlip; }
      else { angle += normAngle(display - angle) * 0.15; }
    }
    koi.setAttribute('transform',
      'translate(' + pos.x.toFixed(1) + ' ' + pos.y.toFixed(1) + ')'
      + ' rotate(' + angle.toFixed(1) + ') scale(' + (flip ? -1 : 1) + ' 1)');
    shadow.setAttribute('cx', pos.x.toFixed(1));
    shadow.setAttribute('cy', (pos.y + 55).toFixed(1));
    var sway = Math.max(0.45, Math.min(1.4, 1.4 - speed * 0.05));
    var tail = koi.querySelector('.tail');
    var fin = koi.querySelector('.fin');
    if (tail) tail.style.animationDuration = sway.toFixed(2) + 's';
    if (fin) fin.style.animationDuration = sway.toFixed(2) + 's';
    if (speed > 1.5 && now - lastBubble > 350) { spawnBubble(); lastBubble = now; }
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
    requestAnimationFrame(frame);
  }

  /* --- tooltips ---------------------------------------------------------- */
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
  function hideTooltip() { tooltip.hidden = true; }

  svg.addEventListener('pointermove', function (e) {
    var p = toSVG(e.clientX, e.clientY);
    target = p; lastPointer = performance.now();
    var t = e.target;
    if (t && t.dataset) {
      if (t.dataset.lang) { showTooltip(t.dataset.lang, e.clientX, e.clientY); return; }
      if (t.dataset.date) {
        var n = parseInt(t.dataset.count, 10);
        var text = n === 0
          ? 'No contributions on ' + fmtDate(t.dataset.date)
          : n + (n === 1 ? ' contribution on ' : ' contributions on ') + fmtDate(t.dataset.date);
        showTooltip(text, e.clientX, e.clientY); return;
      }
    }
    hideTooltip();
  });
  svg.addEventListener('pointerleave', hideTooltip);
  svg.addEventListener('pointerdown', function (e) {
    var p = toSVG(e.clientX, e.clientY);
    spawnRipple(p.x, p.y);
  });

  fetch('data.json')
    .then(function (r) { if (!r.ok) throw new Error('data.json ' + r.status); return r.json(); })
    .then(function (data) {
      buildPond(data);
      koi = document.getElementById('koi');
      shadow = document.getElementById('koiShadow');
      fx = document.getElementById('fx');
      if (reducedMotion) {
        koi.setAttribute('transform', 'translate(440 120)');
      } else {
        requestAnimationFrame(frame);
      }
    })
    .catch(function (err) {
      document.getElementById('stats').textContent =
        'The pond could not load its data (' + err.message + '). It redraws nightly — please try again later.';
    });
})();
