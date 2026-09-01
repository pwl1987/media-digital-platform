import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, getQuery, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const id = getQuery('id');
const root = document.getElementById('root');

if (!id) {
  root.innerHTML = `<div class="state"><span class="emoji">🏛</span>剧团档案未找到</div>`;
} else {
  const [oRes, wRes, vRes] = await Promise.all([api.getOrganization(id), api.getWorks(), api.getVideos()]);
  if (oRes.error || !oRes.data) {
    root.innerHTML = `<div class="state"><span class="emoji">📡</span>剧团档案加载失败</div>`;
  } else {
    const o = oRes.data;
    const works = ((wRes.data && wRes.data.items) || []).filter((w) => w.organization && w.organization.id === o.id);
    const titles = new Set(works.map((w) => w.title));
    const videos = ((vRes.data && vRes.data.items) || []).filter((v) => {
      if (!v.title) return false;
      for (const t of titles) if (v.title.includes(t)) return true;
      return v.title.includes(o.title || '');
    }).slice(0, 6);
    root.innerHTML = `
      <section class="org-hero">
        <span class="official-badge">官方收录</span>
        <div class="org-glyph">${esc(String(o.title || '').slice(0, 1))}</div>
      </section>
      <div class="name-bar">
        <span class="name">${esc(o.title)}</span>
      </div>
      <div class="org-line">官方剧团 · 资料持续补充中</div>
      <div class="detail-body">
        <div class="body"><p>${esc(o.summary || '正式内容接入后展示。')}</p></div>
      </div>
      ${works.length ? `<div class="section-head"><h2>代表剧目</h2></div>
      <div class="grid">${works.map((w) => `<a class="poster-card" href="../work-detail/index.html?id=${encodeURIComponent(w.id)}">
        <div class="poster"><span class="poster-title">${esc(w.title)}</span></div>
        <div class="poster-body">
          <div class="title">《${esc(w.title)}》</div>
          <div class="meta">${esc(w.tag || '')}</div>
        </div>
      </a>`).join('')}</div>` : ''}
      ${videos.length ? `<div class="section-head"><h2>院团影像</h2></div>
      <div class="grid grid--media">${videos.map((v) => `<a class="media-card" href="../video-detail/index.html?id=${encodeURIComponent(v.id)}">
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
      ${officialFooter()}
    `;
  }
}