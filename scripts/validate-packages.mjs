import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'packages/domain-types/index.ts',
  'packages/api-client/index.js',
  'packages/mock-data/opera.js'
];

for (const relative of required) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing required shared package file: ${relative}`);
  }
}

const api = fs.readFileSync(path.join(root, 'packages/api-client/index.js'), 'utf8');
for (const endpoint of ['/api/v1/opera/news', '/api/v1/opera/works', '/api/v1/opera/events', '/api/v1/opera/videos', '/api/v1/yimeng/ai/chat']) {
  if (!api.includes(endpoint)) throw new Error(`Missing API endpoint: ${endpoint}`);
}

const domain = fs.readFileSync(path.join(root, 'packages/domain-types/index.ts'), 'utf8');
for (const type of ['News', 'Work', 'Event', 'Performance', 'MediaAsset', 'Feed']) {
  if (!domain.includes(`interface ${type}`)) throw new Error(`Missing domain interface: ${type}`);
}

console.log('Shared package validation passed.');
