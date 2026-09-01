// H5 公共：顶栏渲染 + 工具函数
// 所有页面 <script type="module"> import 后调用 mountHeader()

const NAV_ITEMS = [
  { href: './index.html', label: '首页', key: 'home' },
  { href: './pages/news/index.html', label: '资讯', key: 'news' },
  { href: './pages/works/index.html', label: '剧目', key: 'works' },
  { href: './pages/events/index.html', label: '展演', key: 'events' },
  { href: './pages/videos/index.html', label: '影像', key: 'videos' },
  { href: './pages/live/index.html', label: '直播', key: 'live' }
];

function currentKey() {
  const path = location.pathname.replace(/\\/g, '/');
  if (path.includes('/pages/news/')) return 'news';
  if (path.includes('/pages/works/')) return 'works';
  if (path.includes('/pages/events/')) return 'events';
  if (path.includes('/pages/videos/')) return 'videos';
  if (path.includes('/pages/live/')) return 'live';
  return 'home';
}

function rootPrefix() {
  // 当前页面是否在 pages/ 子目录下
  const path = location.pathname.replace(/\\/g, '/');
  return path.includes('/pages/') ? '../../' : './';
}

export function mountHeader() {
  const active = currentKey();
  const prefix = rootPrefix();
  const navHtml = NAV_ITEMS.map((it) => {
    const href = prefix + (it.key === 'home' ? 'index.html' : it.href.replace(/^\.\//, ''));
    return `<a href="${href}" class="${active === it.key ? 'on' : ''}">${it.label}</a>`;
  }).join('');
  document.body.insertAdjacentHTML('afterbegin', `
    <header class="site-header">
      <div class="brand">沂蒙小戏小剧</div>
      <nav>${navHtml}</nav>
      <a class="search-link" href="${prefix}pages/search/index.html">⌕ 搜索</a>
    </header>
  `);
}

export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export function getQuery(name) {
  return new URLSearchParams(location.search).get(name);
}

export function officialFooter() {
  return `<div class="official-footer">
    <div>沂蒙小戏小剧官方数字传播平台</div>
    <div class="sub">内容以官方审核发布为准</div>
  </div>`;
}

// 详情页返回条（挂在 hero 之上；fallback 用 history.back）
export function backBar(label, href) {
  const text = label || '返回';
  const h = esc(href || '');
  return `<a class="back-bar" href="${h || 'javascript:history.back()'}">‹ ${text}</a>`;
}

// 分享（navigator.share 优先，降级剪贴板复制）
export function bindShare(btnId, { title, text }) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const shareData = { title: title || document.title, text: text || '', url: location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* 用户取消 */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(location.href);
      const old = btn.textContent;
      btn.textContent = '✓ 链接已复制';
      setTimeout(() => { btn.textContent = old; }, 1600);
    }
  });
}

// 详情页操作条（分享 + 可选自定义按钮）
export function actionBar({ shareLabel }) {
  return `<div class="live-actions">
    <button class="live-btn live-btn--primary" id="page-share-btn">${esc(shareLabel || '分享')}</button>
  </div>`;
}

// 注意：mountHeader 不在此自动执行——页面 index.js 显式调用（避免重复渲染顶栏）
