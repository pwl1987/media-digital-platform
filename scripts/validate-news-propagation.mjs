import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'packages/mock-data/opera.js',
  'apps/h5-opera/main.js',
  'apps/web-opera/src/main.js'
];
for (const relative of files) {
  if (!fs.existsSync(path.join(root, relative))) throw new Error(`Missing propagation file: ${relative}`);
}

const mock = fs.readFileSync(path.join(root, 'packages/mock-data/opera.js'), 'utf8');
for (const id of ['news-001', 'news-002', 'news-003']) {
  if (!mock.includes(id)) throw new Error(`Missing canonical news id: ${id}`);
}

const h5 = fs.readFileSync(path.join(root, 'apps/h5-opera/main.js'), 'utf8');
if (!h5.includes('new URLSearchParams(location.search)')) throw new Error('H5 direct query routing missing');
if (!h5.includes("param.get('news')")) throw new Error('H5 news route missing');
if (!h5.includes('官方资讯')) throw new Error('H5 official source label missing');

const web = fs.readFileSync(path.join(root, 'apps/web-opera/src/main.js'), 'utf8');
if (!web.includes('new URLSearchParams(location.search)')) throw new Error('Web direct query routing missing');
if (!web.includes("get('news')")) throw new Error('Web news route missing');
if (!web.includes('官方资讯')) throw new Error('Web official source label missing');

console.log('News propagation validation passed.');
