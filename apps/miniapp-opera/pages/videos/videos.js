// 影像馆：小戏小剧视频门户（不是普通视频列表）——五类分类 + 视频墙
const api = require('../../utils/api');

const CATEGORIES = ['全部', '演出实录', '精品片段', '幕后花絮', '专题片', '人物访谈'];

Page({
  data: {
    categories: CATEGORIES,
    active: '全部',
    loading: true,
    error: false,
    items: []
  },

  onLoad() {
    this.fetch();
  },

  fetch() {
    this.setData({ loading: true });
    api.getVideos()
      .then((res) => {
        if (res.error) throw new Error('videos failed');
        const all = (res.data && res.data.items) || [];
        this.setData({
          loading: false,
          items: this.data.active === '全部' ? all : all.filter((v) => v.category === this.data.active)
        });
      })
      .catch(() => this.setData({ loading: false, error: true, items: [] }));
  },

  selectCategory(e) {
    this.setData({ active: e.currentTarget.dataset.cat });
    this.fetch();
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.fetch();
  },

  openVideo(e) {
    wx.navigateTo({ url: `/pages/video-detail/video-detail?id=${e.currentTarget.dataset.id}` });
  },

  onPullDownRefresh() {
    this.fetch();
    wx.stopPullDownRefresh();
  }
});
