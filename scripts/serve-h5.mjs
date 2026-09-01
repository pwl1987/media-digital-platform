// 简易静态服务器：npx 风格的本地起 HTTP
// 用法：node scripts/serve-h5.mjs [port]
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const port = Number(process.argv[2] || process.env.PORT || 4173);

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };

createServer((req, res) => {
  let path = req.url.split('?')[0];
  if (path === '/' || path === '') path = '/index.html';
  const fullPath = join(root, 'apps/h5-opera', path);
  if (!existsSync(fullPath) || statSync(fullPath).isDirectory()) {
    res.writeHead(404); res.end('Not Found'); return;
  }
  try {
    const data = readFileSync(fullPath);
    res.writeHead(200, { 'Content-Type': TYPES[extname(fullPath)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    res.writeHead(500); res.end(e.message);
  }
}).listen(port, () => {
  console.log(`h5-opera served at http://127.0.0.1:${port}/`);
});