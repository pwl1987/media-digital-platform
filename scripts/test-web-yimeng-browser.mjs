#!/usr/bin/env node
// web-yimeng 浏览器自动验收（R0-HARDEN-01，Issue #6）
// 零依赖：Node ≥22 内置 WebSocket + Chrome DevTools 协议 + python3 静态服务。
// 自建 127.0.0.1:8421 测试实例（不影响现有 8420 演示进程）。
// 覆盖：首页渲染、全量目录计数、搜索/空态、详情/返回、刷新/键盘、
//       1920/1366/390 三分辨率、快照缺失 fail-closed、监听地址核验。
// 用法：node scripts/test-web-yimeng-browser.mjs [--keep]（--keep 保留失败截图）

import { spawn, execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const ROOT = new URL('../apps/web-yimeng/', import.meta.url).pathname;
const PORT = 8421;
const BASE = `http://127.0.0.1:${PORT}/`;
const KEEP = process.argv.includes('--keep');
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

// ---------- 1. 静态实例（仅绑定 127.0.0.1）----------
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', ROOT], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1200));
try {
  const bound = execSync(`ss -tln 2>/dev/null | grep ':${PORT} '`, { encoding: 'utf-8' }).trim();
  // ss 第4列为本地地址（对端列恒为 0.0.0.0:*，不可作为绑定判断）
  const localAddr = bound.split(/\s+/)[3];
  check('测试实例仅绑定回环地址', localAddr === `127.0.0.1:${PORT}`, localAddr);
} catch {
  check('测试实例仅绑定回环地址', false, '端口未监听');
}

// ---------- 2. Chrome CDP ----------
const chrome = spawn('google-chrome', ['--headless=new', '--disable-gpu', '--no-sandbox', '--remote-debugging-port=9461', 'about:blank'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2200));
const targets = await (await fetch('http://127.0.0.1:9461/json/list')).json();
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
let mid = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((res) => { const id = ++mid; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
await new Promise((r) => ws.onopen = r);
await send('Page.enable');
await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true }); // 缺失态用例需绕过磁盘缓存
const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;
const shotDir = '/tmp/web-yimeng-browser-test';
mkdirSync(shotDir, { recursive: true });
const snap = async (name) => {
  const s = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(`${shotDir}/${name}.png`, Buffer.from(s.data, 'base64'));
};
const setViewport = async (w, h, mobile = false) => {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });
  await new Promise((r) => setTimeout(r, 300));
};

// ---------- 3. 验收用例 ----------
await setViewport(1920, 1080);
await send('Page.navigate', { url: BASE });
await new Promise((r) => setTimeout(r, 3000));
await snap('home-1920');

// 3.1 首页渲染与 fail-closed 标注
const heroTitle = await ev('document.querySelector(".hero h1")?.textContent');
check('首页渲染', /红色文化|沂蒙/.test(heroTitle || ''), heroTitle);
const claimBadges = await ev('[...document.querySelectorAll(".archive-card-meta b")].map(b => b.textContent).filter(t => t.includes("未经独立"))');
check('权威声明 fail-closed（不显示 A 级）', Array.isArray(claimBadges) && claimBadges.length === 24 && !(await ev('document.querySelector(".archive-card-meta b")?.textContent')).includes('A 级'), `badges=${claimBadges?.length}`);
const noA = await ev('![...document.querySelectorAll("#archive-list b, #archive-list .grade-badge")].some(el => /A\\s*级|官方档案/.test(el.textContent))');
check('全列表无“官方档案/A级”认定字样', noA === true);
const stateLine = await ev('document.querySelector("#archive-state")?.textContent');
check('快照状态含“未独立审核”', (stateLine || '').includes('未独立审核'));

// 3.2 全量目录计数
const countText = await ev('document.querySelector("#archive-count")?.textContent');
check('全量目录计数 2009', /2009/.test(countText || ''), countText);
const cards = await ev('document.querySelectorAll(".archive-clickable").length');
check('首屏卡片 24', cards === 24, `cards=${cards}`);

