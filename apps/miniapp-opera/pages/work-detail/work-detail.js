// 剧目详情：文化档案（不是商品页）——海报/简介/主创/演出记录/影像/相关新闻
// 禁止出现：购买、收藏、点赞、打赏、会员（OPERA_UI_VISUAL_BASELINE_V0.1 §9）
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    work: null,
    videos: [],
    performances: [],
    relatedNews: []
  },

  onLoad(options) {
    if (!options.id) {
      this.setData({ loading: false, error: true });
      return;
    }
    this.id = options.id;
    this.load();
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.load();
  },

  load() {
    Promise.all([
      api.getWork(this.id),
      api.getVideos(),
      api.getPerformances({ workId: this.id }),
      api.getNews({ page: 1, pageSize: 20 })
    ])
      .then(([workRes, videosRes, perfRes, newsRes]) => {
        if (workRes.error || !workRes.data) throw new Error('not found');
        const work = {
          ...workRes.data,
          artists: (workRes.data.artists || []).map((a) => ({ ...a, glyph: String(a.title).slice(0, 1) }))
        };
        const videos = (videosRes.data && videosRes.data.items) || [];
        // 剧目关联影像：优先 work.media 声明，其次按标题匹配
        const mediaIds = (work.media || []).map((m) => m.id);
        const workVideos = mediaIds.length
          ? mediaIds.map((id) => videos.find((v) => v.id === id)).filter(Boolean)
          : videos.filter((v) => v.title.includes(work.title)).slice(0, 2);
        const allNews = (newsRes.data && newsRes.data.items) || [];
        this.setData({
          loading: false,
          work,
          videos: workVideos,
          performances: (perfRes.data && perfRes.data.items) || [],
          relatedNews: allNews.filter((n) => (n.relatedWorkIds || []).includes(work.id)).slice(0, 3)
        });
      })
      .catch(() => this.setData({ loading: false, error: true }));
  },

  openVideo(e) { wx.navigateTo({ url: `/pages/video-detail/video-detail?id=${e.currentTarget.dataset.id}` }); },
  openArtist(e) { wx.navigateTo({ url: `/pages/artist-detail/artist-detail?id=${e.currentTarget.dataset.id}` }); },
  openOrganization() {
    const org = this.data.work && this.data.work.organization;
    if (org) wx.navigateTo({ url: `/pages/organization-detail/organization-detail?id=${org.id}` });
  },
  openEvent(e) { wx.navigateTo({ url: `/pages/event-detail/event-detail?id=${e.currentTarget.dataset.id}` }); },
  openNews(e) { wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${e.currentTarget.dataset.id}` }); },

  onShareAppMessage() {
    const work = this.data.work || {};
    return { title: `《${work.title || '沂蒙小戏小剧'}》· 官方剧目档案`, path: `/pages/work-detail/work-detail?id=${work.id || this.id || ''}` };
  }
});
