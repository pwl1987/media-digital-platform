// 活动详情：头卡 + 关键信息 + 演出场次时间线 + 流程 + 参演剧目 + 报名（走共享 client + 本地持久化）
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
    loading: true,
    error: false,
    event: null,
    timeLabel: '',
    performances: [],
    relatedWorks: [],
    signed: false,
    signedUp: 0,
    signUpPercent: 0,
    flow: [
      { key: 'open', time: '18:30', title: '观众入场', desc: '剧场开放 · 签到取票' },
      { key: 'start', time: '19:30', title: '正式开演', desc: '暖场 + 开场剧目' },
      { key: 'mid', time: '20:00', title: '中场互动', desc: '导赏与观众问答' },
      { key: 'end', time: '21:30', title: '谢幕', desc: '全体演员谢幕合影' }
    ]
  },

  onLoad(options) {
    this.id = options.id;
    if (!this.id) { this.setData({ loading: false, error: true }); return; }
    const reg = wx.getStorageSync('opera_signed_up') || {};
    this.signedFromStorage = !!(reg.event && reg.event[this.id]);
    this.setData({ signed: this.signedFromStorage });
    this.load();
  },

  retry() { if (this.id) this.load(); },

  load() {
    Promise.all([api.getEvent(this.id), api.getPerformances({ eventId: this.id }), api.getWorks()])
      .then(([eventRes, perfRes, worksRes]) => {
        if (eventRes.error || !eventRes.data) throw new Error('not found');
        const event = eventRes.data;
        const signedUp = (event.signedUp || 0) + (this.signedFromStorage ? 1 : 0);
        wx.setNavigationBarTitle({ title: '展演活动' });
        this.setData({
          loading: false,
          event,
          timeLabel: formatTime(event.startAt),
          performances: ((perfRes.data && perfRes.data.items) || []).map((p) => ({ ...p, timeLabel: formatTime(p.startAt) })),
          relatedWorks: ((worksRes.data && worksRes.data.items) || []).filter((w) => (event.workIds || []).includes(w.id)),
          signedUp,
          signUpPercent: event.capacity ? Math.min(100, Math.round((signedUp / event.capacity) * 100)) : 0
        });
      })
      .catch(() => this.setData({ loading: false, error: true }));
  },

  onShare() {
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '已生成分享卡', icon: 'success' });
  },

  onSign() {
    if (this.data.signed) {
      wx.showToast({ title: '已报名，请勿重复操作', icon: 'none' });
      return;
    }
    const reg = wx.getStorageSync('opera_signed_up') || { event: {} };
    reg.event = reg.event || {};
    reg.event[this.id] = true;
    wx.setStorageSync('opera_signed_up', reg);
    const nextSignedUp = this.data.signedUp + 1;
    const event = this.data.event;
    const nextPercent = event && event.capacity
      ? Math.min(100, Math.round((nextSignedUp / event.capacity) * 100))
      : 0;
    this.setData({ signed: true, signedUp: nextSignedUp, signUpPercent: nextPercent });
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '报名成功（演示）', icon: 'success' });
  },

  openWork(e) { wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${e.currentTarget.dataset.id}` }); },

  onShareAppMessage() {
    const e = this.data.event || {};
    return { title: `${e.title} · 展演活动`, path: `/pages/event-detail/event-detail?id=${e.id || this.id || ''}` };
  }
});