'use strict';
// Task 7: Image verification on phone emulations (Chromium + WebKit)
const { test, expect, devices } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');

let server;
test.beforeAll(() => {
    server = spawn(process.execPath, [path.join(__dirname, 'server.js')], {
        env: { ...process.env }, stdio: ['ignore', 'pipe', 'pipe']
    });
    server.stdout.on('data', d => { if (d.toString().includes('TEST_SERVER_PORT=')) global.TEST_PORT = d.toString().split('=')[1].trim(); });
    return new Promise(r => { const t = setInterval(() => { if (global.TEST_PORT) { clearInterval(t); r(); } }, 50); });
});
test.afterAll(() => { if (server) server.kill(); });

const BASE = () => `http://localhost:${global.TEST_PORT}`;

async function dismissGate(page) {
    await page.evaluate(() => {
        sessionStorage.setItem('aliGateSeen', '1');
        localStorage.setItem('aliTheme', 'light');
        localStorage.setItem('aliLang', 'en');
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main', { state: 'visible' });
    await page.waitForTimeout(300);
}

async function checkAllImages(page, label) {
    // Scroll to bottom to trigger lazy-loading of all images, then back to top
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const result = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const issues = [];
        for (const img of imgs) {
            const rect = img.getBoundingClientRect();
            const src = img.currentSrc || img.src;
            if (!img.complete || img.naturalWidth === 0) {
                issues.push(`IMG not loaded: ${src} (complete=${img.complete}, naturalWidth=${img.naturalWidth})`);
            }
            if (rect.width === 0 || rect.height === 0) {
                issues.push(`IMG zero-size box: ${src} (${rect.width}x${rect.height})`);
            }
        }
        return { total: imgs.length, issues };
    });
    if (result.issues.length > 0) {
        console.log(`${label}: ${result.total} images, ISSUES: ${result.issues.join('; ')}`);
    } else {
        console.log(`${label}: ${result.total} images, all OK`);
    }
    expect(result.issues).toEqual([]);
}

const phoneConfigs = [
    { name: 'iPhone 12 (390x844, DPR 3)', viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 },
    { name: 'Pixel 7 (393x853, DPR 3)', viewport: { width: 393, height: 853 }, deviceScaleFactor: 3 },
    { name: 'iPhone SE (375x667, DPR 2)', viewport: { width: 375, height: 667 }, deviceScaleFactor: 2 },
    { name: 'Samsung S21 (360x800, DPR 3)', viewport: { width: 360, height: 800 }, deviceScaleFactor: 3 },
];

for (const cfg of phoneConfigs) {
    test(cfg.name + ' - index.html light EN', async ({ browser }) => {
        const context = await browser.newContext({
            ...cfg.viewport,
            deviceScaleFactor: cfg.deviceScaleFactor,
            userAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36'
        });
        const page = await context.newPage();
        await page.goto(BASE() + '/index.html', { waitUntil: 'domcontentloaded' });
        await dismissGate(page);
        await page.waitForTimeout(1000);
        await checkAllImages(page, cfg.name + ' index EN');
        await context.close();
    });

    test(cfg.name + ' - index.html dark FA', async ({ browser }) => {
        const context = await browser.newContext({
            ...cfg.viewport,
            deviceScaleFactor: cfg.deviceScaleFactor,
            userAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36'
        });
        const page = await context.newPage();
        await page.goto(BASE() + '/index.html', { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => {
            sessionStorage.setItem('aliGateSeen', '1');
            localStorage.setItem('aliTheme', 'dark');
            localStorage.setItem('aliLang', 'fa');
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.setAttribute('lang', 'fa');
            document.documentElement.setAttribute('dir', 'rtl');
        });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('main', { state: 'visible' });
        await page.waitForTimeout(1000);
        await checkAllImages(page, cfg.name + ' index FA');
        await context.close();
    });

    test(cfg.name + ' - world.html light EN', async ({ browser }) => {
        const context = await browser.newContext({
            ...cfg.viewport,
            deviceScaleFactor: cfg.deviceScaleFactor,
            userAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36'
        });
        const page = await context.newPage();
        await page.goto(BASE() + '/world.html', { waitUntil: 'domcontentloaded' });
        await dismissGate(page);
        await page.waitForTimeout(1000);
        await checkAllImages(page, cfg.name + ' world EN');
        await context.close();
    });
}

test.describe('Images on iPhone (WebKit, Task 7)', () => {
    const iphone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 };

    test('iPhone 12 Pro - index.html light EN', async ({ browser }) => {
        const context = await browser.newContext({
            ...iphone.viewport,
            deviceScaleFactor: iphone.deviceScaleFactor,
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
        });
        const page = await context.newPage();
        await page.goto(BASE() + '/index.html', { waitUntil: 'domcontentloaded' });
        await dismissGate(page);
        await page.waitForTimeout(1000);
        await checkAllImages(page, 'iPhone 12 Pro index EN');
        await context.close();
    });

    test('iPhone 12 Pro - world.html light EN', async ({ browser }) => {
        const context = await browser.newContext({
            ...iphone.viewport,
            deviceScaleFactor: iphone.deviceScaleFactor,
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
        });
        const page = await context.newPage();
        await page.goto(BASE() + '/world.html', { waitUntil: 'domcontentloaded' });
        await dismissGate(page);
        await page.waitForTimeout(1000);
        await checkAllImages(page, 'iPhone 12 Pro world EN');
        await context.close();
    });
});