// 3.3 搜索/空态
const searchHit = await ev(`(() => { const i = document.querySelector('#archive-query'); i.value = '红嫂'; i.dispatchEvent(new Event('input', {bubbles:true})); return { n: document.querySelectorAll('.archive-clickable').length, c: document.querySelector('#archive-count').textContent }; })()`);
check('关键词检索生效', searchHit.n >= 1 && /红嫂|1 \//.test(searchHit.c), JSON.stringify(searchHit));
const emptyMsg = await ev(`(() => { const i = document.querySelector('#archive-query'); i.value = '不存在词条xyz123'; i.dispatchEvent(new Event('input', {bubbles:true})); return document.querySelector('#archive-list .empty-state')?.textContent || 'NO_EMPTY'; })()`);
check('无结果空态', (emptyMsg || '').includes('没有返回记录'), emptyMsg);
await ev(`(() => { const i = document.querySelector('#archive-query'); i.value = ''; i.dispatchEvent(new Event('input', {bubbles:true})); })()`);

// 3.4 详情/返回（含受限边界）
const detailOk = await ev(`(() => { document.querySelector('.archive-clickable').click(); const d = document.querySelector('.archive-detail'); return { title: d?.querySelector('h4')?.textContent, rows: d?.querySelectorAll('.detail-row').length, hasUrlLink: !!d?.querySelector('a[href*="61.133"]') || !!d?.querySelector('a[href^="http"]'), authority: [...d?.querySelectorAll('.detail-row') || []].find(r => r.textContent.includes('权威'))?.textContent }; })()`);
check('进入著录详情', Boolean(detailOk?.title), detailOk?.title);
check('详情字段完整（≥11）', (detailOk?.rows || 0) >= 11, `rows=${detailOk?.rows}`);
check('详情无外部来源链接（fail-closed）', detailOk?.hasUrlLink === false);
check('权威等级显示“未经独立认定”', (detailOk?.authority || '').includes('未经独立认定'), detailOk?.authority);
await snap('detail-1920');
const backCards = await ev(`(() => { document.querySelector('.archive-back').click(); return document.querySelectorAll('.archive-clickable').length; })()`);
check('返回列表', backCards === 24, `cards=${backCards}`);

// 3.5 键盘操作
const kbDetail = await ev(`(() => { const c = document.querySelector('.archive-clickable'); c.focus(); c.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', bubbles:true})); return document.querySelector('.archive-detail h4')?.textContent; })()`);
check('Enter 进详情', Boolean(kbDetail), kbDetail);
const kbBack = await ev(`(() => { document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true})); return document.querySelectorAll('.archive-clickable').length; })()`);
check('Esc 返回列表', kbBack === 24, `cards=${kbBack}`);

// 3.6 刷新/深链
await send('Page.navigate', { url: `${BASE}#archive` });
await new Promise((r) => setTimeout(r, 2500));
const afterReload = await ev(`(() => ({ cards: document.querySelectorAll('.archive-clickable').length, count: document.querySelector('#archive-count')?.textContent, inView: document.querySelector('#archive')?.getBoundingClientRect().top < 200 }))()`);
check('刷新后快照恢复+锚点定位', afterReload.cards === 24 && /2009/.test(afterReload.count) && afterReload.inView, JSON.stringify(afterReload));

// 3.7 三分辨率
for (const [w, h, mobile] of [[1366, 768, false], [390, 844, true]]) {
  await setViewport(w, h, mobile);
  await new Promise((r) => setTimeout(r, 400));
  const m = await ev(`(() => ({ sw: document.documentElement.scrollWidth, cards: document.querySelectorAll('.archive-clickable').length, cols: getComputedStyle(document.querySelector('.archive-list')).gridTemplateColumns.split(' ').length }))()`);
  check(`${w} 宽度无横向溢出`, m.sw <= w, `sw=${m.sw}`);
  check(`${w} 卡片渲染`, m.cards === 24, `cards=${m.cards}`);
  await snap(`archive-${w}`);
}
await setViewport(1920, 1080);

// 3.8 快照缺失 fail-closed（同实例删除 data 后重载）
const missing = await ev(`(async () => {
  const r = await fetch('./data/archives-snapshot.json', { method: 'HEAD' }); return r.status;
})()`);
check('快照资产存在（对照）', missing === 200, `HEAD=${missing}`);
spawn('mv', [`${ROOT}data/archives-snapshot.json`, '/tmp/archives-snapshot.backup.json']);
await new Promise((r) => setTimeout(r, 800));
await send('Page.navigate', { url: BASE });
await new Promise((r) => setTimeout(r, 2500));
const failClosed = await ev(`(() => ({ badge: document.querySelector('#archive-state')?.textContent, empty: document.querySelector('.archive-empty')?.textContent }))()`);
check('快照缺失 → fail-closed 提示', (failClosed.badge || '').includes('加载失败') && (failClosed.empty || '').includes('重新生成'), JSON.stringify(failClosed).slice(0, 120));
spawn('mv', ['/tmp/archives-snapshot.backup.json', `${ROOT}data/archives-snapshot.json`]);
await new Promise((r) => setTimeout(r, 800));

// ---------- 4. 汇总 ----------
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} PASS${failed.length ? '；FAIL: ' + failed.map((f) => f.name).join(' / ') : ''}`);
chrome.kill();
server.kill();
process.exit(failed.length ? 1 : 0);
