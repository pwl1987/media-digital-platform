const { knowledgeItems } = require('../../utils/mock');

Page({
  data: { items: knowledgeItems },
  goSearch() { wx.showToast({ title: '搜索页即将接入', icon: 'none' }); },
  openItem(e) { wx.navigateTo({ url: e.currentTarget.dataset.path }); }
});
