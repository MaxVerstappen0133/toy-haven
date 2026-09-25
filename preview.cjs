// Local preview only. This file is not needed on GitHub Pages.
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};
http.createServer((req,res) => {
  const name = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file = path.resolve(root,'.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file,(error,data) => {
    if (error) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'text/plain','Cache-Control':'no-cache'});
    res.end(data);
  });
}).listen(4173,'127.0.0.1',() => console.log('Toy Haven: http://localhost:4173'));
