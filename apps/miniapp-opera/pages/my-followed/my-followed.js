// 我的关注：聚合读取本地 opera_followed 的 artist / organization
const api = require('../../utils/api');

const TABS = [
  { key: 'artist', label: '演员' },
  { key: 'organization', label: '剧团' }
];

const ROUTES = { artist: 'artist-detail', organization: 'organization-detail' };

Page({
  data: {
    loading: true,
    activeTab: 'artist',
    tabs: TABS,
    counts: { artist: 0, organization: 0 },
    items: []
  },

  onShow() {
    this.setData({ loading: true });
    this.refresh();
  },

  refresh() {
    const followed = wx.getStorageSync('opera_followed') || {};
    const ids = {
      artist: Object.keys(followed.artist || {}),
      organization: Object.keys(followed.organization || {})
    };
    const lists = { artist: [], organization: [] };
    Promise.all([
      ids.artist.length ? api.getArtists().then((r) => r.data && r.data.items) : Promise.resolve([]),
      ids.organization.length ? api.getOrganizations().then((r) => r.data && r.data.items) : Promise.resolve([])
    ])
      .then(([artists, orgs]) => {
        lists.artist = artists.filter((x) => ids.artist.includes(x.id)).map((x) => ({ id: x.id, type: 'artist', title: x.title, summary: x.role || '演员', meta: x.organization || '' }));
        lists.organization = orgs.filter((x) => ids.organization.includes(x.id)).map((x) => ({ id: x.id, type: 'organization', title: x.title, summary: '官方剧团', meta: '' }));
        this.setData({
          loading: false,
          counts: { artist: lists.artist.length, organization: lists.organization.length },
          items: lists[this.data.activeTab] || []
        });
      })
      .catch(() => this.setData({ loading: false }));
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
    this.refresh();
  },

  open(e) {
    const { type, id } = e.currentTarget.dataset;
    const page = ROUTES[type];
    if (page) wx.navigateTo({ url: `/pages/${page}/${page}?id=${id}` });
  },

  unfollow(e) {
    const { type, id } = e.currentTarget.dataset;
    const followed = wx.getStorageSync('opera_followed') || {};
    if (followed[type]) {
      delete followed[type][id];
      wx.setStorageSync('opera_followed', followed);
      wx.vibrateShort && wx.vibrateShort({ type: 'light' });
      wx.showToast({ title: '已取消关注', icon: 'none' });
      this.refresh();
    }
  }
});