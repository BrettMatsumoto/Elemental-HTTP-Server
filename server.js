'use strict';

const http = require('http');
const fs = require('fs');
const qs = require('querystring');

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
    } else {
      fs.readFile('./public/404.html', 'utf8', (err, data) => {
        if (err) {
          throw err;
        }

        return res.end(data);
      });
    }
  }

  if (req.method === 'POST') {
    if (req.url === '/elements') {
      let totalData = '';

      req.on('data', (data) => {
        totalData += data;
      });

      req.on('end', () => {
        const parsedData = qs.parse(totalData);

        const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>${parsedData.elementName}</title>
</head>
<body>
  <div>${parsedData.elementName}</div>
  <div>${parsedData.elementSymbol}</div>
  <div>${parsedData.elementAtomicNumber}</div>
  <div>${parsedData.elementDescription}</div>
</body>
</html>`;

        fs.writeFile(`./public/${parsedData.elementName}.html`, template, 'utf8', (err) => {
          if (err) {
            throw err;
          }
        });

        fs.readdir('./public', (err, files) => {
          const knownFiles = files.filter(
            (file) => file !== '.keep' && file !== '.404' && file !== 'css' && file !== 'index.html',
          );
          let tags;
          let lowerCase = '';
          let standardCase = '';
          let subString = '';

          for (let newElement = 0; newElement < knownFiles.length; newElement++) {
            lowerCase = knownFiles[newElement].toLowerCase();
            standardCase = knownFiles[newElement].charAt(0).toUpperCase() + knownFiles[newElement].slice(1);
            subString = knownFiles[newElement].indexOf('.');
            tags += `
            <li>
              <a href="${lowerCase}">${standardCase.substring(0, subString)} </a>
            <li>
            `;
          }

          let reWrittenHTML = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>The Elements</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>The Elements</h1>
      <h2>These are all the known elements.</h2>
      <h3>These are ${knownFiles.length} elements</h3>
      <ol>
      </ol>
      <li>
      <a href="/hydrogen.html">Hydrogen</a>
      </li>
      <li>
      <a href="/helium.html">Helium</a>
      </li>
      </ol>
      ${tags}
    </body>
    </html>`;

          fs.writeFile(`public/index.html`, reWrittenHTML, 'utf8', (err) => {
            if (err) {
              return console.log(err);
            }
          });
        });
      });

      res.writeHead(200, {
        'Content-Type': 'application/json',
      });

      res.end(`{"success" : true}`);
    }
  }

  if (req.method === 'PUT') {
    let totalData = '';

    req.on('data', (data) => {
      totalData += data;
    });

    req.on('end', () => {
      const parsedData = qs.parse(totalData);

      fs.readdir('./public', (err, files) => {
        const knownFiles = files.filter(
          (file) => file !== '.keep' && file !== '.404' && file !== 'css' && file !== 'index.html',
        );

        if (!knownFiles.includes(`${parsedData.elementName}.html`)) {
          res.writeHead(500, {
            'Content-Type': 'application/json',
          });

          res.end(`{"error"} : ${parsedData.elementName}.html was not found.`);
        } else {
          const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>${parsedData.elementName}</title>
</head>
<body>
  <div>${parsedData.elementName}</div>
  <div>${parsedData.elementSymbol}</div>
  <div>${parsedData.elementAtomicNumber}</div>
  <div>${parsedData.elementDescription}</div>
</body>
</html>`;

          fs.writeFile(`./public/${parsedData.elementName}.html`, template, 'utf8', (err) => {
            if (err) {
              throw err;
            }
          });

          res.writeHead(200, {
            'Content-Type': 'application/json',
          });

          res.end(`{sucess} : true`);
        }
      });
    });
  }

  if (req.method === 'DELETE') {
    let totalData = '';

    req.on('data', (data) => {
      totalData += data;
    });

    req.on('end', () => {
      const parsedData = qs.parse(totalData);

      fs.unlink(`./public/${parsedData.elementName}.html`, (err) => {
        if (err) throw err;
      });

      if (!`./public/${parsedData.elementName}.html`) {
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });

        res.end(`{"error" : resource ${parsedData.elementName} does not exist}`);
      } else {
        res.writeHead(200, {
          'Content-Type': 'application/json',
        });

        res.end(`{sucess} : true`);
      }
    });
  }
});
server.listen(8080);
