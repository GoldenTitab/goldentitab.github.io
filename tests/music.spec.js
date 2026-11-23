'use strict';
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');
const { spawn } = require('child_process');

const SILENT_WAV = fs.readFileSync(path.join(__dirname, 'silent-test.wav'));

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
const MUSIC_URL = '**/audio/Odysseus_KLICKAUD.mp3';

function routeMusic(route) {
    route.fulfill({
        status: 200,
        contentType: 'audio/wav',
        body: SILENT_WAV,
        headers: { 'Accept-Ranges': 'bytes', 'Access-Control-Allow-Origin': '*' }
    });
}

async function resetStorage(page) {
    await page.evaluate(() => {
        sessionStorage.removeItem('aliGateSeen');
        sessionStorage.removeItem('auroraMusicWanted');
        sessionStorage.removeItem('auroraMusicTime');
        localStorage.setItem('aliTheme', 'light');
        localStorage.setItem('aliLang', 'en');
    });
}

async function loadIndex(page) {
    await page.goto(BASE() + '/index.html');
    await resetStorage(page);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#gate', { state: 'visible' });
}

async function enterGateWithAudio(page) {
    await page.click('#gateEnter');
    await expect(page.locator('#gate')).toBeHidden();
    await page.waitForTimeout(500);
}

async function enterGateSilent(page) {
    await page.click('#gateEnterSilent');
    await expect(page.locator('#gate')).toBeHidden();
    await page.waitForTimeout(500);
}

test.describe('Music (Task 3)', () => {
    test('Enter click starts audio playing within ~1s', async ({ page }) => {
        await loadIndex(page);
        await page.route(MUSIC_URL, routeMusic);
        await enterGateWithAudio(page);
        await expect(async () => {
            const paused = await page.evaluate(() => document.getElementById('siteAudio').paused);
            if (paused) throw new Error('audio still paused');
        }).toPass({ timeout: 5000, interval: 200 });
        const btn = page.locator('#musicToggle');
        await expect(btn).toHaveAttribute('aria-pressed', 'true');
    });

    test('Enter without audio - no audio, state Off', async ({ page }) => {
        let musicRequested = false;
        page.on('request', req => { if (req.url().includes('Odysseus_KLICKAUD.mp3')) musicRequested = true; });
        await loadIndex(page);
        await enterGateSilent(page);
        await page.waitForTimeout(1000);
        expect(musicRequested).toBe(false);
        const btn = page.locator('#musicToggle');
        await expect(btn).toHaveAttribute('aria-pressed', 'false');
    });

    test('Music continues across pages with gesture fallback', async ({ page }) => {
        await loadIndex(page);
        await page.route(MUSIC_URL, routeMusic);
        await enterGateWithAudio(page);
        await page.waitForTimeout(1000);
        const saved = await page.evaluate(() => ({
            wanted: sessionStorage.getItem('auroraMusicWanted'),
            gateSeen: sessionStorage.getItem('aliGateSeen'),
            time: sessionStorage.getItem('auroraMusicTime')
        }));
        expect(saved.wanted).toBe('1');
        expect(saved.gateSeen).toBe('1');
        await page.route(MUSIC_URL, routeMusic);
        await page.goto(BASE() + '/experience.html');
        await page.waitForTimeout(500);
        const gateStillRemoved = await page.evaluate(() => document.getElementById('gate') === null);
        expect(gateStillRemoved).toBe(true);
        const saved2 = await page.evaluate(() => sessionStorage.getItem('auroraMusicWanted'));
        expect(saved2).toBe('1');
        await page.route(MUSIC_URL, routeMusic);
        await page.goto(BASE() + '/world.html');
        await page.waitForTimeout(500);
        const gateStillRemoved2 = await page.evaluate(() => document.getElementById('gate') === null);
        expect(gateStillRemoved2).toBe(true);
    });

    test('Toggle off then on', async ({ page }) => {
        await loadIndex(page);
        await page.route(MUSIC_URL, routeMusic);
        await enterGateWithAudio(page);
        await page.waitForTimeout(1000);
        const btn = page.locator('#musicToggle');
        await btn.click();
        await expect(btn).toHaveAttribute('aria-pressed', 'false');
        await expect(async () => {
            const paused = await page.evaluate(() => document.getElementById('siteAudio').paused);
            if (!paused) throw new Error('audio still playing');
        }).toPass({ timeout: 3000 });
        await btn.click();
        await expect(btn).toHaveAttribute('aria-pressed', 'true');
    });

    test('Audio 404 → graceful Off state', async ({ page }) => {
        await loadIndex(page);
        await page.route(MUSIC_URL, route => route.fulfill({ status: 404 }));
        await enterGateWithAudio(page);
        await page.waitForTimeout(2000);
        const btn = page.locator('#musicToggle');
        await expect(btn).toHaveAttribute('aria-pressed', 'false');
        const errors = [];
        page.on('pageerror', err => errors.push(err.message));
        await page.waitForTimeout(500);
        expect(errors.length).toBe(0);
    });

    test('No double playback on rapid toggle', async ({ page }) => {
        await loadIndex(page);
        await page.route(MUSIC_URL, routeMusic);
        await enterGateWithAudio(page);
        await page.waitForTimeout(1000);
        const btn = page.locator('#musicToggle');
        await btn.click();
        await btn.click();
        await btn.click();
        await page.waitForTimeout(500);
        await expect(btn).toHaveAttribute('aria-pressed', 'false');
    });

    test('Reload preserves music state (Off)', async ({ page }) => {
        await loadIndex(page);
        await enterGateSilent(page);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.route(MUSIC_URL, routeMusic);
        await page.waitForTimeout(500);
        const btn = page.locator('#musicToggle');
        await expect(btn).toHaveAttribute('aria-pressed', 'false');
    });
});
