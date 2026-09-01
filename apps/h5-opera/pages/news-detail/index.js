import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, getQuery, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const id = getQuery('id');
const root = document.getElementById('root');

if (!id) {
  root.innerHTML = `<div class="state"><span class="emoji">📡</span>资讯不存在</div>`;
} else {
  const [nRes, wRes, vRes, allNewsRes] = await Promise.all([
    api.getNewsDetail(id),
    api.getWorks(),
    api.getVideos(),
    api.getNews({ pageSize: 50 })
  ]);
  if (nRes.error || !nRes.data) {
    root.innerHTML = `<div class="state"><span class="emoji">📡</span>资讯加载失败</div>`;
  } else {
    const n = nRes.data;
    // 传播链：资讯 → 相关剧目 / 相关影像 / 推荐阅读（对齐小程序 news-detail）
    const works = (wRes.data && wRes.data.items) || [];
    const videos = (vRes.data && vRes.data.items) || [];
    const allNews = (allNewsRes.data && allNewsRes.data.items) || [];
    const relatedWorks = works.filter((w) => (n.relatedWorkIds || []).includes(w.id));
    const relatedVideos = videos.filter((v) => (n.relatedVideoIds || []).includes(v.id));
    const moreNews = allNews.filter((x) => x.id !== n.id).slice(0, 3);
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
      ${relatedWorks.length ? `<div class="section-head"><h2>相关剧目</h2></div>
      <div class="grid">${relatedWorks.map((w) => `<a class="poster-card" href="../work-detail/index.html?id=${encodeURIComponent(w.id)}">
        <div class="poster"><span class="poster-title">${esc(w.title)}</span></div>
        <div class="poster-body">
          <div class="title">《${esc(w.title)}》</div>
          <div class="meta">${esc((w.organization && w.organization.title) || '')}</div>
        </div>
      </a>`).join('')}</div>` : ''}
      ${relatedVideos.length ? `<div class="section-head"><h2>相关影像</h2></div>
      <div class="grid grid--media">${relatedVideos.map((v) => `<a class="media-card" href="../video-detail/index.html?id=${encodeURIComponent(v.id)}">
        <div class="cover">
          <span class="cat">${esc(v.category || '影像')}</span>
          <span class="cover-glyph">${esc(v.title.slice(0, 8))}</span>
          <span class="play">▶</span>
          <span class="duration">${esc(v.durationLabel || '')}</span>
        </div>
        <div class="media-body">
          <div class="title">${esc(v.title)}</div>
          <div class="meta">${esc(v.sourceName || '')} · ${esc(v.resolution || '')}</div>
        </div>
      </a>`).join('')}</div>` : ''}
      ${moreNews.length ? `<div class="section-head"><h2>推荐阅读</h2></div>
      <div class="grid">${moreNews.map((x) => `<a class="card" href="../news-detail/index.html?id=${encodeURIComponent(x.id)}">
        <div><span class="badge">${esc(x.sourceLevelLabel || '官方资讯')}</span></div>
        <div class="title">${esc(x.title)}</div>
        <div class="meta">${esc(x.date || '')} · ${esc(x.sourceName || '')}</div>
      </a>`).join('')}</div>` : ''}
      ${officialFooter()}
    `;
  }
}