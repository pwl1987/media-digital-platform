import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const list = document.getElementById('works-list');

const res = await api.getWorks();
if (res.error || !res.data) {
  list.innerHTML = `<div class="state"><span class="emoji">📡</span>剧目加载失败</div>`;
} else {
  list.innerHTML = res.data.items.map((w) => `<a class="poster-card" href="../work-detail/index.html?id=${encodeURIComponent(w.id)}">
    <div class="poster"><span class="poster-title">${esc(w.title)}</span></div>
    <div class="poster-body">
      <div class="title">《${esc(w.title)}》</div>
      <div class="summary">${esc(w.summary || '')}</div>
      <div class="meta">${esc((w.organization && w.organization.title) || '')}${w.tag ? ' · ' + esc(w.tag) : ''}</div>
    </div>
  </a>`).join('') || `<div class="state">暂无剧目</div>`;
}
document.querySelector('main.page').insertAdjacentHTML('beforeend', officialFooter());