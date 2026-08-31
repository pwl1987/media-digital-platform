// 我的收藏：聚合读取本地 opera_favorites 的 news / work / video
const api = require('../../utils/api');

const TABS = [
  { key: 'work', label: '剧目' },
  { key: 'video', label: '影像' },
  { key: 'news', label: '资讯' }
];

const ROUTES = { work: 'work-detail', video: 'video-detail', news: 'news-detail' };

Page({
  data: {
    loading: true,
    activeTab: 'work',
    tabs: TABS,
    counts: { work: 0, video: 0, news: 0 },
    items: []
  },

  onShow() {
    this.setData({ loading: true });
    this.refresh();
  },

  refresh() {
    const fav = wx.getStorageSync('opera_favorites') || {};
    const ids = {
      work: Object.keys(fav.work || {}),
      video: Object.keys(fav.video || {}),
      news: Object.keys(fav.news || {})
    };
    const lists = { work: [], video: [], news: [] };
    Promise.all([
      ids.work.length ? api.getWorks().then((r) => r.data && r.data.items) : Promise.resolve([]),
      ids.video.length ? api.getVideos().then((r) => r.data && r.data.items) : Promise.resolve([]),
      ids.news.length ? api.getNews({ page: 1, pageSize: 50 }).then((r) => r.data && r.data.items) : Promise.resolve([])
    ])
      .then(([works, videos, news]) => {
        lists.work = works.filter((x) => ids.work.includes(x.id)).map((x) => ({ id: x.id, type: 'work', title: x.title, summary: x.tag, meta: (x.organization && x.organization.title) || '' }));
        lists.video = videos.filter((x) => ids.video.includes(x.id)).map((x) => ({ id: x.id, type: 'video', title: x.title, summary: x.category, meta: `${x.sourceName} · ${x.resolution}` }));
        lists.news = news.filter((x) => ids.news.includes(x.id)).map((x) => ({ id: x.id, type: 'news', title: x.title, summary: (x.summary || '').slice(0, 50), meta: x.sourceLevelLabel || '官方资讯' }));
        this.setData({
          loading: false,
          counts: { work: lists.work.length, video: lists.video.length, news: lists.news.length },
          items: lists[this.data.activeTab] || []
        });
      })
      .catch(() => this.setData({ loading: false }));
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    const fav = wx.getStorageSync('opera_favorites') || {};
    this.setData({ activeTab: tab });
    this.refresh();
  },

  open(e) {
    const { type, id } = e.currentTarget.dataset;
    if (!type || !id) return;
    const page = ROUTES[type];
    if (page) wx.navigateTo({ url: `/pages/${page}/${page}?id=${id}` });
  },

  unfavorite(e) {
    e.stopPropagation && e.stopPropagation();
    const { type, id } = e.currentTarget.dataset;
    const fav = wx.getStorageSync('opera_favorites') || {};
    if (fav[type]) {
      delete fav[type][id];
      wx.setStorageSync('opera_favorites', fav);
      wx.vibrateShort && wx.vibrateShort({ type: 'light' });
      wx.showToast({ title: '已取消收藏', icon: 'none' });
      this.refresh();
    }
  }
});