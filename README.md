# Ali D. Shah — Portfolio

> Personal portfolio website for Ali D. Shah, UI/UX designer and Flutter developer, and Computer Engineering student: about, skills, projects, journey, world and contact, in a responsive, bilingual (EN/FA) static site inspired by unseen.co.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Overview

This repository is the source of the personal site hosted on GitHub Pages at the `goldentitab.github.io` address. It presents Ali D. Shah as a designer and developer: a Computer Engineering student building simple, intuitive digital experiences, with a focus on UI/UX design, Flutter, and product thinking.

The journey told on the site starts with HTML, CSS and basic JavaScript, expands into WordPress and UI/UX design with Figma, and continues into Flutter and Dart for mobile apps. The site itself is built the same way: a static, responsive site with no build step, so it loads fast and is easy to maintain.

## Features

- **About** — who Ali is, what he works on, and the belief behind his work: good design is invisible, guiding people naturally without getting in the way.
- **Skills** — the tools and technologies he uses: UI/UX (Figma, wireframing, prototyping, user flows, design thinking, usability testing), front-end (HTML5, CSS3, JavaScript, WordPress, responsive design), and mobile (Flutter and Dart). Skill percentages match the level scale (90+ Master, 70–89 Advanced, 50–69 Intermediate, below 50 Beginner).
- **Projects** — selected work (8 cards), filter chips (All / Flutter / Web / Dart / Design), keyboard + touch + swipe support, RTL-safe.
- **Journey** — a timeline from starting programming, through web development and UI/UX design, to learning WordPress and then Flutter and Dart (`experience.html`).
- **World** — a draggable wireframe globe plus a tile gallery of every project (`world.html`).
- **Enter gate + music** — unseen-style entry screen (once per tab) with optional background music that resumes across pages.
- **Contact** — a "Let's work together" section and a "Get in touch" form, with an availability note for freelance work, honeypot spam protection, and a `mailto:` fallback.
- **404 page** — bilingual not-found page (`404.html`) in the site's style.
- **Responsive design** — layout adapts to mobile and desktop, with a bilingual (EN/FA) RTL interface.
- **SEO** — per-page titles/meta descriptions, Open Graph image, JSON-LD `Person` schema, sitemap, robots.txt, web app manifest, favicons.
- **Performance** — hero/project/about images as WebP with JPG fallback (`<picture>`), LCP image preloaded, lazy-loaded frames, no render-blocking beyond critical CSS/JS.

## Tech Stack

| Area | Technology |
| --- | --- |
| Site type | Static website, no build step |
| Languages | HTML5, CSS3, vanilla JavaScript (IIFE, no modules) |
| Hosting | GitHub Pages (this repository, root) |
| Interface | Bilingual interface (language toggle EN/FA, RTL for Persian) |
| i18n | `data-i18n` / `data-i18n-attr` keys in `script.js` (135 keys per language) |
| Themes | light (`#f6eef2`) / dark (`#0a0a14`), stored as `aliTheme` |
| Music | `audio/Odysseus_KLICKAUD.mp3` (cross-page resume, preload=none) |
| Contact form | Formspree (`FORMSPREE_ID`) with honeypot; `mailto:` fallback |
| Images | WebP (`<picture>` with JPG fallback), `srcset`-ready, LCP preloaded |
| Favicons | `favicon.svg`, `aurora-logo-*-180.png`, `manifest.webmanifest`, `theme-color` |

## Getting Started

### Prerequisites

No build step or package installation is required to run the site. Any modern browser is enough.

The repository also includes optional dev tooling (`package.json`) for linting, validation, and Playwright tests — these are **not required** to view or deploy the site.

### Installation

```bash
git clone https://github.com/GoldenTitab/goldentitab.github.io.git
cd goldentitab.github.io
```

### Run

Open `index.html` directly in a browser, or serve the repository root with any static file server. The live site is published automatically by GitHub Pages from this repository.

### Test (optional dev tooling)

```bash
npm install            # devDependencies only: eslint, stylelint, html-validate, playwright, axe-core
npm test               # lint + HTML validation + i18n parity + axe
npm run test:playwright # browser smoke tests (gate, music, theme/lang, menu, hero, stack, form, links)
```

## Project Structure

```
index.html / experience.html / world.html / 404.html   # Pages
style.css, script.js                                    # Styles; interaction, i18n (EN/FA), music, gate
images/, audio/                                         # Artwork (WebP + JPG fallback) and site music
robots.txt, sitemap.xml, manifest.webmanifest           # SEO
tests/                                                  # Playwright spec, i18n parity, link checker, axe scan, screenshot capturer
package.json                                            # dev tooling (not required to run the site)
auroralist/, koi/                                       # Separate side pages (not part of the portfolio UI)
.screenshots/                                           # Phase-C responsive screenshot matrix (gitignored)
AUDIT-LOG.md, AUDIT-REPORT.md, CHANGELOG.md             # Full audit trail
```

## Decisions for Ali (review these)

- **Unused files**: `logo.png` (481 KB), `profile.png` (2.1 MB), `aurora-logo.png`, `aurora-logo-light.png`, and `songs.json` are not referenced by the portfolio. Safe to delete if you no longer need them — say the word and I'll remove them.
- **Contact email**: `suicidewithmeagain@gmail.com` appears on every page and in the `mailto:` fallback. Consider a neutral professional address as a single source of truth (recommended, not applied).
- **Music rights**: confirm you have the right to publish `audio/Odysseus_KLICKAUD.mp3`; add a credit/license line, or replace with a licensed track.
- **Language strategy**: the site uses a client-side EN/FA toggle on a single set of URLs (no separate `/fa/` pages, no `hreflang`). This is simple and works well; let me know if you'd prefer language-specific URLs.

## Contributing

This is a personal portfolio. Corrections to a project description, a broken link, or a factual detail about the work are welcome as issues.

## License

No license file is present in this repository.
