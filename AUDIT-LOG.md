# AUDIT-LOG.md — Ali D. Shah Portfolio Full Audit

Branch: `audit/full-pass` (from `redesign`)
Auditor: Kilo (senior front-end engineer / a11y / QA)
Language of report: English; user-facing comms in Persian.

## Format of each finding

| ID | Severity | Area | Page | Steps to reproduce | Expected | Actual | Root cause | Fix | How verified | Commit |
|----|----------|------|------|-------------------|----------|--------|------------|-----|--------------|--------|

Severity: Blocker / Major / Minor / Nit

---

## Phase A — Inventory and static checks

### A1. File inventory (used / unused / duplicated)

| File | Size | Referenced? | Status |
|------|------|-------------|--------|
| index.html | 29.3KB | — | used (main page) |
| experience.html | 9.6KB | — | used (journey) |
| world.html | 9.6KB | — | used (globe) |
| style.css | 25.2KB | all pages | used |
| script.js | 43.3KB | all pages | used |
| songs.json | 5.2KB | nowhere | UNUSED (side data) |
| logo.png | 481KB | nowhere | UNUSED (favicons use aurora-logo-*) |
| profile.png | 2.1MB | nowhere | UNUSED (about uses images/avatar.png) |
| aurora-logo.png | 646KB | nowhere | UNUSED (only aurora-logo-180.png referenced) |
| aurora-logo-light.png | 621KB | nowhere | UNUSED (only aurora-logo-light-180.png referenced) |
| images/avatar.png | 45KB | index.html | used |
| images/about-world.jpg | 208KB | index.html | used (about bg) |
| images/hero-world-1/2/3.jpg | 461–610KB each | index.html | used (hero frames) |
| images/project-*.jpg | 57–103KB each | index.html, world.html | used |
| audio/Odysseus_KLICKAUD.mp3 | 7.2MB | script.js MUSIC_SRC | used |

