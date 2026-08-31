const liveItems = [
  { id: 'live-001', title: '2026 沂蒙小戏小剧展演直播', status: 'upcoming', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心', subtitle: '展演专场一 · 官方直播' },
  { id: 'live-002', title: '红色题材小戏展演回放', status: 'ended', startAt: '2026-08-22T19:30:00+08:00', place: '临沂剧院', subtitle: '精彩回顾 · 随时回看' }
];

Page({
  data: {
    loading: true,
    upcoming: [],
    ended: []
  },
  onLoad() {
    // 静态数据预热：百毫秒级骨架闪一下与全站体验一致
    setTimeout(() => {
      this.setData({
        loading: false,
        upcoming: liveItems.filter((x) => x.status !== 'ended'),
        ended: liveItems.filter((x) => x.status === 'ended')
      });
    }, 120);
  },
  openLive(e) {
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.navigateTo({ url: `/pages/live-detail/live-detail?id=${e.currentTarget.dataset.id}` });
  }
});