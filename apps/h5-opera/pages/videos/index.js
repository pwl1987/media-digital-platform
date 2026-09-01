import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const list = document.getElementById('videos-list');

const res = await api.getVideos();
if (res.error || !res.data) {
  list.innerHTML = `<div class="state"><span class="emoji">📡</span>影像加载失败</div>`;
} else {
  list.innerHTML = res.data.items.map((v) => `<a class="card" href="../video-detail/index.html?id=${encodeURIComponent(v.id)}" style="display:block;color:inherit">
    <span class="badge">${esc(v.category || '影像')}</span>
    <div class="title">${esc(v.title)}</div>
    <div class="summary">${esc((v.tags || []).join(' · '))}</div>
    <div class="meta">${esc(v.sourceName || '')} · ${esc(v.resolution || '')} · ${esc(v.durationLabel || '')}</div>
  </a>`).join('') || `<div class="state">暂无影像</div>`;
}