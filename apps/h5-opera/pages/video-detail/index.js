import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, getQuery, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const id = getQuery('id');
const root = document.getElementById('root');

if (!id) {
  root.innerHTML = `<div class="state"><span class="emoji">📡</span>影像未找到</div>`;
} else {
  const [vRes, wRes, newsRes] = await Promise.all([api.getVideo(id), api.getWorks(), api.getNews({ pageSize: 50 })]);
  if (vRes.error || !vRes.data) {
    root.innerHTML = `<div class="state"><span class="emoji">📡</span>影像加载失败</div>`;
  } else {
    const v = vRes.data;
    const works = (wRes.data && wRes.data.items) || [];
    const relatedWork = works.find((w) => (w.media || []).some((m) => m.id === v.id)) || null;
    const relatedNews = ((newsRes.data && newsRes.data.items) || []).filter((n) => (n.relatedVideoIds || []).includes(v.id)).slice(0, 3);
    root.innerHTML = `
      <section class="detail-hero" style="padding:0;overflow:hidden">
        <div class="cover" style="position:relative;aspect-ratio:16/9;background:linear-gradient(150deg,var(--ym-red-900),var(--ym-red-700));display:flex;align-items:center;justify-content:center">
          <span class="official-badge">官方影像</span>
          <span class="cat" style="position:absolute;left:12px;top:12px;font-size:11px;color:var(--ym-gold-300);background:rgba(31,31,31,.45);border:1px solid rgba(227,203,122,.4);border-radius:4px;padding:2px 8px">${esc(v.category || '影像')}</span>
          <div style="text-align:center;padding:0 24px">
            <div style="font-size:26px;font-family:'Songti SC',serif;line-height:1.5;text-shadow:0 2px 8px rgba(0,0,0,.3)">${esc(v.title)}</div>
            <div style="margin-top:16px;width:56px;height:56px;margin-left:auto;margin-right:auto;border-radius:50%;background:rgba(31,31,31,.45);border:2px solid rgba(255,255,255,.8);display:flex;align-items:center;justify-content:center;font-size:22px">▶</div>
          </div>
          <span style="position:absolute;right:12px;bottom:12px;font-size:11px;color:#fff;background:rgba(31,31,31,.6);border-radius:4px;padding:2px 8px;font-variant-numeric:tabular-nums">${esc(v.durationLabel || '')}</span>
        </div>
      </section>
      ${v.tags && v.tags.length ? `<div class="detail-tags">${v.tags.map((t) => `<span class="badge">${esc(t)}</span>`).join('')}</div>` : ''}
      <div class="detail-body">
        <div class="body">
          <div class="meta" style="font-size:13px;color:var(--ym-text-3);margin-bottom:14px">${esc(v.sourceName || '')} · ${esc(v.resolution || '')} · 时长 ${esc(v.durationLabel || '')}</div>
          <p>媒资接入后支持在线播放。当前为官方影像档案演示，播放源由媒体服务接入后提供。</p>
        </div>
      </div>
      ${relatedWork ? `<div class="section-head"><h2>相关剧目</h2></div>
      <a class="poster-card" href="../work-detail/index.html?id=${encodeURIComponent(relatedWork.id)}">
        <div class="poster"><span class="poster-title">${esc(relatedWork.title)}</span></div>
        <div class="poster-body">
          <div class="title">《${esc(relatedWork.title)}》</div>
          <div class="summary">${esc(relatedWork.summary || '')}</div>
        </div>
      </a>` : ''}
      ${relatedNews.length ? `<div class="section-head"><h2>相关资讯</h2></div>
      <div class="grid">${relatedNews.map((n) => `<a class="card" href="../news-detail/index.html?id=${encodeURIComponent(n.id)}">
        <div><span class="badge">${esc(n.sourceLevelLabel || '官方资讯')}</span></div>
        <div class="title">${esc(n.title)}</div>
        <div class="meta">${esc(n.date || '')} · ${esc(n.sourceName || '')}</div>
      </a>`).join('')}</div>` : ''}
      ${officialFooter()}
    `;
  }
}