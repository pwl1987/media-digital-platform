// 直播详情：三态（live 直播中 / scheduled 倒计时 / ended 回顾）+ 节目单 + 主办承办 + 操作条
const liveItems = [
  { id: 'live-001', title: '2026 沂蒙小戏小剧展演直播', status: 'scheduled', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心', subtitle: '展演专场一 · 官方直播' },
  { id: 'live-002', title: '红色题材小戏展演回放', status: 'ended', startAt: '2026-08-22T19:30:00+08:00', place: '临沂剧院', subtitle: '精彩回顾 · 随时回看' }
];

const STATUS_LABELS = { live: '直播中', scheduled: '即将直播', ended: '已结束' };

Page({
  data: {
    loading: true,
    item: null,
    statusLabel: '',
    countdown: '计算中...',
    program: [
      { key: 'p1', time: '19:30', title: '《沂蒙山小调》开场', artists: '沂蒙艺术团 · 张老师 等' },
      { key: 'p2', time: '20:00', title: '《红嫂情》第三场 · 乳汁救伤员', artists: '临沂地方戏剧团 · 李老师' },
      { key: 'p3', time: '20:40', title: '互动导赏 · 主演对话观众', artists: '主持人：市文化馆 赵老师' },
      { key: 'p4', time: '21:10', title: '《山村夜话》选段 · 乡村振兴主题', artists: '沂蒙艺术团' },
      { key: 'p5', time: '21:30', title: '谢幕 · 全体演员合影', artists: '全体演职人员' }
    ],
    thumbs: [
      { key: 'p1', time: '00:12:34', title: '《沂蒙山小调》开场' },
      { key: 'p2', time: '00:45:10', title: '《红嫂情》经典选段' },
      { key: 'p3', time: '01:23:05', title: '观众互动 · 经典唱段' },
      { key: 'p4', time: '01:58:22', title: '谢幕 · 全体演员' }
    ],
    notified: false
  },

  onLoad(options) {
    this.id = options.id;
    this.sync();
    if (this.data.item && this.data.item.status === 'scheduled') this.startCountdown(this.data.item.startAt);
  },

  onShow() {
    if (!this.id) return;
    const set = wx.getStorageSync('opera_notify') || {};
    this.setData({ notified: !!(set.live && set.live[this.id]) });
  },

  onUnload() {
    if (this.cdTimer) clearInterval(this.cdTimer);
  },

  sync() {
    const item = liveItems.find((entry) => entry.id === this.id) || liveItems[0];
    const set = wx.getStorageSync('opera_notify') || {};
    const notified = !!(set.live && set.live[item.id]);
    this.setData({ item, statusLabel: STATUS_LABELS[item.status] || '状态未知', notified, loading: false });
  },

  retry() { if (this.id) this.sync(); },

  startCountdown(startAt) {
    const tick = () => {
      const start = new Date(startAt).getTime();
      if (Number.isNaN(start)) return;
      const diff = start - Date.now();
      if (diff <= 0) {
        this.setData({ countdown: '即将开始 · 准备进入直播' });
        clearInterval(this.cdTimer);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const parts = [];
      if (d > 0) parts.push(`${d} 天`);
      if (d > 0 || h > 0) parts.push(`${h} 小时`);
      parts.push(`${m} 分`);
      parts.push(`${s} 秒`);
      this.setData({ countdown: parts.join(' ') });
    };
    tick();
    this.cdTimer = setInterval(tick, 1000);
  },

  onNotify() {
    const set = wx.getStorageSync('opera_notify') || { live: {} };
    set.live = set.live || {};
    const had = !!set.live[this.id];
    had ? delete set.live[this.id] : (set.live[this.id] = true);
    wx.setStorageSync('opera_notify', set);
    this.setData({ notified: !had });
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: had ? '已取消提醒' : '已设置开播提醒（演示）', icon: had ? 'none' : 'success' });
  },

  onJoin() {
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '进入直播（演示）', icon: 'success' });
  },

  onShare() {
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '已生成分享卡', icon: 'success' });
  },

  onShareAppMessage() {
    const i = this.data.item || {};
    return { title: `${i.title} · 官方直播`, path: `/pages/live-detail/live-detail?id=${i.id || 'live-001'}` };
  }
});