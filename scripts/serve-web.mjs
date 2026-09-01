// PC 门户静态服务器（与 serve-h5.mjs 同构）
// 用法：node scripts/serve-web.mjs [port]
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const port = Number(process.argv[2] || process.env.PORT || 4273);

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };

createServer((req, res) => {
  let path = req.url.split('?')[0];
  if (path === '/' || path === '') path = '/index.html';
  const fullPath = join(root, 'apps/web-opera', path);
  if (!existsSync(fullPath) || statSync(fullPath).isDirectory()) {
    // SPA-lite：未知路径回 index.html（query 路由在 main.js 里分发）
    const fallback = join(root, 'apps/web-opera', 'index.html');
    if (existsSync(fallback)) {
      res.writeHead(200, { 'Content-Type': TYPES['.html'] });
      res.end(readFileSync(fallback));
      return;
    }
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
  console.log(`web-opera served at http://127.0.0.1:${port}/`);
});