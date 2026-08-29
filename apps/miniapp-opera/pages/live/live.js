const liveItems = [
  { id: 'live-001', title: '沂蒙小戏小剧展演直播', status: 'scheduled', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心', subtitle: '展演专场一 · 直播预告' },
  { id: 'live-002', title: '红色题材小戏展演', status: 'ended', startAt: '2026-08-22T19:30:00+08:00', place: '临沂剧院', subtitle: '精彩回顾' }
];

Page({
  data: { items: liveItems },
  openLive(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/live-detail/live-detail?id=${id}` });
  }
});
