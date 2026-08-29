const { works, events } = require('../../utils/mock');

Page({
  data: { works, events },
  goWorks() { wx.switchTab({ url: '/pages/works/works' }); },
  goEvents() { wx.switchTab({ url: '/pages/events/events' }); },
  goLive() { wx.switchTab({ url: '/pages/live/live' }); },
  openWork(e) { wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${e.currentTarget.dataset.id}` }); },
  openEvent(e) { wx.navigateTo({ url: `/pages/event-detail/event-detail?id=${e.currentTarget.dataset.id}` }); }
});
