// 活动详情：头卡 + 关键信息 + 演出场次时间线 + 参演剧目 + 报名（走共享 client）
const api = require('../../utils/api');

const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
function pad(n) { return `${n}`.padStart(2, '0'); }
function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${WEEK[d.getDay()]} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

Page({
  data: {
    event: null,
    timeLabel: '',
    performances: [],
    relatedWorks: [],
    signed: false,
    signUpPercent: 0
  },

  onLoad(options) {
    this.id = options.id;
    if (!this.id) return;
    this.load();
  },

  retry() { if (this.id) this.load(); },

  load() {
    Promise.all([api.getEvent(this.id), api.getPerformances({ eventId: this.id }), api.getWorks()])
      .then(([eventRes, perfRes, worksRes]) => {
        if (eventRes.error || !eventRes.data) return;
        const event = eventRes.data;
        this.setData({
          event,
          timeLabel: formatTime(event.startAt),
          performances: ((perfRes.data && perfRes.data.items) || []).map((p) => ({ ...p, timeLabel: formatTime(p.startAt) })),
          relatedWorks: ((worksRes.data && worksRes.data.items) || []).filter((w) => (event.workIds || []).includes(w.id)),
          signUpPercent: event.capacity ? Math.min(100, Math.round(((event.signedUp || 0) / event.capacity) * 100)) : 0
        });
      })
      .catch(() => {});
  },

  onShare() {
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '已生成分享卡', icon: 'success' });
  },

  onSign() {
    if (this.signed) return;
    this.signed = true;
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '报名成功（演示）', icon: 'success' });
  },

  openWork(e) { wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${e.currentTarget.dataset.id}` }); },

  onShareAppMessage() {
    const e = this.data.event || {};
    return { title: `${e.title} · 展演活动`, path: `/pages/event-detail/event-detail?id=${e.id || this.id || ''}` };
  }
});
