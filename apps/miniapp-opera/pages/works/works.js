const { works } = require('../../utils/mock');

Page({
  data: { works: [], activeTag: '全部' },
  filterTags: ['全部', '传统戏曲', '现代小戏', '红色题材', '地方戏', '精品剧目'],

  onLoad() {
    this.setData({ works });
  },

  selectTag(event) {
    this.setData({ activeTag: event.currentTarget.dataset.tag });
  },

  openWork(event) {
    wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${event.currentTarget.dataset.id}` });
  }
});
