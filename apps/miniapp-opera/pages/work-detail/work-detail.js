const { works } = require('../../utils/mock');

Page({
  data: { work: null },
  onLoad(options) {
    const work = works.find((item) => item.id === options.id) || works[0];
    this.setData({ work });
  },
  openArtist(event) {
    wx.navigateTo({ url: `/pages/artist-detail/artist-detail?id=${event.currentTarget.dataset.id}` });
  },
  openOrganization(event) {
    wx.navigateTo({ url: `/pages/organization-detail/organization-detail?id=${event.currentTarget.dataset.id}` });
  },
  openEvent(event) {
    wx.navigateTo({ url: `/pages/event-detail/event-detail?id=${event.currentTarget.dataset.id}` });
  }
});
