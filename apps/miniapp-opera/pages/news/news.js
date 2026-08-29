const { news } = require('../../utils/mock');

Page({
  data: { news: [], active: '全部' },
  filters: ['全部', '最新发布', '展演资讯', '剧目动态', '媒体报道'],
  onLoad() { this.applyFilter('全部'); },
  applyFilter(active) {
    const items = active === '全部' || active === '最新发布' ? news : news.filter((item) => item.category === active);
    this.setData({ active, news: items });
  },
  selectFilter(e) { this.applyFilter(e.currentTarget.dataset.filter); },
  openNews(e) { wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${e.currentTarget.dataset.id}` }); },
  onPullDownRefresh() { this.applyFilter(this.data.active); wx.stopPullDownRefresh(); }
});
