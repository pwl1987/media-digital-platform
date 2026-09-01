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
        <span class="badge badge--gold">${esc(n.sourceLevelLabel || '官方资讯')}</span>
        <h1>${esc(n.title)}</h1>
        <div class="meta">${esc(n.date || '')} · ${esc(n.sourceName || '')} · ${esc(n.category || '')}</div>
      </section>
      ${n.summary ? `<blockquote class="detail-quote">${esc(n.summary)}</blockquote>` : ''}
      <div class="detail-body">
        <div class="body">
          ${(n.body || '').split('\n').filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('')}
        </div>
      </div>
      ${officialFooter()}
    `;
  }
}