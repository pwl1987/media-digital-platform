import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const root = document.getElementById('live-list');

const res = await api.getLives();
if (res.error || !res.data) {
  root.innerHTML = `<div class="state"><span class="emoji">📡</span>直播列表加载失败</div>`;
} else {
  const items = res.data.items || [];
  if (!items.length) {
    root.innerHTML = `<div class="state"><span class="emoji">📺</span>暂无直播安排</div>`;
  } else {
    const upcoming = items.filter((x) => x.status === 'upcoming' || x.status === 'scheduled');
    const ended = items.filter((x) => x.status === 'ended');
    root.innerHTML = `
      ${upcoming.length ? `<div class="section-head"><h2>直播预告</h2></div>
      <div class="grid">${upcoming.map((x) => `<a class="card live-card live-card--upcoming" href="../live-detail/index.html?id=${encodeURIComponent(x.id)}">
        <div><span class="badge">直播预告</span></div>
        <div class="title">${esc(x.title)}</div>
        ${x.subtitle ? `<div class="summary">${esc(x.subtitle)}</div>` : ''}
        <div class="meta">${esc((x.startAt || '').replace('T', ' ').slice(0, 16))} · ${esc(x.place || '')}</div>
      </a>`).join('')}</div>` : ''}
      ${ended.length ? `<div class="section-head"><h2>精彩回顾</h2></div>
      <div class="grid">${ended.map((x) => `<a class="card live-card live-card--ended" href="../live-detail/index.html?id=${encodeURIComponent(x.id)}">
        <div><span class="badge badge--gold">已结束</span></div>
        <div class="title">${esc(x.title)}</div>
        ${x.subtitle ? `<div class="summary">${esc(x.subtitle)}</div>` : ''}
        <div class="meta">${esc((x.startAt || '').replace('T', ' ').slice(0, 16))} · ${esc(x.place || '')}</div>
      </a>`).join('')}</div>` : ''}
    `;
  }
}
document.querySelector('main.page').insertAdjacentHTML('beforeend', officialFooter());