// 同步设计 token 到各小程序项目内（微信小程序 wxss @import 不能跳出项目根）
// 源：packages/design-system/tokens*.wxss（唯一来源）
// 产物：apps/miniapp-*/styles/tokens*.wxss（进版本库；小程序无构建步骤）
// 用法：node scripts/sync-design-tokens.mjs
import { createRequire } from 'node:module';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const { workspaces } = require(join(root, 'package.json'));

const sourceDir = join(root, 'packages/design-system');
const tokenFiles = readdirSync(sourceDir).filter((f) => /^tokens.*\.wxss$/.test(f));
if (!tokenFiles.length) throw new Error('No tokens wxss found in packages/design-system');

const appsRoot = join(root, 'apps');
for (const app of readdirSync(appsRoot)) {
  const appDir = join(appsRoot, app);
  if (!existsSync(join(appDir, 'app.wxss'))) continue; // 只同步小程序项目
  const targetDir = join(appDir, 'styles');
  mkdirSync(targetDir, { recursive: true });
  for (const file of tokenFiles) {
    copyFileSync(join(sourceDir, file), join(targetDir, file));
    console.log(`synced ${file} -> apps/${app}/styles/`);
  }
}
console.log('Design tokens synced.');
