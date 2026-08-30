const { featured } = require('../../utils/mock');

Page({
  data: { featured },
  goAI() { wx.switchTab({ url: '/pages/ai/ai' }); },
  goArchive() { wx.switchTab({ url: '/pages/archive/archive' }); },
  goMemory() { wx.navigateTo({ url: '/pages/memory/memory' }); },
  goStories() { wx.navigateTo({ url: '/pages/stories/stories' }); },
  goMuseum() { wx.switchTab({ url: '/pages/museum/museum' }); },
  goSearch() { wx.navigateTo({ url: '/pages/search/search' }); },
  openFeatured(e) {
    const { type, id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?type=${type}&id=${id}` });
  }
});
