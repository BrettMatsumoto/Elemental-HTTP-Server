'use strict';

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile('./public/index.html', 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        return res.end(data);
      });
    }
    if (req.url === '/helium.html') {
      fs.readFile('./public/helium.html', 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        return res.end(data);
      });
    }
    if (req.url === '/hydrogen.html') {
      fs.readFile('./public/hydrogen.html', 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        return res.end(data);
      });
    }
    if (req.url === '/css/styles.css') {
      fs.readFile('./public/css/styles.css', 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        return res.end(data);
      });
    }
    if (req.url === '/404.html') {
      fs.readFile('./public/404.html', 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        return res.end(data);
      });
    }
  }
});
server.listen(8080);
