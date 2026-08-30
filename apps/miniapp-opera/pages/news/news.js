// 新闻列表：文化新闻门户（头条大图 + 分类 + 列表，非普通列表）
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    active: '全部',
    headline: null,
    items: []
  },
  filters: ['全部', '展演资讯', '剧目动态', '媒体报道'],

  onLoad() {
    this.fetch();
  },

  fetch() {
    this.setData({ loading: true });
    api.getNews({ page: 1, pageSize: 20 })
      .then((res) => {
        if (res.error) throw new Error('news failed');
        const all = (res.data && res.data.items) || [];
        // "全部/最新发布"运营位语义：不过滤分类
        const items = this.data.active === '全部' || this.data.active === '最新发布'
          ? all
          : all.filter((n) => n.category === this.data.active);
        const pool = items.length ? items : all;
        const headline = pool.find((n) => n.featured) || pool[0] || null;
        this.setData({
          loading: false,
          headline,
          items: pool.filter((n) => n.id !== (headline && headline.id))
        });
      })
      .catch(() => this.setData({ loading: false, error: true, items: [], headline: null }));
  },

  // 供首页专题跳转调用（跨页筛选联动）
  applyFilter(active) {
    this.setData({ active });
    this.fetch();
  },

  selectFilter(e) {
    this.applyFilter(e.currentTarget.dataset.filter);
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.fetch();
  },

  openNews(e) {
    wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${e.currentTarget.dataset.id}` });
  },

  onPullDownRefresh() {
    this.fetch();
    wx.stopPullDownRefresh();
  }
});
