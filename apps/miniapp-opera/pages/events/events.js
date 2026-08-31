// 展演活动：日期块状态卡（lifecycleStatus 三态），数据走共享 client
const api = require('../../utils/api');

function pad(n) { return `${n}`.padStart(2, '0'); }

function decorate(item) {
  const d = new Date(item.startAt);
  const valid = !Number.isNaN(d.getTime());
  return {
    ...item,
    month: valid ? pad(d.getMonth() + 1) : '--',
    day: valid ? pad(d.getDate()) : '--',
    timeLabel: valid ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : '',
    statusLabel: item.lifecycleStatus === 'ongoing' ? '进行中' : item.lifecycleStatus === 'ended' ? '已结束' : '预告'
  };
}

Page({
  data: {
    loading: true,
    error: false,
    events: []
  },

  onLoad() {
    this.fetch();
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.fetch();
  },

  fetch() {
    api.getEvents()
      .then((res) => {
        if (res.error) throw new Error('events failed');
        const events = ((res.data && res.data.items) || []).map(decorate);
        // 进行中/预告在前，已结束在后
        events.sort((a, b) => {
          const order = { ongoing: 0, upcoming: 1, ended: 2 };
          return ((order[a.lifecycleStatus] ?? 3) - (order[b.lifecycleStatus] ?? 3));
        });
        this.setData({ loading: false, events });
      })
      .catch(() => this.setData({ loading: false, error: true, events: [] }));
  },

  openEvent(e) {
    wx.navigateTo({ url: `/pages/event-detail/event-detail?id=${e.currentTarget.dataset.id}` });
  },

  onPullDownRefresh() {
    this.fetch();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return { title: '展演活动 · 沂蒙小戏小剧', path: '/pages/events/events' };
  }
});
