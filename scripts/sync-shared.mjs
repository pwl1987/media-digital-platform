// 同步共享包到各小程序项目内（微信小程序编译不允许 require / @import 跳出项目根）
// 唯一来源：packages/design-system、packages/api-client、packages/mock-data
// 产物：apps/miniapp-*/shared/（进版本库；小程序无构建步骤）
// 用法：node scripts/sync-shared.mjs
import { createRequire } from 'node:module';
import { cpSync, mkdirSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = dirname(dirname(fileURLToPath(import.meta.url)));

const sources = ['design-system', 'api-client', 'mock-data'].map((name) => join(root, 'packages', name));
const appsRoot = join(root, 'apps');

for (const app of readdirSync(appsRoot)) {
  const appDir = join(appsRoot, app);
  if (!existsSync(join(appDir, 'app.json'))) continue; // 只同步小程序项目
  const target = join(appDir, 'shared');
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  for (const src of sources) {
    const dest = join(target, 'packages', src.split(/[\\/]/).pop());
    cpSync(src, dest, { recursive: true, filter: (s) => !s.includes('node_modules') });
  }
  console.log(`synced shared packages -> apps/${app}/shared/`);
}
console.log('Shared packages synced.');
