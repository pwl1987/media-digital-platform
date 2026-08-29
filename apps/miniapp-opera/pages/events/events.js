const { events } = require('../../utils/mock');

Page({
  data: { events: [] },
  onLoad() {
    this.setData({ events });
  },
  openEvent(event) {
    wx.navigateTo({ url: `/pages/event-detail/event-detail?id=${event.currentTarget.dataset.id}` });
  }
});
