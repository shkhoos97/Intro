'use strict';

const http = require('node:http');
const fs = require('node:fs');
const error = 404;
const port = 9999;

const server = http.createServer((req, res) => {
    const { url } = req;
    const filePath = `.${ url }`;

    if (url.includes('.png') || url.includes('.jpg')) {
        const contentType = url.endsWith('.png') ? 'image/png' : 'image/jpeg';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(error);
                res.end();
            } else {
                res.setHeader('Content-Type', contentType);
                res.end(data);
            }
        });
    } else {
        res.writeHead(error);
        res.end();
    }
});


server.listen(port);