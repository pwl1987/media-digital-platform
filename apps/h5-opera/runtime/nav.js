// H5 公共：顶栏渲染 + 工具函数
// 所有页面 <script type="module"> import 后调用 mountHeader()

const NAV_ITEMS = [
  { href: './index.html', label: '首页', key: 'home' },
  { href: './pages/news/index.html', label: '资讯', key: 'news' },
  { href: './pages/works/index.html', label: '剧目', key: 'works' },
  { href: './pages/events/index.html', label: '展演', key: 'events' },
  { href: './pages/videos/index.html', label: '影像', key: 'videos' }
];

function currentKey() {
  const path = location.pathname.replace(/\\/g, '/');
  if (path.includes('/pages/news/')) return 'news';
  if (path.includes('/pages/works/')) return 'works';
  if (path.includes('/pages/events/')) return 'events';
  if (path.includes('/pages/videos/')) return 'videos';
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

// 注意：mountHeader 不在此自动执行——页面 index.js 显式调用（避免重复渲染顶栏）
