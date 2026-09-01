import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, getQuery, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const id = getQuery('id');
const root = document.getElementById('root');

if (!id) {
  root.innerHTML = `<div class="state"><span class="emoji">🎭</span>剧目档案未找到</div>`;
} else {
  const res = await api.getWork(id);
  if (res.error || !res.data) {
    root.innerHTML = `<div class="state"><span class="emoji">📡</span>剧目加载失败</div>`;
  } else {
    const w = res.data;
    root.innerHTML = `
      <section class="detail-hero">
        <span class="official-badge">官方收录</span>
        <span class="badge">${esc(w.tag || '精品剧目')}</span>
        <h1>《${esc(w.title)}》</h1>
        <div class="meta">${esc((w.organization && w.organization.title) || '')}</div>
      </section>
      ${w.summary ? `<blockquote style="margin:24px 0;padding:20px 24px;border-left:6px solid var(--ym-red-700);background:var(--ym-surface);border-radius:8px;font-size:16px;color:var(--ym-text);line-height:1.7">${esc(w.summary)}</blockquote>` : ''}
      <div class="body" style="margin-top:24px;background:var(--ym-surface);border-radius:8px;padding:28px 32px;box-shadow:var(--ym-shadow-rest);font-size:16px;line-height:1.85">
        ${(w.body || w.summary || '正式内容接入后展示。').split('\n').filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('')}
      </div>
      ${officialFooter()}
    `;
  }
}