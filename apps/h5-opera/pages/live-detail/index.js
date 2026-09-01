// 直播详情：三态（scheduled 倒计时 / live 直播中 / ended 回放）+ 节目单 + 主办承办 + 提醒持久化
import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, getQuery, officialFooter } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const id = getQuery('id');
const root = document.getElementById('root');

const STATUS_LABELS = { live: '直播中', scheduled: '即将直播', upcoming: '即将直播', ended: '已结束' };

const PROGRAM = [
  { time: '19:30', title: '《沂蒙山小调》开场', artists: '沂蒙艺术团 · 张老师 等' },
  { time: '20:00', title: '《红嫂情》第三场 · 乳汁救伤员', artists: '临沂地方戏剧团 · 李老师' },
  { time: '20:40', title: '互动导赏 · 主演对话观众', artists: '主持人：市文化馆 赵老师' },
  { time: '21:10', title: '《山村夜话》选段 · 乡村振兴主题', artists: '沂蒙艺术团' },
  { time: '21:30', title: '谢幕 · 全体演员合影', artists: '全体演职人员' }
];

const THUMBS = [
  { time: '00:12:34', title: '《沂蒙山小调》开场' },
  { time: '00:45:10', title: '《红嫂情》经典选段' },
  { time: '01:23:05', title: '观众互动 · 经典唱段' },
  { time: '01:58:22', title: '谢幕 · 全体演员' }
];

// 提醒持久化（与小程序 opera_notify.live 同构，H5 独立键空间）
const NOTIFY_KEY = 'opera_h5_notify_live';
function loadNotify() {
  try { return JSON.parse(localStorage.getItem(NOTIFY_KEY)) || {}; } catch { return {}; }
}
function saveNotify(map) {
  try { localStorage.setItem(NOTIFY_KEY, JSON.stringify(map)); } catch { /* 忽略 */ }
}

function fmtCountdown(diff) {
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const parts = [];
  if (d > 0) parts.push(`${d} 天`);
  if (d > 0 || h > 0) parts.push(`${h} 小时`);
  parts.push(`${m} 分`);
  parts.push(`${s} 秒`);
  return parts.join(' ');
}

function statusSection(item) {
  const st = item.status === 'upcoming' ? 'scheduled' : item.status;
  if (st === 'live') {
    return `<div class="live-stage">
      <span class="live-dot"></span>
      <div class="live-stage-title">直播进行中</div>
      <div class="live-stage-sub">真实播放地址由直播服务接入后提供；当前为官方演示占位</div>
    </div>`;
  }
  if (st === 'scheduled') {
    return `<div class="countdown-card">
      <div class="cd-emoji">⏱</div>
      <div class="cd-title">距离直播开始</div>
      <div class="cd-time" id="countdown">计算中…</div>
      <div class="cd-sub">开播前可在下方设置提醒</div>
    </div>`;
  }
  return `<div class="detail-body">
    <div class="body">
      <div class="meta" style="font-size:13px;color:var(--ym-text-3);margin-bottom:14px">精彩回顾 · 录播由直播服务接入后提供</div>
      <div class="review-thumbs">${THUMBS.map((t) => `<div class="review-thumb">
        <span class="review-time">${esc(t.time)}</span>
        <span class="review-title">${esc(t.title)}</span>
      </div>`).join('')}</div>
    </div>
  </div>`;
}

if (!id) {
  root.innerHTML = `<div class="state"><span class="emoji">📺</span>直播未找到</div>`;
} else {
  const res = await api.getLive(id);
  if (res.error || !res.data) {
    root.innerHTML = `<div class="state"><span class="emoji">📡</span>直播加载失败</div>`;
  } else {
    const item = res.data;
    const st = item.status === 'upcoming' ? 'scheduled' : item.status;
    const notified = !!loadNotify()[item.id];
    root.innerHTML = `
      <section class="detail-hero live-hero--${st}">
        <span class="badge ${st === 'ended' ? 'badge--gold' : ''}">${STATUS_LABELS[item.status] || '直播'}</span>
        <h1>${esc(item.title)}</h1>
        <div class="meta">${esc((item.startAt || '').replace('T', ' ').slice(0, 16))} · ${esc(item.place || '')}</div>
      </section>
      ${statusSection(item)}
      ${st !== 'ended' ? `<div class="section-head"><h2>节目单</h2></div>
      <div class="detail-body"><div class="program-list">${PROGRAM.map((p) => `<div class="prog-row">
        <span class="prog-time">${esc(p.time)}</span>
        <span class="prog-title">${esc(p.title)}</span>
        <span class="prog-artists">${esc(p.artists)}</span>
      </div>`).join('')}</div></div>` : ''}
      <div class="section-head"><h2>主办承办</h2></div>
      <div class="detail-body"><div class="body">
        <p style="margin:0;color:var(--ym-text-2)">主办：沂蒙小戏小剧官方平台建设工作组</p>
        <p style="margin:6px 0 0;color:var(--ym-text-2)">承办：${esc(item.place || '')} · 临沂市文化馆</p>
      </div></div>
      ${st !== 'ended' ? `<div class="live-actions">
        <button class="live-btn" id="notify-btn">${notified ? '✓ 已设置提醒' : '到时提醒'}</button>
        <button class="live-btn live-btn--primary" id="share-btn">分享直播</button>
      </div>` : ''}
      ${officialFooter()}
    `;
    // 倒计时
    if (st === 'scheduled') {
      const el = document.getElementById('countdown');
      const tick = () => {
        const start = new Date(item.startAt).getTime();
        if (Number.isNaN(start)) { el.textContent = '—'; return; }
        const diff = start - Date.now();
        if (diff <= 0) { el.textContent = '即将开始 · 准备进入直播'; clearInterval(timer); return; }
        el.textContent = fmtCountdown(diff);
      };
      tick();
      const timer = setInterval(tick, 1000);
    }
    // 提醒
    const notifyBtn = document.getElementById('notify-btn');
    if (notifyBtn) {
      notifyBtn.addEventListener('click', () => {
        const map = loadNotify();
        const had = !!map[item.id];
        had ? delete map[item.id] : (map[item.id] = true);
        saveNotify(map);
        notifyBtn.textContent = had ? '到时提醒' : '✓ 已设置提醒';
        notifyBtn.classList.toggle('live-btn--on', !had);
      });
      if (notified) notifyBtn.classList.add('live-btn--on');
    }
    // 分享
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const shareData = { title: item.title, text: `${item.title} · 官方直播`, url: location.href };
        if (navigator.share) {
          try { await navigator.share(shareData); } catch { /* 用户取消 */ }
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(location.href);
          shareBtn.textContent = '✓ 链接已复制';
          setTimeout(() => { shareBtn.textContent = '分享直播'; }, 1600);
        }
      });
    }
  }
}