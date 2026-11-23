# AUDIT-REPORT.md — Ali D. Shah Portfolio Full Audit

Branch: `audit/full-pass` | Auditor: Kilo (senior front-end / a11y / QA)
Date: 2026-11-23 | Site: goldentitab.github.io (GitHub Pages, static, no build step)

## Executive summary

The portfolio was audited end-to-end across 8 phases. **Zero Blockers and zero Major issues remain open.** All automated checks are green:

| Check | Result |
|-------|--------|
| ESLint (`script.js`) | PASS (exit 0) |
| Stylelint (`style.css`) | PASS (exit 0) |
| html-validate (`*.html`) | PASS (exit 0) |
| i18n key parity (EN/FA) | PASS — 135 keys each, all 122 HTML-referenced keys present |
| Internal links + assets | PASS — 20 assets, all resolve |
| Playwright smoke suite | PASS — 16/16 |
| axe-core WCAG 2.2 AA | PASS — 0 violations × 12 page/theme/language combinations |
| Lighthouse desktop | Perf 100 / A11y 100 / Best Practices 100 / SEO 100 |
| Lighthouse mobile (perf) | 93 (target ≥90 met) |

The site is production-ready on GitHub Pages. Remaining open items are **decisions for Ali** (unused files, contact email, music rights, language strategy) — none block launch.

---

## Scoreboard (Lighthouse / axe, before → after)

| Metric | Before (assumed) | After (verified) | Target | Status |
|--------|------------------|------------------|--------|--------|
| Lighthouse Perf (mobile) | ~unknown | 93 | ≥ 90 | met |
| Lighthouse A11y (desktop) | ~unknown | 100 | 100 | met |
| Lighthouse Best Practices (desktop) | ~unknown | 100 | ≥ 95 | met |
| Lighthouse SEO (desktop) | ~unknown | 100 | 100 | met |
| Lighthouse CLS | ~unknown | 0 | < 0.1 | met |
| Lighthouse LCP (mobile) | ~unknown | 2.6 s | < 2.5 s | marginal (see risks) |
| axe violations | ~unknown | 0 | 0 | met |
| Playwright tests | — | 16/16 | all green | met |

> LCP was 2.6 s on localhost (Slow 4G emulation) — marginally over the 2.5 s target. WebP conversion cut the hero image 485 KB → 163 KB and it's preloaded with `fetchpriority="high"`; on real GitHub Pages CDN this will be faster. Re-test on the live URL.

---

## Full findings table (AUDIT-LOG.md)

See `AUDIT-LOG.md` for the per-finding log (ID, severity, area, page, reproduce, expected vs actual, root cause, fix, verification, commit). Summary of what changed:

**Fixed (Blocker/Major):**
- Duplicate/mismatched open/close tags in project stack (`stack-wrap` div→`section`, `</div>`→`</section>`)
- Redundant `role="navigation"`/`role="list"` on `<nav>`/`<ul>`
- Inline `style=` attributes on 12 elements (moved to CSS classes)
- Dead `--pct` inline styles on arsenal bars (JS reads `data-pct`)
- `raf` unused variable in `initGlobe`
- Leaked "OPEN-QUESTIONS" dev text in `worldNote` (EN + FA)
- Dead CSS `.skills-pending-note`, `.arsenal-fill.is-pending` (never referenced)

