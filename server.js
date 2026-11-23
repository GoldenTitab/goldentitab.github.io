'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const ROOT = __dirname;

app.disable('x-powered-by');

app.use(express.static(ROOT, {
    extensions: ['html'],
    dotfiles: 'ignore',
    index: ['index.html']
}));

app.use((req, res) => {
    res.status(404).sendFile(path.join(ROOT, '404.html'));
});

app.listen(PORT, HOST, () => {
    console.log(`Static portfolio server listening at http://${HOST}:${PORT}`);
});
