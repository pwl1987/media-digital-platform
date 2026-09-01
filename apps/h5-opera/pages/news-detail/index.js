import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, getQuery, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const id = getQuery('id');
const root = document.getElementById('root');

if (!id) {
  root.innerHTML = `<div class="state"><span class="emoji">📡</span>资讯不存在</div>`;
} else {
  const res = await api.getNewsDetail(id);
  if (res.error || !res.data) {
    root.innerHTML = `<div class="state"><span class="emoji">📡</span>资讯加载失败</div>`;
  } else {
    const n = res.data;
    root.innerHTML = `
      <section class="detail-hero">
        <span class="badge">${esc(n.sourceLevelLabel || '官方资讯')}</span>
        <h1>${esc(n.title)}</h1>
        <div class="meta">${esc(n.date || '')} · ${esc(n.sourceName || '')}</div>
      </section>
      ${n.summary ? `<blockquote style="margin:24px 0;padding:20px 24px;border-left:6px solid var(--ym-red-700);background:var(--ym-surface);border-radius:8px;font-size:16px;color:var(--ym-text);line-height:1.7">${esc(n.summary)}</blockquote>` : ''}
      <div class="body" style="margin-top:32px;background:var(--ym-surface);border-radius:8px;padding:28px 32px;box-shadow:var(--ym-shadow-rest)">
        ${(n.body || '').split('\n').filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('')}
      </div>
      ${officialFooter()}
    `;
  }
}