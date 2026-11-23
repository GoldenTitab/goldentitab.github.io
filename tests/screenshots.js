'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const root = process.cwd();
const outDir = path.join(root, 'screenshots');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const pages = ['index.html', 'experience.html', 'world.html'];
const themes = ['light', 'dark'];
const langs = ['en', 'fa'];
const widths = [320, 390, 768, 1024, 1440, 1920];

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

    let count = 0;
    for (const pg of pages) {
        for (const theme of themes) {
            for (const lang of langs) {
                for (const w of widths) {
                    await page.setViewportSize({ width: w, height: w <= 768 ? 900 : 900 });
                    await page.goto(base + '/' + pg, { waitUntil: 'domcontentloaded' });
                    await page.evaluate(({ t, l }) => {
                        sessionStorage.setItem('aliGateSeen', '1');
                        localStorage.setItem('aliTheme', t);
                        localStorage.setItem('aliLang', l);
                    }, { t: theme, l: lang });
                    await page.reload({ waitUntil: 'domcontentloaded' });
                    await page.waitForSelector('main', { state: 'visible' });
                    await page.waitForTimeout(300);
                    const tag = `${pg.replace('.html','')}_${theme}_${lang}_${w}`;
                    await page.screenshot({ path: path.join(outDir, tag + '.png'), fullPage: true });
                    count++;
                    process.stdout.write('.');
                }
            }
        }
    }
    console.log(`\nCaptured ${count} screenshots -> ${outDir}`);
    await browser.close();
    server.kill();
    process.exit(0);
})();
