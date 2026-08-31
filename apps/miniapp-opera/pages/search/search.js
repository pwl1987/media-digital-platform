// 搜索：统一检索剧目/演员/剧团/活动/影像/资讯（走共享 client，不直连 mock）
const api = require('../../utils/api');

const ROUTES = {
  Work: 'work-detail',
  Artist: 'artist-detail',
  Organization: 'organization-detail',
  Event: 'event-detail',
  Video: 'video-detail',
  News: 'news-detail'
};

const LABELS = { Work: '剧目', Artist: '演员', Organization: '剧团', Event: '活动', Video: '影像', News: '资讯' };

function decorate(list, type) {
  return (list || []).map((x) => ({
    id: x.id,
    type,
    label: LABELS[type],
    title: x.title,
    summary: x.summary || x.desc || (x.organization && x.organization.title) || x.place || ''
  }));
}

Page({
  data: {
    loading: true,
    searched: false,
    q: '',
    results: []
  },

  onLoad() {
    // 一次性预取全部检索源，本地过滤（数据量小，体验最优）
    Promise.all([
      api.getWorks(), api.getArtists(), api.getOrganizations(),
      api.getEvents(), api.getVideos(), api.getNews({ page: 1, pageSize: 50 })
    ])
      .then(([works, artists, orgs, events, videos, news]) => {
        this.source = {
          Work: (works.data && works.data.items) || [],
          Artist: (artists.data && artists.data.items) || [],
          Organization: (orgs.data && orgs.data.items) || [],
          Event: (events.data && events.data.items) || [],
          Video: (videos.data && videos.data.items) || [],
          News: (news.data && news.data.items) || []
        };
        this.setData({ loading: false });
      })
      .catch(() => this.setData({ loading: false }));
  },

  onInput(e) { this.setData({ q: e.detail.value, searched: false, results: [] }); },

  doSearch() {
    const q = (this.data.q || '').trim().toLowerCase();
    if (!this.source) return;
    if (!q) {
      this.setData({ searched: true, results: [] });
      return;
    }
    const hits = [];
    Object.keys(ROUTES).forEach((type) => {
      decorate(this.source[type], type)
        .filter((x) => `${x.title} ${x.summary}`.toLowerCase().includes(q))
        .forEach((x) => hits.push(x));
    });
    // 剧目/影像/资讯优先，档案类在后
    const ORDER = { Work: 0, Video: 1, News: 2, Event: 3, Artist: 4, Organization: 5 };
    hits.sort((a, b) => ORDER[a.type] - ORDER[b.type]);
    this.setData({ searched: true, results: hits.slice(0, 20) });
  },

  openResult(e) {
    const { type, id } = e.currentTarget.dataset;
    if (!type || !id) return;
    const page = ROUTES[type];
    if (page) wx.navigateTo({ url: `/pages/${page}/${page}?id=${id}` });
  },

  clear() {
    this.setData({ q: '', searched: false, results: [] });
  }
});