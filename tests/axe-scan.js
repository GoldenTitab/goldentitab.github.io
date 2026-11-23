'use strict';
// Phase D: axe-core accessibility scan on each page (light/dark × en/fa).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const axeSource = require('axe-core').source;

const root = process.cwd();
let server;
(async () => {
    server = spawn(process.execPath, [path.join(root, 'tests/server.js')], {
        env: { ...process.env }, stdio: ['ignore', 'pipe', 'pipe']
    });
    let port;
    server.stdout.on('data', d => { const m = d.toString().match(/TEST_SERVER_PORT=(\d+)/); if (m) port = parseInt(m[1]); });
    await new Promise(r => { const t = setInterval(() => { if (port) { clearInterval(t); r(); } }, 50); });

    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    const base = `http://localhost:${port}`;

    const pages = ['index.html', 'experience.html', 'world.html'];
    const themes = ['light', 'dark'];
    const langs = ['en', 'fa'];

    let totalViolations = 0;
    const results = [];

    for (const pg of pages) {
        for (const theme of themes) {
            for (const lang of langs) {
                await page.goto(base + '/' + pg, { waitUntil: 'domcontentloaded' });
                await page.evaluate(({ t, l }) => {
                    sessionStorage.setItem('aliGateSeen', '1');
                    localStorage.setItem('aliTheme', t);
                    localStorage.setItem('aliLang', l);
                }, { t: theme, l: lang });
                await page.reload({ waitUntil: 'domcontentloaded' });
                await page.waitForSelector('main', { state: 'visible' });
                await page.waitForTimeout(300);
                await page.addScriptTag({ content: axeSource });
                const scan = await page.evaluate(() => new Promise(resolve => {
                    axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'section508', 'best-practice'] }, (err, res) => {
                        resolve({ violations: res.violations, passes: res.passes, incomplete: res.incomplete });
                    });
                }));
                const label = `${pg} [${theme}/${lang}]`;
                results.push({ label, violations: scan.violations.length, passes: scan.passes.length });
                totalViolations += scan.violations.length;
                for (const v of scan.violations) {
                    console.log(`  [${label}] ${v.id} (${v.impact}) — ${v.description} :: ${v.nodes.map(n => n.target.join(',')).join('; ')}`);
                }
            }
        }
    }

    console.log('\n=== AXE SUMMARY ===');
    results.forEach(r => console.log(`  ${r.label}: ${r.violations} violations, ${r.passes} passes`));
    console.log(`Total violations: ${totalViolations}`);
    await browser.close();
    server.kill();
    process.exit(totalViolations > 0 ? 1 : 0);
})();
