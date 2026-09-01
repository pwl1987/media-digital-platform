// 同步共享包到所有端项目内：
// - 小程序：require 不允许跳出项目根 → 落 shared/
// - H5 / PC / APP：无构建步骤、零依赖同源消费 → 也落 shared/（统一约定）
// 唯一来源：packages/design-system、packages/api-client、packages/mock-data
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
  const appJson = join(appDir, 'app.json');
  const packageJson = join(appDir, 'package.json');
  // 只对"已注册项目"同步：有 app.json（小程序）或 package.json（h5/web/app）
  if (!existsSync(appJson) && !existsSync(packageJson)) continue;
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
