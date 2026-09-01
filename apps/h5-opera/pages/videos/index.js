import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const list = document.getElementById('videos-list');

const res = await api.getVideos();
if (res.error || !res.data) {
  list.innerHTML = `<div class="state"><span class="emoji">📡</span>影像加载失败</div>`;
} else {
  list.innerHTML = res.data.items.map((v) => `<a class="media-card" href="../video-detail/index.html?id=${encodeURIComponent(v.id)}">
    <div class="cover">
      <span class="cat">${esc(v.category || '影像')}</span>
      <span class="cover-glyph">${esc(v.title.slice(0, 8))}</span>
      <span class="play">▶</span>
      <span class="duration">${esc(v.durationLabel || '')}</span>
    </div>
    <div class="media-body">
      <div class="title">${esc(v.title)}</div>
      <div class="meta">${esc(v.sourceName || '')} · ${esc(v.resolution || '')}</div>
      ${v.tags && v.tags.length ? `<div class="tags">${v.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
    </div>
  </a>`).join('') || `<div class="state">暂无影像</div>`;
}
document.querySelector('main.page').insertAdjacentHTML('beforeend', officialFooter());