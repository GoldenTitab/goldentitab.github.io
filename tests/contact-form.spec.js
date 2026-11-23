'use strict';
const { test, expect } = require('@playwright/test');
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

async function enterGate(page) {
    await page.goto(BASE() + '/index.html');
    await page.evaluate(() => {
        sessionStorage.setItem('aliGateSeen', '1');
        localStorage.setItem('aliTheme', 'light');
        localStorage.setItem('aliLang', 'en');
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main', { state: 'visible' });
    await page.waitForTimeout(300);
}

async function switchToFA(page) {
    await page.click('#langToggle');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
}

test.describe('Contact form (Task 2)', () => {
    test('honeypot blocks submission - no request sent', async ({ page, context }) => {
        let requestSent = false;
        context.on('request', req => { if (req.url().includes('formspree.io/f/')) requestSent = true; });
        await enterGate(page);
        await page.locator('#contactForm').scrollIntoViewIfNeeded();
        await page.fill('input[name="_gotcha"]', 'bot-spam-value');
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('textarea[name="message"]', 'Test message');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(500);
        expect(requestSent).toBe(false);
        const status = page.locator('#formStatus');
        await expect(status).toHaveText('');
    });

    test('success (200) - status message, form reset, button re-enabled', async ({ page, context }) => {
        let lastStatus = null;
        context.on('response', res => {
            if (res.url().includes('formspree.io/f/')) lastStatus = res.status();
        });
        await page.route('https://formspree.io/f/*', route => {
            setTimeout(() => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }), 500);
        });
        await enterGate(page);
        await page.locator('#contactForm').scrollIntoViewIfNeeded();
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.selectOption('select[name="projectScope"]', 'freelance');
        await page.fill('textarea[name="message"]', 'Hello this is a test message');
        const btn = page.locator('button[type="submit"]');
        await btn.click();
        await page.waitForTimeout(150);
        await expect(btn).toBeDisabled({ timeout: 5000 });
        await expect(page.locator('#formStatus')).toHaveText('Message sent — thank you!');
        await expect(page.locator('#formStatus')).toHaveClass('is-ok');
        await page.waitForTimeout(300);
        await expect(btn).toBeEnabled();
        await expect(page.locator('input[name="name"]')).toHaveValue('');
        await expect(page.locator('input[name="email"]')).toHaveValue('');
        await expect(page.locator('textarea[name="message"]')).toHaveValue('');
        expect(lastStatus).toBe(200);
        await expect(btn).toBeEnabled();
        await expect(page.locator('input[name="name"]')).toHaveValue('');
        await expect(page.locator('input[name="email"]')).toHaveValue('');
        await expect(page.locator('textarea[name="message"]')).toHaveValue('');
        expect(lastStatus).toBe(200);
    });

    test('validation error (422) - status message, button re-enabled', async ({ page, context }) => {
        await page.route('https://formspree.io/f/*', route => route.fulfill({ status: 422, contentType: 'application/json', body: '{"errors":["email invalid"]}' }));
        await enterGate(page);
        await page.locator('#contactForm').scrollIntoViewIfNeeded();
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('textarea[name="message"]', 'Test');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(500);
        await expect(page.locator('#formStatus')).toHaveText('Something went wrong. Please email me directly.');
        await expect(page.locator('#formStatus')).toHaveClass('is-error');
        await expect(page.locator('button[type="submit"]')).toBeEnabled();
    });

    test('server error (500) - status message, button re-enabled', async ({ page }) => {
        await page.route('https://formspree.io/f/*', route => route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"server error"}' }));
        await enterGate(page);
        await page.locator('#contactForm').scrollIntoViewIfNeeded();
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('textarea[name="message"]', 'Test message');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(500);
        await expect(page.locator('#formStatus')).toHaveText('Something went wrong. Please email me directly.');
        await expect(page.locator('button[type="submit"]')).toBeEnabled();
    });

    test('network offline - status message, button re-enabled', async ({ page }) => {
        await page.route('https://formspree.io/f/*', route => route.abort());
        await enterGate(page);
        await page.locator('#contactForm').scrollIntoViewIfNeeded();
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('textarea[name="message"]', 'Test message');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(500);
        await expect(page.locator('#formStatus')).toHaveText('Something went wrong. Please email me directly.');
        await expect(page.locator('button[type="submit"]')).toBeEnabled();
    });

    test('slow response - button disabled during, re-enabled after', async ({ page }) => {
        await page.route('https://formspree.io/f/*', route => {
            setTimeout(() => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }), 1500);
        });
        await enterGate(page);
        await page.locator('#contactForm').scrollIntoViewIfNeeded();
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('textarea[name="message"]', 'Test message');
        const btn = page.locator('button[type="submit"]');
        await btn.click();
        await expect(btn).toBeDisabled();
        await expect(page.locator('#formStatus')).toHaveText('Sending…');
        await page.waitForTimeout(2000);
        await expect(btn).toBeEnabled();
        await expect(page.locator('#formStatus')).toHaveText('Message sent — thank you!');
    });

    test('no double submit - second click while sending is ignored', async ({ page }) => {
        let callCount = 0;
        await page.route('https://formspree.io/f/*', route => {
            callCount++;
            setTimeout(() => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }), 2000);
        });
        await enterGate(page);
        await page.locator('#contactForm').scrollIntoViewIfNeeded();
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('textarea[name="message"]', 'Test message');
        const btn = page.locator('button[type="submit"]');
        await btn.click();
        await btn.click();
        await btn.click();
        await page.waitForTimeout(2500);
        expect(callCount).toBe(1);
        await expect(btn).toBeEnabled();
    });

    test('success message in FA language', async ({ page, context }) => {
        await page.route('https://formspree.io/f/*', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
        await enterGate(page);
        await switchToFA(page);
        await page.locator('#contactForm').scrollIntoViewIfNeeded();
        await page.fill('input[name="name"]', 'کاربر تست');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.selectOption('select[name="projectScope"]', 'freelance');
        await page.fill('textarea[name="message"]', 'پیام تست');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(500);
        await expect(page.locator('#formStatus')).toHaveText('پیام ارسال شد — ممنون!');
        await expect(page.locator('#formStatus')).toHaveClass('is-ok');
    });

    test('required/email native validation - submit blocked when empty', async ({ page, context }) => {
        let requestSent = false;
        context.on('request', req => { if (req.url().includes('formspree.io/f/')) requestSent = true; });
        await enterGate(page);
        await page.locator('#contactForm').scrollIntoViewIfNeeded();
        await page.click('button[type="submit"]');
        await page.waitForTimeout(500);
        expect(requestSent).toBe(false);
        await expect(page.locator('input[name="name"]')).toBeFocused();
    });

    test('mailto fallback works when FORMSPREE_ID empty', async ({ page, context }) => {
        await enterGate(page);
        const mailtoLinks = page.locator('a[href="mailto:suicidewithmeagain@gmail.com"]');
        await expect(mailtoLinks).toHaveCount(3);
    });
});
