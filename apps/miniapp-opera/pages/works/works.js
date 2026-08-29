const { works } = require('../../utils/mock');

Page({
  data: { works: [] },
  onLoad() {
    this.setData({ works });
  },
  openWork(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${id}` });
  }
});
