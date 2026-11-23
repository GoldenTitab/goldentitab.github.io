'use strict';
// i18n key-parity check: verifies every data-i18n key exists in both `en` and `fa`
// translation objects in script.js, and flags obvious English leftovers in FA strings.
const fs = require('fs');
const src = fs.readFileSync('script.js', 'utf8');
const lines = src.split('\n');

const enKeys = [], faKeys = [];
const enVals = {}, faVals = {};
let block = null; // 'en' | 'fa' | null
// Matches:  key: 'value'   or   key: "value"   (with optional trailing comma)
const kvRe = /(\w+)\s*:\s*(['"])((?:\\.|(?!\2).)*?)\2/g;
for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === 'en: {') { block = 'en'; continue; }
    if (trimmed === 'fa: {') { block = 'fa'; continue; }
    if (block && (trimmed === '},' || trimmed === '}')) { block = null; continue; }
    for (const m of line.matchAll(kvRe)) {
        const key = m[1], val = m[3];
        if (block === 'en') { enKeys.push(key); enVals[key] = val; }
        else if (block === 'fa') { faKeys.push(key); faVals[key] = val; }
    }
}

const enSet = new Set(enKeys);
const faSet = new Set(faKeys);
const onlyEn = enKeys.filter(k => !faSet.has(k));
const onlyFa = faKeys.filter(k => !enSet.has(k));

let failures = 0;
if (onlyEn.length) { failures++; console.log('MISSING in fa:'); onlyEn.forEach(k => console.log('  - ' + k)); }
if (onlyFa.length) { failures++; console.log('MISSING in en:'); onlyFa.forEach(k => console.log('  - ' + k)); }

// Check data-i18n keys referenced in HTML but missing from translations.
const htmlFiles = ['index.html', 'experience.html', 'world.html', '404.html'];
const referenced = new Set();
for (const f of htmlFiles) {
    const h = fs.readFileSync(f, 'utf8');
    for (const m of h.matchAll(/data-i18n="([^"]+)"/g)) referenced.add(m[1]);
    for (const m of h.matchAll(/data-i18n-attr="([^"]+)"/g)) {
        for (const pair of m[1].split(';')) {
            const kv = pair.split(':');
            if (kv.length === 2) referenced.add(kv[1]);
        }
    }
}
const missingFromEn = [...referenced].filter(k => !enSet.has(k));
const missingFromFa = [...referenced].filter(k => !faSet.has(k));
if (missingFromEn.length) { failures++; console.log('Referenced in HTML but missing from en:'); missingFromEn.forEach(k => console.log('  - ' + k)); }
if (missingFromFa.length) { failures++; console.log('Referenced in HTML but missing from fa:'); missingFromFa.forEach(k => console.log('  - ' + k)); }

// Obvious English leftovers in FA strings.
const engWords = /\b(the|and|of|to|a|in|is|it|you|for|with|on|at|from|by|or|as|be|this|that|are|was|but|not|have|has|had|will|can|about|project|message|email|name|view|send|enter|music|theme|language|skip|back|close|menu|home|projects|contact|journey|world|skills|send message|view projects|github profile|enter the world)\b/i;
const faLeftovers = [];
for (const k of Object.keys(faVals)) {
    // Placeholder examples (your@email.com, Your name, ...) are intentionally English.
    if (/^(ph|phName|phEmail|phMessage)$/.test(k)) continue;
    const v = faVals[k];
    if (typeof v === 'string' && engWords.test(v)) faLeftovers.push(k + ': ' + v.slice(0, 60));
}
if (faLeftovers.length) { failures++; console.log('Possible English leftovers in fa:'); faLeftovers.forEach(x => console.log('  - ' + x)); }

console.log('\nen keys: ' + enKeys.length + ', fa keys: ' + faKeys.length + ', referenced in HTML: ' + referenced.size);
if (failures) { console.log('\nRESULT: FAIL (' + failures + ' issue group(s))'); process.exit(1); }
console.log('RESULT: PASS — i18n key parity OK');
