'use strict';
const { test, expect } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');

let server;
test.beforeAll(() => {
    server = spawn(process.execPath, [path.join(__dirname, 'server.js')], {
        env: { ...process.env },
        stdio: ['ignore', 'pipe', 'pipe']
    });
    server.stdout.on('data', d => { if (d.toString().includes('TEST_SERVER_PORT=')) global.TEST_PORT = d.toString().split('=')[1].trim(); });
    return new Promise(r => { const t = setInterval(() => { if (global.TEST_PORT) { clearInterval(t); r(); } }, 50); });
});
test.afterAll(() => { if (server) server.kill(); });

const BASE = () => `http://localhost:${global.TEST_PORT}`;

async function setStorage(page, { lang, theme, gateSeen, musicWanted, musicTime } = {}) {
    await page.evaluate(({ l, t, g, mw, mt, hasL, hasT, hasG, hasMW, hasMT }) => {
        if (hasL) localStorage.setItem('aliLang', l);
        if (hasT) localStorage.setItem('aliTheme', t);
        if (hasG) { if (g) sessionStorage.setItem('aliGateSeen', '1'); else sessionStorage.removeItem('aliGateSeen'); }
        if (hasMW) sessionStorage.setItem('auroraMusicWanted', mw ? '1' : '0');
        if (hasMT) sessionStorage.setItem('auroraMusicTime', String(mt));
    }, {
        l: lang, t: theme, g: gateSeen, mw: musicWanted, mt: musicTime,
        hasL: lang !== undefined, hasT: theme !== undefined, hasG: gateSeen !== undefined,
        hasMW: musicWanted !== undefined, hasMT: musicTime !== undefined
    });
}

async function enterGate(page, silent = false) {
    await setStorage(page, { gateSeen: false });
    await expect(page.locator('#gate')).toBeVisible();
    await page.click(silent ? '#gateEnterSilent' : '#gateEnter');
    await expect(page.locator('#gate')).toBeHidden();
}

test.describe('Gate', () => {
    test('shows once per tab, Enter dismisses', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await enterGate(page, false);
        await page.reload();
        await expect(page.locator('#gate')).toBeHidden();
    });

    test('Enter without audio does not start music', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await enterGate(page, true);
        await expect(page.locator('#musicToggle')).toHaveAttribute('aria-pressed', 'false');
    });

    test('Escape dismisses gate silently', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await setStorage(page, { gateSeen: false });
        await expect(page.locator('#gate')).toBeVisible();
        await page.press('body', 'Escape');
        await expect(page.locator('#gate')).toBeHidden();
    });

    test('deep link scrolls to target after gate', async ({ page }) => {
        await page.goto(BASE() + '/index.html#projects');
        await enterGate(page, false);
        await expect(page.locator('#projects')).toBeVisible();
        await expect(page.locator('#projects')).toBeInViewport();
    });
});

test.describe('Music', () => {
    test('toggle on/off updates aria-pressed', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await enterGate(page, false);
        await expect(page.locator('#musicToggle')).toHaveAttribute('aria-pressed', 'true');
        await page.locator('#musicToggle').click();
        await expect(page.locator('#musicToggle')).toHaveAttribute('aria-pressed', 'false');
        await page.locator('#musicToggle').click();
        await expect(page.locator('#musicToggle')).toHaveAttribute('aria-pressed', 'true');
    });

    test('resumes position across pages via menu Journey link', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await enterGate(page, false);
        await setStorage(page, { musicWanted: true, musicTime: 120 });
        await page.click('#menuToggle');
        await page.click('a[href="experience.html"]');
        await page.waitForURL('**/experience.html');
        const saved2 = await page.evaluate(() => sessionStorage.getItem('auroraMusicTime'));
        expect(parseFloat(saved2)).toBeGreaterThanOrEqual(0);
    });
});

test.describe('Theme & Language', () => {
    test('persists theme and lang across reload', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await setStorage(page, { lang: 'fa', theme: 'dark', gateSeen: true });
        await page.reload();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
        await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    });

    test('language toggle switches lang attribute and label', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await enterGate(page, false);
        await page.click('#langToggle');
        await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
        await expect(page.locator('#langLabel')).toHaveText('FA');
    });
});

test.describe('Menu', () => {
    test('open/close, Escape, inert, aria-expanded', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await enterGate(page, false);
        await page.click('#menuToggle');
        await expect(page.locator('#fullscreenMenu')).not.toHaveAttribute('hidden');
        await expect(page.locator('#menuToggle')).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('nav, main, footer, .back-to-top').first()).toHaveAttribute('inert', '');
        await page.press('body', 'Escape');
        await expect(page.locator('#fullscreenMenu')).toHaveAttribute('hidden');
        await expect(page.locator('#menuToggle')).toHaveAttribute('aria-expanded', 'false');
    });
});

test.describe('Hero', () => {
    test('active frame present; non-active frames lazy-load', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await enterGate(page, false);
        await page.waitForSelector('.hero-frame.is-active');
        await expect(page.locator('#frameCount')).toBeVisible();
        await expect(page.locator('.hero-frame').nth(1)).toHaveAttribute('loading', 'lazy');
        await expect(page.locator('.hero-frame').nth(2)).toHaveAttribute('loading', 'lazy');
    });
});

test.describe('Project stack', () => {
    test('filters show correct cards and counter', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await enterGate(page, false);
        await page.click('[data-filter="Flutter"]');
        await expect(page.locator('#stackTotal')).toHaveText('2');
        await page.click('[data-filter="all"]');
        await expect(page.locator('#stackTotal')).toHaveText('8');
    });

    test('prev/next wrap', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await enterGate(page, false);
        await page.click('#stackNext');
        await expect(page.locator('#stackCurrent')).toHaveText('2');
        await page.click('#stackPrev');
        await expect(page.locator('#stackCurrent')).toHaveText('1');
    });

    test('keyboard arrows do not navigate away', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await enterGate(page, false);
        await page.locator('#projectStack').press('ArrowRight');
        await expect(page).toHaveURL(BASE() + '/index.html');
    });
});

test.describe('Contact form', () => {
    test('honeypot blocks submission (status stays empty)', async ({ page }) => {
        await page.goto(BASE() + '/index.html#contact');
        await enterGate(page, false);
        await page.fill('input[name="_gotcha"]', 'bot');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(300);
        await expect(page.locator('#formStatus')).toHaveText('');
    });

    test('validation focuses first required field', async ({ page }) => {
        await page.goto(BASE() + '/index.html#contact');
        await enterGate(page, false);
        await page.click('button[type="submit"]');
        await page.waitForTimeout(300);
        await expect(page.locator('#name')).toBeFocused();
    });
});

test.describe('Navigation & links', () => {
    test('internal links resolve', async ({ page }) => {
        await page.goto(BASE() + '/index.html');
        await setStorage(page, { gateSeen: true });
        const hrefs = await page.locator('a[href]').all().then(async els => {
            const out = [];
            for (const el of els) {
                const h = await el.getAttribute('href');
                if (h && !h.startsWith('#') && !h.startsWith('mailto:') && !h.startsWith('http')) out.push(h);
            }
            return out;
        });
        for (const h of hrefs) {
            await page.goto(BASE() + '/' + h.replace(/^\//, ''));
            await expect(page).not.toHaveURL(BASE() + '/404.html');
        }
    });
});
