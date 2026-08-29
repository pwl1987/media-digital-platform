const { featured } = require('../../utils/mock');

Page({
  data: { featured },
  goAI() { wx.switchTab({ url: '/pages/ai/ai' }); },
  goKnowledge() { wx.switchTab({ url: '/pages/knowledge/knowledge' }); },
  goMuseum() { wx.switchTab({ url: '/pages/museum/museum' }); },
  goSearch() { wx.navigateTo({ url: '/pages/search/search' }); },
  openFeatured(e) {
    const { type, id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?type=${type}&id=${id}` });
  }
});
