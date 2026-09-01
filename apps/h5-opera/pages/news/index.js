import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const list = document.getElementById('news-list');

function cardHTML(n) {
  return `<a class="card" href="../news-detail/index.html?id=${encodeURIComponent(n.id)}" style="display:block;color:inherit">
    <span class="badge">${esc(n.sourceLevelLabel || '官方资讯')}</span>
    <div class="title">${esc(n.title)}</div>
    <div class="summary">${esc(n.summary || '')}</div>
    <div class="meta">${esc(n.date || '')} · ${esc(n.sourceName || '')}</div>
  </a>`;
}

const res = await api.getNews({ pageSize: 50 });
if (res.error || !res.data) {
  list.innerHTML = `<div class="state"><span class="emoji">📡</span>资讯加载失败</div>`;
} else {
  list.innerHTML = res.data.items.map(cardHTML).join('') || `<div class="state">暂无资讯</div>`;
}