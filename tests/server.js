const http = require('http');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.mp3': 'audio/mpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    if (url === '/') url = '/index.html';
    let file = path.join(root, url);
    fs.stat(file, (err, st) => {
        if (err || !st.isFile()) { res.statusCode = 404; res.end('not found'); return; }
        const ext = path.extname(file).toLowerCase();
        res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
        fs.createReadStream(file).pipe(res);
    });
});
server.listen(0, () => { console.log('TEST_SERVER_PORT=' + server.address().port); });
process.stdin.resume();
