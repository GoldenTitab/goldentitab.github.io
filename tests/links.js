'use strict';
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const htmlFiles = ['index.html', 'experience.html', 'world.html', '404.html'];

const attrRegex = /(?:href|src)="([^"]+)"/g;
let failures = 0;

function checkInternal(target) {
    let u = target.split('#')[0].split('?')[0];
    if (!u) return;
    if (u.startsWith('mailto:') || u.startsWith('tel:')) return;
    u = u.replace(/^\//, '');
    const abs = path.resolve(root, u);
    if (!fs.existsSync(abs)) {
        failures++;
        console.log('BROKEN internal link: ' + target + ' -> ' + abs);
    }
}

for (const f of htmlFiles) {
    const content = fs.readFileSync(f, 'utf8');
    for (const m of content.matchAll(attrRegex)) {
        const target = m[1];
        if (target.startsWith('http:') || target.startsWith('https:')) {
            try { new URL(target); } catch (e) {
                failures++;
                console.log('MALFORMED external URL in ' + f + ': ' + target);
            }
        } else {
            checkInternal(target);
        }
    }
}

const assetRegex = /(?:src|href)="([^"]*\.(?:jpg|jpeg|png|gif|svg|mp3|webp|avif|ico|css|js|json))"/gi;
const checkedAssets = new Set();
for (const f of htmlFiles) {
    const content = fs.readFileSync(f, 'utf8');
    for (const m of content.matchAll(assetRegex)) {
        const target = m[1];
        if (checkedAssets.has(target)) continue;
        checkedAssets.add(target);
        if (target.startsWith('http')) continue;
        const abs = path.resolve(root, target.replace(/^\//, ''));
        if (!fs.existsSync(abs)) {
            failures++;
            console.log('MISSING asset: ' + target + ' -> ' + abs);
        }
    }
}

const js = fs.readFileSync('script.js', 'utf8');
for (const m of js.matchAll(/(?:MUSIC_SRC|src)\s*=\s*["']([^"']+)["']/g)) {
    const target = m[1];
    if (target.startsWith('http') || checkedAssets.has(target)) continue;
    checkedAssets.add(target);
    const abs = path.resolve(root, target.replace(/^\//, ''));
    if (!fs.existsSync(abs)) { failures++; console.log('MISSING JS asset: ' + target); }
}

console.log('\nChecked assets: ' + checkedAssets.size);
if (failures) { console.log('\nRESULT: FAIL (' + failures + ' broken link(s)/asset(s))'); process.exit(1); }
console.log('RESULT: PASS — all internal links and assets resolve');
