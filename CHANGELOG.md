# Changelog

All notable changes to the Ali D. Shah portfolio. Format: [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — Full audit & completion pass (branch `audit/full-pass`)

### Fixed
- **HTML structure**: removed redundant `role="navigation"`/`role="list"`, inline `style=` attributes, mismatched `<section>`/`</div>` tags on the project stack, dead `--pct` inline styles on arsenal bars; `stack-wrap` changed to native `<section>`.
- **Dead code**: removed `.skills-pending-note` and `.arsenal-fill.is-pending` CSS (never referenced); removed `raf` unused variable in `initGlobe`.
- **Leaked dev text**: removed "see OPEN-QUESTIONS" from the `worldNote` translation (EN + FA).
- **Accessibility (WCAG 2.2 AA)**: light-theme `--muted` darkened (#6b6b80 → #4d4d66), `--accent-dark` darkened (#0369a1 → #02527f) so small text meets 4.5:1; `is-next` project cards no longer dim via opacity (border/transform instead) so tag contrast passes; timeline headings `h3` → `h2` so heading order doesn't skip `h2`. Result: **0 axe violations** across all pages × light/dark × EN/FA.
- **i18n**: verified key parity (135 keys per language, all 122 HTML-referenced keys present in EN + FA); added missing `error404*` keys.

### Added
- **SEO**: `404.html` (bilingual), `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `favicon.svg`, `og-image.jpg` (1200×630 absolute), JSON-LD `Person` schema, Open Graph + Twitter cards, per-page titles/meta descriptions, `theme-color`, manifest links on all pages.
- **Performance**: all JPG artwork converted to WebP (~57–67% smaller; hero LCP image 485 KB → 163 KB) with `<picture>` WebP + JPG fallback; LCP hero image preloaded with `fetchpriority="high"`; non-active hero frames lazy-load.
- **Testing**: `package.json` + devDependencies (eslint, stylelint, html-validate, playwright, axe-core); Playwright smoke suite (16 tests) covering gate, music, theme/lang, menu, hero, project stack, contact form, links; i18n parity script; link checker; axe scan; screenshot matrix (72 captures).
- **Docs**: `AGENTS.md`, `AUDIT-LOG.md`, `CHANGELOG.md`, `README.md` expanded (tech stack, testing, decisions for Ali), `.gitignore`.

### Verified
- ESLint, Stylelint, html-validate: clean (exit 0)
- Playwright: 16/16 pass
- axe-core: 0 violations on all 12 page/theme/language combinations
- Lighthouse desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- Lighthouse mobile (perf): 93 (target ≥90 met)
- i18n parity + internal link/asset checks: pass

### Not done (decisions for Ali)
- Unused files `logo.png`, `profile.png`, `aurora-logo.png`, `aurora-logo-light.png`, `songs.json` kept pending your approval to delete.
- Contact email `suicidewithmeagain@gmail.com` kept as-is; consider a neutral professional address.
- Music rights for `audio/Odysseus_KLICKAUD.mp3` — confirm publishing rights or add a credit/license.
- Client-side EN/FA toggle kept (no separate `/fa/` URLs / `hreflang`).
