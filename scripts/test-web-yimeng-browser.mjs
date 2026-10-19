#!/usr/bin/env node
// web-yimeng 浏览器自动验收（R0-HARDEN-02，Issue #3/#6）
// 零依赖：Node ≥22 内置 WebSocket + Chrome DevTools 协议 + python3 静态服务。
//
// 安全隔离（R0-HARDEN-02 合同）：
// - 不 mv/rm/rename 真实快照：失败态用 CDP Network.setBlockedURLs 网络阻断模拟；
// - 端口预检（8421/8423/CDP 9471），占用即退出，绝不按名杀进程；
// - 子进程 PID 可追踪，异常路径 try/finally 统一清理；
// - 全程只读 8420（HEAD 探活），快照 SHA/大小前后校验不变。
//
// 用法：node scripts/test-web-yimeng-browser.mjs

import { spawn, execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const ROOT = new URL('../apps/web-yimeng/', import.meta.url).pathname;
const SNAPSHOT = `${ROOT}data/archives-snapshot.json`;
const PORT = 8421;          // 静态测试实例（仅 127.0.0.1）
const MOCK_PORT = 8423;     // 模拟 API（仅 127.0.0.1，验证 grade=A 不提升权威）
const CDP_PORT = 9471;
const BASE = `http://127.0.0.1:${PORT}/`;
const shotDir = '/tmp/web-yimeng-browser-test';
mkdirSync(shotDir, { recursive: true });

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};
const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

// ---------- 0. 端口预检（占用即退出，不杀任何进程）----------
for (const p of [PORT, MOCK_PORT, CDP_PORT]) {
  let busy = false;
  try { execSync(`ss -tln | grep ':${p} '`, { encoding: 'utf-8', stdio: 'pipe' }); busy = true; } catch { /* 空闲 */ }
  if (busy) {
    console.error(`STOP: 端口 ${p} 已被占用，拒绝启动（严禁误杀他人进程）`);
    process.exit(2);
  }
}

// ---------- 1. 8420 现场态与快照完整性（只读，前测）----------
const httpStatus = async (url) => (await fetch(url, { method: 'HEAD' })).status;
const live8420Before = [await httpStatus('http://127.0.0.1:8420/'), await httpStatus('http://127.0.0.1:8420/data/archives-snapshot.json')];
check('8420 前测：首页/快照 HTTP 200', live8420Before.every((s) => s === 200), live8420Before.join('/'));
const shaBefore = sha256(SNAPSHOT);
const sizeBefore = readFileSync(SNAPSHOT).length;
console.log(`info: 快照前测 sha256=${shaBefore.slice(0, 16)}… size=${sizeBefore}B`);

