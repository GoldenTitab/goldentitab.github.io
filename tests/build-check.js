'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();
const requiredFiles = [
    'index.html',
    'experience.html',
    'world.html',
    '404.html',
    'style.css',
    'script.js',
    'manifest.webmanifest',
    'robots.txt',
    'sitemap.xml',
    'audio/Odysseus_KLICKAUD.mp3',
    'fonts/Vazirmatn-Regular.woff2',
    'fonts/Vazirmatn-Medium.woff2',
    'fonts/Vazirmatn-SemiBold.woff2',
    'fonts/Vazirmatn-Bold.woff2',
    'koi/index.html',
    'koi/pond.js',
    'koi/data.json',
    'koi/sprite.json',
    'auroralist/reset.html',
    'auroralist/verify.html'
];

let missing = 0;
for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(root, file))) {
        console.error('MISSING required static file:', file);
        missing++;
    }
}
if (missing > 0) {
    process.exit(1);
}

// Validate JSON manifests
JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(root, 'koi/data.json'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(root, 'koi/sprite.json'), 'utf8'));

// Run static checks (JS, CSS, HTML, i18n parity, internal links & assets)
execSync('npm run lint:js && npm run lint:css && npm run lint:html && npm run test:i18n && node tests/links.js', {
    stdio: 'inherit'
});

console.log('Static GitHub Pages production check passed.');
