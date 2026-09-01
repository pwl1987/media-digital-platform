import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, getQuery, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const id = getQuery('id');
const root = document.getElementById('root');

if (!id) {
  root.innerHTML = `<div class="state"><span class="emoji">📡</span>影像未找到</div>`;
} else {
  const res = await api.getVideo(id);
  if (res.error || !res.data) {
    root.innerHTML = `<div class="state"><span class="emoji">📡</span>影像加载失败</div>`;
  } else {
    const v = res.data;
    root.innerHTML = `
      <section style="position:relative;background:linear-gradient(150deg,var(--ym-red-900),var(--ym-red-700));color:#fff;padding:48px 32px 36px;border-radius:8px">
        <span class="official-badge">官方影像</span>
        <span class="badge">${esc(v.category || '影像')}</span>
        <h1 style="font-size:28px;margin:12px 0 0;font-family:'Songti SC',serif;line-height:1.4">${esc(v.title)}</h1>
        <div class="meta" style="margin-top:12px;font-size:13px;opacity:0.85">${esc(v.sourceName || '')} · ${esc(v.resolution || '')} · ${esc(v.durationLabel || '')}</div>
      </section>
      ${v.tags && v.tags.length ? `<div style="margin:24px 0;display:flex;gap:8px;flex-wrap:wrap">
        ${v.tags.map((t) => `<span class="badge">${esc(t)}</span>`).join('')}
      </div>` : ''}
      <div style="margin-top:24px;background:var(--ym-surface);border-radius:8px;padding:28px 32px;box-shadow:var(--ym-shadow-rest);font-size:16px;line-height:1.85;color:var(--ym-text)">
        <p>媒资接入后支持在线播放。本演示为占位详情，影像内容由 Live API 接入后提供。</p>
      </div>
      ${officialFooter()}
    `;
  }
}