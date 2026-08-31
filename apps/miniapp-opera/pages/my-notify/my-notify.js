// 直播提醒：聚合读取本地 opera_notify.live；按状态分三栏
Page({
  data: {
    loading: true,
    upcoming: [],
    live: [],
    ended: [],
    upcomingCount: 0,
    liveCount: 0,
    endedCount: 0
  },

  onShow() {
    this.setData({ loading: true });
    setTimeout(() => this.refresh(), 120);
  },

  refresh() {
    const notify = wx.getStorageSync('opera_notify') || {};
    const ids = Object.keys(notify.live || {});
    const upcoming = [];
    const live = [];
    const ended = [];
    const liveItems = [
      { id: 'live-001', title: '2026 沂蒙小戏小剧展演直播', status: 'scheduled', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心' },
      { id: 'live-002', title: '红色题材精品专场直播', status: 'ended', startAt: '2026-08-22T19:30:00+08:00', place: '临沂剧院' }
    ];
    ids.forEach((id) => {
      const item = liveItems.find((x) => x.id === id);
      if (!item) return;
      if (item.status === 'scheduled') upcoming.push(item);
      else if (item.status === 'live') live.push(item);
      else ended.push(item);
    });
    this.setData({
      loading: false,
      upcoming, live, ended,
      upcomingCount: upcoming.length,
      liveCount: live.length,
      endedCount: ended.length
    });
  },

  openLive(e) {
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.navigateTo({ url: `/pages/live-detail/live-detail?id=${e.currentTarget.dataset.id}` });
  },

  cancel(e) {
    const id = e.currentTarget.dataset.id;
    const notify = wx.getStorageSync('opera_notify') || {};
    if (notify.live && notify.live[id]) {
      delete notify.live[id];
      wx.setStorageSync('opera_notify', notify);
      wx.vibrateShort && wx.vibrateShort({ type: 'light' });
      wx.showToast({ title: '已取消提醒', icon: 'none' });
      this.refresh();
    }
  }
});