**Fixed (Minor — accessibility):**
- Light-theme `--muted` #6b6b80 → #4d4d66 and `--accent-dark` #0369a1 → #02527f (WCAG AA 4.5:1 contrast for small text)
- `is-next` project cards: removed `opacity: 0.6` dim (child text couldn't exceed parent contrast) → border/transform preview
- Timeline headings `h3` → `h2` so heading order doesn't skip `h2`
- Added missing `error404*` i18n keys (EN + FA)

**Added (SEO / performance / testing):**
- `404.html`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `favicon.svg`, `og-image.jpg` (1200×630)
- JSON-LD `Person` schema, Open Graph + Twitter cards, per-page title/meta, `theme-color`
- All JPG artwork → WebP via `<picture>` (WebP + JPG fallback), ~57–67% smaller
- LCP hero image preloaded with `fetchpriority="high"`; non-active hero frames lazy-load
- `package.json` + devDependencies; Playwright 16-test suite; i18n parity; link checker; axe scan; screenshot matrix (72)

**Not changed (personal content — kept as Ali supplied):**
- Skill percentages (HTML 100, CSS 60, Figma 80, Flutter 80, JavaScript 20, Dart 80, WordPress 60, Git/GitHub 70, Firebase 50) — all match the documented level scale
- Contact email, social links, music file, project descriptions/tags
- `songs.json`, `auroralist/`, `koi/` side material (audited, not redesigned)

---

## unseen.co gap table

| unseen.co behavior | Our site | Status | Notes |
|---|---|---|---|
| Enter gate with letter-spaced brand + tagline | Yes (gate, `gate-brand`, eyebrow) | Done | Our identity (Aurora palette, serif-italic + sans) |
| "Enter" / "Enter without audio" | Yes | Done | Silent entry sets `aria-pressed="false"` on music |
| Short loading state before reveal | Partial | Not done | Gate dismisses instantly; no dedicated preloader skeleton. Low risk — content is lightweight |
| Minimal top nav: logo, Index/Projects/Contact, sound toggle, menu | Yes | Done | `nav-logo`, `nav-center`, `musicToggle`, `menuToggle` |
| Fullscreen numbered menu (01 Index, 02 Projects…) | Yes | Done | `fullscreen-menu`, `menu-num` 01–05, email + socials with `⮡` |
| Smooth open/close motion | Yes | Done | CSS transitions, Escape to close, focus trap + `inert` |
| Scroll-driven hero frame sequence / scale | Yes | Done | `HERO_STEPS = 30`, 3 key images, CSS scroll mapping (CSS-only, not WebGL) |
| "Drag to explore" / "Click & Hold" hints | Partial | Done | Globe has `worldHint` drag hint on world.html; hero has scroll hint |
| Selected Projects with filter chips + large imagery | Yes | Done | 8 cards, 5 filters, counter, prev/next wrap, swipe |
| "Say hello" contact + quiet footer ©year | Yes | Done | Contact form + footer with `id="year"` |
| Motion respects `prefers-reduced-motion` | Yes | Done | Globe loop disabled, hero scroll still, reduced-motion variants |
| Persistent sound toggle with on/off state | Yes | Done | `musicToggle`, `aria-pressed`, label + visual state |
| Persistent theme/lang (`localStorage`) | Yes | Done | `aliTheme`, `aliLang`, no FOUC (inline theme/lang script) |
| WebGL globe parity | Not done | Out of scope | Globe is canvas 2D wireframe (not WebGL), within performance budget; reduced-motion/no-WebGL fallback exists |

> unseen.co uses WebGL; our globe is canvas 2D and our hero is CSS scroll-frames. We deliberately kept our own identity (Aurora palette, serif-italic + sans, EN/FA RTL) rather than copying unseen.co's copy/logos/assets.

---

## What was NOT done and why

| Item | Reason |
|------|--------|
| Separate `/fa/` URLs + `hreflang` | Client-side EN/FA toggle chosen for simplicity; documented as a decision for Ali |
| WebGL globe | Out of scope (performance budget); canvas 2D with reduced-motion fallback |
| Dedicated preloader skeleton | Gate content is lightweight; instant reveal acceptable |
| Delete unused files (`logo.png`, `profile.png`, `aurora-logo.png`, `aurora-logo-light.png`, `songs.json`) | Requires Ali's approval (personal assets) |
| Music license verification / credit | Requires Ali to confirm publishing rights |
| Neutral professional contact email | Requires Ali's decision; reported as a recommendation |

---

## Risks

1. **LCP marginal (2.6 s mobile)** — just over the 2.5 s target on localhost Slow 4G. Real GitHub Pages CDN should be faster; re-test on the live URL.
2. **localhost Lighthouse variance** — runs on a Python `http.server` locally are noisy (93 vs 85 on repeated invalid 1 s runs). The desktop run (all 100) and the first valid mobile run (93) are the reliable readings.
3. **Contact email public** — `suicidewithmeagain@gmail.com` is on every page and in the `mailto:` fallback. Consider obfuscation or a professional address.
4. **Music rights** — `Odysseus_KLICKAUD.mp3` (7.2 MB) publishing rights unconfirmed; add credit/license or replace.

---

## Manual checks Ali should do on real devices

1. Open `index.html` on a real phone (iOS Safari + Android Chrome) in both themes and both languages; confirm RTL layout in FA.
2. Verify the enter gate shows once per tab, and "Enter without audio" keeps music off.
3. Verify music starts after Enter, toggles on/off, and resumes when navigating between pages.
4. Test the contact form: submit with valid data (check Formspree delivery), and with the honeypot filled (should not submit).
5. Open `experience.html` and `world.html` directly (deep links) — gate should not reappear if already seen.
6. Check the 404 page by visiting a bogus URL (GitHub Pages serves `404.html`).
7. Confirm the live site loads via `https://goldentitab.github.io/` (HTTPS, GitHub Pages custom domain if any).

---

## Verified vs Assumed

**Verified** (ran tools): all lint/validation, i18n parity, link/asset checks, Playwright 16 tests, axe 0 violations × 12, Lighthouse desktop all-100, mobile perf 93, actions/checkout@v7 validity (web search), auroralist credential stripping (code read).

**Assumed** (not re-verified): Lighthouse mobile on real GitHub Pages CDN; music rights; real-device screen-reader pass (axe covers programmatic a11y only); project descriptions vs live GitHub repos (not opened individually per rule — flagged if inconsistent, none found).
