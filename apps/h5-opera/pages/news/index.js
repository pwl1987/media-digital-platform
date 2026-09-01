import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const list = document.getElementById('news-list');

const res = await api.getNews({ pageSize: 50 });
if (res.error || !res.data) {
  list.innerHTML = `<div class="state"><span class="emoji">📡</span>资讯加载失败</div>`;
} else {
  const items = res.data.items;
  const [head, ...rest] = items;
  const headHTML = head ? `<a class="news-headline" href="../news-detail/index.html?id=${encodeURIComponent(head.id)}">
    <div class="headline-cover">
      <span class="badge badge--gold">${esc(head.category || '资讯')}</span>
      <span class="headline-title">${esc(head.title)}</span>
      <span class="headline-summary">${esc(head.summary || '')}</span>
      <span class="headline-meta">${esc(head.date || '')} · ${esc(head.sourceName || '')}</span>
    </div>
  </a>` : '';
  list.innerHTML = headHTML + rest.map((n) => `<a class="card" href="../news-detail/index.html?id=${encodeURIComponent(n.id)}">
    <div><span class="badge ${n.sourceLevel === 'media' ? 'badge--gold' : ''}">${esc(n.sourceLevelLabel || '官方资讯')}</span><span class="badge badge--gold">${esc(n.category || '')}</span></div>
    <div class="title">${esc(n.title)}</div>
    <div class="summary">${esc(n.summary || '')}</div>
    <div class="meta">${esc(n.date || '')} · ${esc(n.sourceName || '')}</div>
  </a>`).join('') || `<div class="state">暂无资讯</div>`;
}
document.querySelector('main.page').insertAdjacentHTML('beforeend', officialFooter());