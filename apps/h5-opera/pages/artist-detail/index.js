import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, getQuery, officialFooter, backBar, actionBar, bindShare } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const id = getQuery('id');
const root = document.getElementById('root');

if (!id) {
  root.innerHTML = `<div class="state"><span class="emoji">🎭</span>演员档案未找到</div>`;
} else {
  const [aRes, wRes, vRes] = await Promise.all([api.getArtist(id), api.getWorks(), api.getVideos()]);
  if (aRes.error || !aRes.data) {
    root.innerHTML = `<div class="state"><span class="emoji">📡</span>演员档案加载失败</div>`;
  } else {
    const a = aRes.data;
    const artistName = a.title;
    const works = ((wRes.data && wRes.data.items) || []).filter((w) =>
      (w.artists || []).some((x) => x.title === artistName) || (artistName && (w.summary || '').includes(artistName))
    );
    const titles = new Set(works.map((w) => w.title));
    const videos = ((vRes.data && vRes.data.items) || []).filter((v) => {
      if (!v.title) return false;
      for (const t of titles) if (v.title.includes(t)) return true;
      return artistName && v.title.includes(artistName);
    }).slice(0, 6);
    root.innerHTML = `
      ${backBar("返回剧目", "../works/index.html")}
      <section class="portrait-hero">
        <span class="official-badge">官方收录</span>
        <div class="portrait-glyph">${esc(String(a.title || '').slice(0, 1))}</div>
      </section>
      <div class="name-bar">
        <span class="name">${esc(a.title)}</span>
        <span class="role">${esc(a.role || '演员')}</span>
      </div>
      <div class="org-line">${esc(a.organization || '')}</div>
      ${a.honors && a.honors.length ? `<div class="honors">${a.honors.map((h) => `<span class="badge badge--gold">🏅 ${esc(h)}</span>`).join('')}</div>` : ''}
      <div class="detail-body">
        <div class="body"><p>${esc(a.bio || '正式内容接入后展示。')}</p></div>
      </div>
      ${works.length ? `<div class="section-head"><h2>代表作品</h2></div>
      <div class="grid">${works.map((w) => `<a class="poster-card" href="../work-detail/index.html?id=${encodeURIComponent(w.id)}">
        <div class="poster"><span class="poster-title">${esc(w.title)}</span></div>
        <div class="poster-body">
          <div class="title">《${esc(w.title)}》</div>
          <div class="meta">${esc((w.organization && w.organization.title) || '')}</div>
        </div>
      </a>`).join('')}</div>` : ''}
      ${videos.length ? `<div class="section-head"><h2>主演影像</h2></div>
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
      ${actionBar({ shareLabel: "分享档案" })}
      ${officialFooter()}
    `;
    bindShare('page-share-btn', { title: `${a.title} · 演员档案` });
  }
}