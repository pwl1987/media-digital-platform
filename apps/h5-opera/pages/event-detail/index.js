import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, getQuery, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const id = getQuery('id');
const root = document.getElementById('root');

if (!id) {
  root.innerHTML = `<div class="state"><span class="emoji">📅</span>活动未找到</div>`;
} else {
  const res = await api.getEvent(id);
  if (res.error || !res.data) {
    root.innerHTML = `<div class="state"><span class="emoji">📡</span>活动加载失败</div>`;
  } else {
    const e = res.data;
    root.innerHTML = `
      <section class="detail-hero">
        <span class="badge">${esc(e.category || '展演')}</span>
        <h1>${esc(e.title)}</h1>
        <div class="meta">${esc(e.startAt || '')} · ${esc(e.place || '')}</div>
      </section>
      <div class="body" style="margin-top:24px;background:var(--ym-surface);border-radius:8px;padding:28px 32px;box-shadow:var(--ym-shadow-rest);font-size:16px;line-height:1.85">
        <p>${esc(e.desc || '正式内容接入后展示。')}</p>
      </div>
      ${officialFooter()}
    `;
  }
}