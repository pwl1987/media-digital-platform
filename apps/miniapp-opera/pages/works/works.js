const { works } = require('../../utils/mock');

Page({
  data: { allWorks: works, works, activeTag: '全部' },
  filterTags: ['全部', '传统戏曲', '现代小戏', '红色题材', '地方戏', '精品剧目'],

  onLoad() {
    this.filterWorks('全部');
  },

  selectTag(event) {
    this.filterWorks(event.currentTarget.dataset.tag);
  },

  filterWorks(tag) {
    const filtered = tag === '全部'
      ? this.data.allWorks
      : this.data.allWorks.filter((item) => item.tag === tag || (tag === '精品剧目' && item.tag === '精品剧目'));
    this.setData({ activeTag: tag, works: filtered });
  },

  openWork(event) {
    wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${event.currentTarget.dataset.id}` });
  },

  onPullDownRefresh() {
    this.filterWorks(this.data.activeTag);
    wx.stopPullDownRefresh();
  }
});
