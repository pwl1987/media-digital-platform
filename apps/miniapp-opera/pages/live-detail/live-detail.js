const liveItems = [
  { id: 'live-001', title: '沂蒙小戏小剧展演直播', status: 'scheduled', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心', subtitle: '展演专场一 · 直播预告' },
  { id: 'live-002', title: '红色题材小戏展演', status: 'ended', startAt: '2026-08-22T19:30:00+08:00', place: '临沂剧院', subtitle: '精彩回顾' }
];

Page({
  data: { item: null, statusLabel: '' },
  onLoad(options) {
    const item = liveItems.find((entry) => entry.id === options.id) || liveItems[0];
    this.setData({ item, statusLabel: this.label(item.status) });
  },
  label(status) {
    return ({ live: '直播中', scheduled: '即将直播', ended: '已结束' })[status] || '状态未知';
  },
  onShareAppMessage() {
    return { title: this.data.item ? this.data.item.title : '沂蒙小戏小剧直播', path: '/pages/live-detail/live-detail?id=live-001' };
  }
});