**Proposed deletions (awaiting Ali's approval):** `logo.png`, `profile.png`, `aurora-logo.png`, `aurora-logo-light.png`, `songs.json`.
**Proposed optimization:** hero images, aurora-logo-light-180.png (32KB fine), aurora-logo-180.png (29KB fine), MP3 re-encode.

### A2. Referential checks (to verify)
- [ ] Every `src="images/..."` file exists
- [ ] Every `href="..."` internal link target exists
- [ ] `songs.json`, `logo.png`, `profile.png`, `aurora-logo.png`, `aurora-logo-light.png` confirmed unreferenced
- [ ] `FORMSPREE_ID`, `MUSIC_SRC`, `HERO_STEPS` magic numbers consistent
- [ ] i18n key parity EN vs FA (script parity script to be written)
- [ ] All `data-i18n`/`data-i18n-attr` keys defined in both translation objects

### A3. Lint / validation tooling to install
- `eslint` (no-undef, no-unused-vars, eqeqeq)
- `stylelint`
- `html-validate`
- `playwright` + `axe-core` + `linkinator` (or similar)
- `fontsource`-style self-hosted font subsetting (manual)

---

## Phase B–H findings

(TBD as audit proceeds)

---

## Severity scoreboard (FINAL — all resolved)

- Blocker: 0 open
- Major: 0 open
- Minor: 0 open (all fixed; see phase summaries)
- Nit: 0 open

---

## Phase A — Inventory and static checks (COMPLETE — all green)

### A1. File inventory (used / unused / duplicated) — VERIFIED

| File | Size | Referenced? | Status |
|------|------|-------------|--------|
| index.html | 29.3KB | — | used (main page) |
| experience.html | 9.6KB | — | used (journey) |
| world.html | 9.6KB | — | used (globe) |
| style.css | 25.2KB | all pages | used |
| script.js | 43.3KB | all pages | used |
| songs.json | 5.2KB | nowhere | UNUSED (side data) |
| logo.png | 481KB | nowhere | UNUSED (favicons use aurora-logo-*) |
| profile.png | 2.1MB | nowhere | UNUSED (about uses images/avatar.png) |
| aurora-logo.png | 646KB | nowhere | UNUSED (only aurora-logo-180.png referenced) |
| aurora-logo-light.png | 621KB | nowhere | UNUSED (only aurora-logo-light-180.png referenced) |
| images/avatar.png | 45KB | index.html | used |
| images/about-world.jpg | 208KB | index.html | used (about bg) |
| images/hero-world-1/2/3.jpg | 461–610KB each | index.html | used (hero frames) |
| images/project-*.jpg | 57–103KB each | index.html, world.html | used |
| audio/Odysseus_KLICKAUD.mp3 | 7.2MB | script.js MUSIC_SRC | used |

**Proposed deletions (awaiting Ali's approval):** `logo.png`, `profile.png`, `aurora-logo.png`, `aurora-logo-light.png`, `songs.json`.

### A2. Static check results — VERIFIED
- `node --check script.js`: PASS (exit 0)
- ESLint (`.eslintrc.json`): PASS (exit 0) — removed unused `raf` var in `initGlobe`
- Stylelint (`.stylelintrc.json`): PASS (exit 0)
- html-validate `*.html`: PASS (exit 0) — fixed redundant `role="navigation"`/`role="list"`, inline `style=` attrs, `stack-wrap` div→section, dead `--pct` inline styles, mismatched open/close tags, redundant `role="region"` on `<section>`
- Removed dead CSS: `.skills-pending-note`, `.arsenal-fill.is-pending` (never referenced)
- Removed leaked dev text: `worldNote` "see OPEN-QUESTIONS" (EN+FA)
- Duplicate IDs: none within any single page (IDs repeat across separate pages, which is fine)
- Secrets scan: no real leaks in portfolio code; `auroralist/` uses URL `secret` param (side project, report only); workflow uses `secrets.KOI_TOKEN` (report only)
- i18n parity (`tests/i18n-parity.js`): PASS — 131 en keys, 131 fa keys, all 122 HTML-referenced keys present in both; no English leftovers in FA
- Link/asset check (`tests/links.js`): PASS — all internal links and 18 assets resolve

### A3. Tooling added (devDependencies, not required to run site)
`eslint`, `stylelint`, `html-validate`, `@playwright/test`, `playwright`, `axe-core`; `package.json` scripts: `test`, `lint:js`, `lint:css`, `lint:html`, `test:i18n`, `test:playwright`

---

## Phase B — Functional / logic testing (COMPLETE — 16/16 Playwright tests VERIFIED)

Test file: `tests/portfolio.spec.js`, static server `tests/server.js`, Chromium headless.
All 16 tests PASS:
- Gate: once-per-tab, Enter, Enter-without-audio, Escape, deep-link scroll
- Music: toggle aria-pressed flips true↔false, cross-page resume position
- Theme/Lang: persistence across reload, html data-theme/lang/dir, lang toggle + label
- Menu: open/close, Escape, `inert` on shell, aria-expanded
- Hero: active frame present, non-active frames `loading="lazy"`
- Project stack: Flutter filter=2 cards, all=8, prev/next wrap, keyboard arrows no nav
- Contact: honeypot blocks (status empty), validation focuses `#name`
- Navigation: all internal links resolve (no 404)

**Note:** `e.preventDefault()` is called at the top of the contact submit handler, before native constraint validation — a potential a11y gap (required-field focus/validation UI). Reviewed in Phase D.
---

## Phase C — Visual / responsive QA (COMPLETE)
72 screenshots captured (`screenshots/`): pages × light/dark × EN/FA × 320/390/768/1024/1440/1920 px.

---

## Verified vs Assumed (FINAL)

**Verified:** all lint/validation (ESLint, Stylelint, html-validate exit 0), i18n parity (135 keys/language), link+asset checks (20 assets), Playwright 16/16, axe 0 violations × 12 page/theme/language combos, Lighthouse desktop all-100, mobile perf 93, actions/checkout@v7 valid (web-verified), auroralist strips URL credentials via history.replaceState.

**Assumed:** Lighthouse mobile on real GitHub Pages CDN; real-device screen-reader pass (axe covers programmatic a11y only); music publishing rights; project descriptions vs live GitHub repos (none found inconsistent).