// ---------- 2. 子进程（PID 可追踪，finally 统一清理）----------
const procs = [];
const spawnTracked = (cmd, args) => {
  const child = spawn(cmd, args, { stdio: 'ignore' });
  procs.push(child);
  return child;
};
let exitCode = 0;
try {
  const server = spawnTracked('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', ROOT]);
  // 模拟 API：返回 grade=A 但无任何审核信号 —— 验证不提升权威认定
  const mock = spawnTracked('node', ['-e', `
    const http = require('node:http');
    const items = Array.from({ length: 4 }, (_, i) => ({
      id: 'mock-' + i, title: '模拟档案' + i, grade: 'A', archiveType: '文献',
      summary: 'API 模拟记录（无审核信号）', source: '模拟服务', year: '1941'
    }));
    http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*'); // 测试页 8421 → 模拟 API 8423 跨域
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
      res.end(JSON.stringify(req.url.startsWith('/health') ? { data: { status: 'ok' } } : { data: { items, total: items.length } }));
    }).listen(${MOCK_PORT}, '127.0.0.1');
  `]);
  const chrome = spawnTracked('google-chrome', ['--headless=new', '--disable-gpu', '--no-sandbox', `--remote-debugging-port=${CDP_PORT}`, 'about:blank']);
  await new Promise((r) => setTimeout(r, 2600));

  const bound = execSync(`ss -tln | grep ':${PORT} '`, { encoding: 'utf-8' }).trim();
  const localAddr = bound.split(/\s+/)[3]; // ss 第 4 列为本地地址（对端列恒为 0.0.0.0:*）
  check('测试实例仅绑定回环地址', localAddr === `127.0.0.1:${PORT}`, localAddr);

  const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  let mid = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((res) => { const id = ++mid; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
  ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
  await new Promise((r) => ws.onopen = r);
  await send('Page.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;
  const snap = async (name) => {
    const s = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${shotDir}/${name}.png`, Buffer.from(s.data, 'base64'));
  };
  const setViewport = async (w, h, mobile = false) => {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });
    await new Promise((r) => setTimeout(r, 300));
  };
  const navigate = async (url, wait = 2800) => { await send('Page.navigate', { url }); await new Promise((r) => setTimeout(r, wait)); };

  // ---------- 3. 静态快照模式（主路径）----------
  await setViewport(1920, 1080);
  await navigate(BASE);
  await snap('home-1920');

  const heroTitle = await ev('document.querySelector(".hero h1")?.textContent');
  check('首页渲染', /红色文化|沂蒙/.test(heroTitle || ''), heroTitle);
  const claimBadges = await ev('[...document.querySelectorAll(".archive-card-meta b")].map(b => b.textContent).filter(t => t.includes("未经独立"))');
  check('权威声明 fail-closed（不显示 A 级）', Array.isArray(claimBadges) && claimBadges.length === 24, `badges=${claimBadges?.length}`);
  const noA = await ev('![...document.querySelectorAll("#archive-list b, #archive-list .grade-badge")].some(el => /A\\s*级|官方档案/.test(el.textContent))');
  check('全列表无“官方档案/A级”认定字样', noA === true);
  const stateLine = await ev('document.querySelector("#archive-state")?.textContent');
  check('快照状态含“未独立审核”', (stateLine || '').includes('未独立审核'));

  // P2 运行时取数（不硬编码 2010）
  const countText = await ev('document.querySelector("#archive-count")?.textContent');
  const totalChapters = await ev('Number((document.querySelector("#archive-count")?.textContent.match(/\\d+/g) || []).pop())');
  const p2Badge = await ev('document.querySelector("#p2-status")?.textContent');
  const p2Desc = await ev('document.querySelector("#p2-desc")?.textContent');
  check('P2 目录数目=快照 meta 运行时取数', /快照 \d+ \/ \d+ 条/.test(countText || '') && p2Badge.includes(`目录快照可用（${totalChapters} 条）`), `P2=${p2Badge}`);
  check('P2 描述含运行时计数且未独立审核', p2Desc.includes(`${totalChapters}`) && p2Desc.includes('未独立审核') && !p2Desc.includes('2010'), p2Desc.slice(0, 60));
  const cards = await ev('document.querySelectorAll(".archive-clickable").length');
  check('首屏卡片 24', cards === 24, `cards=${cards}`);

  // 搜索/空态
  const searchHit = await ev(`(() => { const i = document.querySelector('#archive-query'); i.value = '红嫂'; i.dispatchEvent(new Event('input', {bubbles:true})); return { n: document.querySelectorAll('.archive-clickable').length, c: document.querySelector('#archive-count').textContent }; })()`);
  check('关键词检索生效', searchHit.n >= 1, JSON.stringify(searchHit));
  const emptyMsg = await ev(`(() => { const i = document.querySelector('#archive-query'); i.value = '不存在词条xyz123'; i.dispatchEvent(new Event('input', {bubbles:true})); return document.querySelector('#archive-list .empty-state')?.textContent || 'NO_EMPTY'; })()`);
  check('无结果空态', (emptyMsg || '').includes('没有返回记录'), emptyMsg);
  await ev(`(() => { const i = document.querySelector('#archive-query'); i.value = ''; i.dispatchEvent(new Event('input', {bubbles:true})); })()`);

  // 详情/返回（含受限边界）
  const detailOk = await ev(`(() => { document.querySelector('.archive-clickable').click(); const d = document.querySelector('.archive-detail'); return { title: d?.querySelector('h4')?.textContent, rows: d?.querySelectorAll('.detail-row').length, hasUrlLink: !!d?.querySelector('a[href^="http"]'), authority: [...d?.querySelectorAll('.detail-row') || []].find(r => r.textContent.includes('权威'))?.textContent }; })()`);
  check('进入著录详情', Boolean(detailOk?.title), detailOk?.title);
  check('详情字段完整（≥11）', (detailOk?.rows || 0) >= 11, `rows=${detailOk?.rows}`);
  check('详情无外部来源链接（fail-closed）', detailOk?.hasUrlLink === false);
  check('权威等级显示“未经独立认定”', (detailOk?.authority || '').includes('未经独立认定'), detailOk?.authority);
  await snap('detail-1920');
  const backCards = await ev(`(() => { document.querySelector('.archive-back').click(); return document.querySelectorAll('.archive-clickable').length; })()`);
  check('返回列表', backCards === 24, `cards=${backCards}`);

  // 键盘
  const kbDetail = await ev(`(() => { const c = document.querySelector('.archive-clickable'); c.focus(); c.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', bubbles:true})); return document.querySelector('.archive-detail h4')?.textContent; })()`);
  check('Enter 进详情', Boolean(kbDetail), kbDetail);
  const kbBack = await ev(`(() => { document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true})); return document.querySelectorAll('.archive-clickable').length; })()`);
  check('Esc 返回列表', kbBack === 24, `cards=${kbBack}`);

  // 刷新/深链
  await navigate(`${BASE}#archive`, 2500);
  const afterReload = await ev(`(() => ({ cards: document.querySelectorAll('.archive-clickable').length, count: document.querySelector('#archive-count')?.textContent, inView: document.querySelector('#archive')?.getBoundingClientRect().top < 200 }))()`);
  check('刷新后快照恢复+锚点定位', afterReload.cards === 24 && /2009|\\d+/.test(afterReload.count) && afterReload.inView, JSON.stringify(afterReload));

  // 三分辨率
  for (const [w, h, mobile] of [[1366, 768, false], [390, 844, true]]) {
    await setViewport(w, h, mobile);
    await new Promise((r) => setTimeout(r, 400));
    const m = await ev(`(() => ({ sw: document.documentElement.scrollWidth, cards: document.querySelectorAll('.archive-clickable').length }))()`);
    check(`${w} 宽度无横向溢出`, m.sw <= w, `sw=${m.sw}`);
    check(`${w} 卡片渲染`, m.cards === 24, `cards=${m.cards}`);
    await snap(`archive-${w}`);
  }
  await setViewport(1920, 1080);

  // ---------- 4. 快照缺失：网络阻断（不动真实文件）----------
  await send('Network.setBlockedURLs', { urls: ['*archives-snapshot.json*'] });
  await navigate(BASE);
  const failClosed = await ev(`(() => ({ badge: document.querySelector('#archive-state')?.textContent, empty: document.querySelector('.archive-empty')?.textContent, p2: document.querySelector('#p2-status')?.textContent }))()`);
  check('快照请求失败 → fail-closed 提示', (failClosed.badge || '').includes('加载失败') && (failClosed.empty || '').includes('重新生成'), JSON.stringify(failClosed).slice(0, 100));
  check('快照失败时 P2 不显示「快照可用」', !(failClosed.p2 || '').includes('快照可用') && (failClosed.p2 || '').includes('未接入'), failClosed.p2);
  await snap('snapshot-blocked-1920');
  await send('Network.setBlockedURLs', { urls: [] });
  await navigate(BASE);
  const recovered = await ev(`(() => ({ cards: document.querySelectorAll('.archive-clickable').length, p2: document.querySelector('#p2-status')?.textContent }))()`);
  check('解除阻断后页面恢复', recovered.cards === 24 && (recovered.p2 || '').includes('目录快照可用'), JSON.stringify(recovered).slice(0, 80));

  // ---------- 5. API 返回 grade=A 无审核信号：不提升权威/P2 ----------
  const inject = await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.YIMENG_DEMO_CONFIG = { apiBase: 'http://127.0.0.1:${MOCK_PORT}' };` });
  await navigate(BASE);
  const apiMode = await ev(`(() => ({
    badge: document.querySelector('.archive-card-meta b')?.textContent,
    hasAuthority: [...document.querySelectorAll('#archive-list b, #archive-list .grade-badge')].some(el => /官方档案|A\\s*级/.test(el.textContent)),
    p2: document.querySelector('#p2-status')?.textContent,
    cards: document.querySelectorAll('.archive-card').length
  }))()`);
  check('API grade=A 无审核信号 → 显示「未经独立认定」', apiMode.badge === '未经独立认定' && apiMode.hasAuthority === false, `badge=${apiMode.badge}`);
  check('API 模式 P2 显示已连接（非快照可用）', (apiMode.p2 || '').includes('档案服务已连接') && !(apiMode.p2 || '').includes('快照可用'), apiMode.p2);
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: inject.identifier });
  await snap('api-mode-1920');
} catch (err) {
  console.error('TEST ERROR:', err?.message || err);
  exitCode = 1;
} finally {
  for (const p of procs) { try { p.kill(); } catch { /* 已退出 */ } }
}

// ---------- 6. 后测：8420 仍在线、快照未被改动 ----------
const live8420After = [await httpStatus('http://127.0.0.1:8420/'), await httpStatus('http://127.0.0.1:8420/data/archives-snapshot.json')];
check('8420 后测：首页/快照 HTTP 200', live8420After.every((s) => s === 200), live8420After.join('/'));
const shaAfter = sha256(SNAPSHOT);
const sizeAfter = readFileSync(SNAPSHOT).length;
check('快照 SHA256 前后不变', shaAfter === shaBefore, `${shaBefore.slice(0, 12)}…→${shaAfter.slice(0, 12)}…`);
check('快照大小前后不变', sizeAfter === sizeBefore, `${sizeBefore}→${sizeAfter}B`);

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} PASS${failed.length ? '；FAIL: ' + failed.map((f) => f.name).join(' / ') : ''}`);
process.exit(exitCode || (failed.length ? 1 : 0));
