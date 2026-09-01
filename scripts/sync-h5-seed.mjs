// 同步脚本：把 packages/mock-data/opera.js（CJS）转写为 apps/h5-opera/runtime/seed.js（ESM）
// 用法：node scripts/sync-h5-seed.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = dirname(dirname(fileURLToPath(import.meta.url)));

const src = require(join(root, 'packages/mock-data/opera.js'));

// 输出 ESM：把对象字面量转写成 named exports（浏览器 import { news } 即可）
function objToESM(obj) {
  const lines = [];
  for (const [k, v] of Object.entries(obj)) {
    lines.push(`export const ${k} = ${JSON.stringify(v, null, 2)};`);
  }
  return lines.join('\n\n');
}

const livesExtra = [
  { id: 'live-001', title: '2026沂蒙小戏小剧展演直播', status: 'upcoming', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心', subtitle: '展演专场一 · 官方直播' },
  { id: 'live-002', title: '红色题材精品专场直播', status: 'ended', startAt: '2026-08-22T19:30:00+08:00', place: '临沂剧院', subtitle: '精彩回顾 · 随时回看' }
];

const esm = `// 自动同步生成：node scripts/sync-h5-seed.mjs（与小程序端同源 seed）
// 数据源：packages/mock-data/opera.js（手动修改后请重跑 sync）
// 同步时间：${new Date().toISOString()}

${objToESM(src)}

export const lives = ${JSON.stringify(livesExtra, null, 2)};
`;

const outPath = join(root, 'apps/h5-opera/runtime/seed.js');
writeFileSync(outPath, esm);
console.log(`synced h5 seed -> ${outPath}`);