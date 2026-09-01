import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const list = document.getElementById('events-list');

const res = await api.getEvents();
if (res.error || !res.data) {
  list.innerHTML = `<div class="state"><span class="emoji">📡</span>活动加载失败</div>`;
} else {
  list.innerHTML = res.data.items.map((e) => {
    const life = e.lifecycleStatus === 'ongoing' ? '进行中' : e.lifecycleStatus === 'ended' ? '已结束' : '预告';
    return `<a class="card" href="../event-detail/index.html?id=${encodeURIComponent(e.id)}">
      <div><span class="badge">${esc(e.category || '展演')}</span><span class="badge badge--gold">${life}</span></div>
      <div class="title">${esc(e.title)}</div>
      <div class="summary">${esc(e.desc || '')}</div>
      <div class="meta">${esc((e.startAt || '').replace('T', ' ').slice(0, 16))} · ${esc(e.place || '')}</div>
    </a>`;
  }).join('') || `<div class="state">暂无活动</div>`;
}
document.querySelector('main.page').insertAdjacentHTML('beforeend', officialFooter());