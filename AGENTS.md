# AGENTS.md — Instructions for AI Assistants

## Project Overview

This is Ali D. Shah's personal portfolio website, hosted on GitHub Pages at `goldentitab.github.io`. It is a **static site with no build step** — just HTML5, CSS3, and vanilla JavaScript. Open `index.html` directly in a browser or serve the repo root with any static file server.

**Owner:** Ali D. Shah (Computer Engineering student, UI/UX designer & Flutter developer, Kerman, Iran)

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main portfolio page (hero, about, skills, projects, journey teaser, contact) |
| `experience.html` | Journey/timeline page |
| `world.html` | Draggable wireframe globe + project tile gallery |
| `style.css` | All styles; CSS variables, breakpoints 360/720/1024, light & dark themes |
| `script.js` | Interaction, i18n (EN/FA), music, gate, menu, hero scroll-frame, stack, globe, contact form |
| `songs.json` | Music track data (not used by the portfolio; side data) |

## Tech Stack

- **Languages:** HTML5, CSS3, vanilla JavaScript (ES5-style IIFE, no modules/build tools)
- **Hosting:** GitHub Pages (this repository, root)
- **i18n:** Bilingual English (en) / Persian (fa), RTL support, all strings in `script.js` `translations` object
- **Themes:** light (`#f6eef2`) / dark (`#0a0a14`), stored in `localStorage` as `aliTheme`
- **Music:** `audio/Odysseus_KLICKAUD.mp3`, configured via `MUSIC_SRC` in `script.js`
- **Contact form:** Formspree (`FORMSPREE_ID` in `script.js`); falls back to `mailto:` when empty
- **Images:** `images/` — hero frames, project artwork, logos, avatar

## Coding Conventions

- **No build step, no framework, no font CDN.** Vanilla JS only.
- **CSS:** Use CSS variables (`--accent`, `--bg`, `--text`, etc.) defined in `:root` and theme blocks. Respect `prefers-reduced-motion` and `prefers-reduced-data`. No inline `style=` attributes.
- **JS:** IIFE module pattern (`(function(){ 'use strict'; ... })()`). Feature-detect `localStorage`/`sessionStorage` (they can throw in private mode — use `lsGet`/`lsSet`/`ssGet`/`ssSet` wrappers). Check `prefers-reduced-data` / `navigator.connection.saveData` before heavy effects.
- **i18n:** All user-facing strings use `data-i18n` / `data-i18n-attr` attributes and are looked up via the `t(key)` function. Add new keys to both `en` and `fa` translation objects in `script.js`.
- **HTML:** Add `data-i18n` to translatable text; `data-i18n-attr="aria-label:key"` for attributes. Keep `lang`/`dir` attributes in sync (set by `setLanguage`). Add `<noscript>` fallback for non-JS users.
- **Accessibility:** skip-link, `aria-modal`, `inert` attribute on shell during gate/menu, focus management, `prefers-reduced-motion`.
- **Fonts:** Self-host Vazirmatn (`fonts/*.woff2`, OFL-1.1). Add `@font-face` with `font-display: swap` and `unicode-range`. Preload only the critical weight.
- **Cache-busting:** Append `?v=YYYYMMDD` to `style.css` and `script.js` references; bump the date on changes.
- **Meta:** `<meta name="referrer" content="strict-origin-when-cross-origin">` on all pages.
- **Music:** `audio/Odysseus_KLICKAUD.mp3` — never replace, re-encode, or remove. Start only on Enter gesture; resume across pages via `sessionStorage` (`auroraMusicWanted` / `auroraMusicTime`).

## Important Values / Magic Numbers (do not change without updating all references)

- `HERO_STEPS = 30` — hero scroll-frame steps simulated from 3 key images
- `FORMSPREE_ID = "xkjrprpb"` — contact form endpoint (empty = mailto fallback)
- `MUSIC_SRC = "audio/Odysseus_KLICKAUD.mp3"` — site music file (7.1 MB, loop, preload=none)
- `CACHE_BUST = "20261123"` — append `?v=20261123` to style.css/script.js; bump on changes
- Skill levels (from `index.html` comment): HTML 100, CSS 60, Figma 80, Flutter 80, JavaScript 20, Dart 80, WordPress 60, Git/GitHub 70, Firebase 50. Level scale: 90+ Master, 70–89 Advanced, 50–69 Intermediate, below 50 Beginner.

## Side Directories (not part of the portfolio UI)

- `auroralist/` — `reset.html`, `verify.html` (separate side pages)
- `koi/` — `index.html`, `pond.js`, `generate_pond.py`, `extract_sprite.py`, `data.json`, `sprite.json`, SVGs (separate koi pond project)

## When Making Changes

1. Test by opening `index.html` (and `experience.html` / `world.html`) directly in a browser.
2. Check both themes (light/dark toggle) and both languages (EN/FA toggle, note RTL layout for FA).
3. Verify the enter gate works (once per tab via `sessionStorage` `aliGateSeen`).
4. Verify music on/off and cross-page resume (sessionStorage `auroraMusicWanted` / `auroraMusicTime`).
5. Verify the contact form honeypot (`_gotcha`) still works.
6. If adding a project card, update `index.html` stack and `songs.json` is unrelated (leave alone).
7. No lint/typecheck commands exist in this repo (no package.json).
8. Bump `CACHE_BUST` date in AGENTS.md and `?v=` on CSS/JS references when changing style.css or script.js.
9. Add new font weights to `fonts/` only as `.woff2` with `@font-face` + `font-display: swap`.

## Commit Style

Keep commits concise and descriptive. This is a personal portfolio — corrections to project descriptions, broken links, or factual details are welcome.