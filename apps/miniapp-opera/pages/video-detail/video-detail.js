// 视频详情：媒体组件（有 playUrl 走 <video>，无源走结构化占位）+ 相关剧目/新闻（P0 传播链）
// MediaAsset 字段链路：url(播放地址) / coverUrl(封面) / durationSeconds / sourceName / resolution
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    video: null,
    relatedWork: null,
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
    Promise.all([api.getVideo(this.id), api.getWorks(), api.getNews({ page: 1, pageSize: 20 })])
      .then(([detailRes, worksRes, newsRes]) => {
        if (detailRes.error || !detailRes.data) throw new Error('not found');
        const video = detailRes.data;
        const works = (worksRes.data && worksRes.data.items) || [];
        const allNews = (newsRes.data && newsRes.data.items) || [];
        // 反查引用本视频的剧目与新闻（同一事实源，跨实体传播链）
        const relatedWork = works.find((w) => (w.media || []).some((m) => m.id === video.id)) || null;
        const relatedNews = allNews.filter((n) => (n.relatedVideoIds || []).includes(video.id)).slice(0, 3);
        this.setData({ loading: false, video, relatedWork, relatedNews });
      })
      .catch(() => this.setData({ loading: false, error: true }));
  },

  onPlayError() {
    wx.showToast({ title: '视频播放失败，请稍后重试', icon: 'none' });
  },

  openWork() {
    if (this.data.relatedWork) wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${this.data.relatedWork.id}` });
  },
  openNews(e) { wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${e.currentTarget.dataset.id}` }); },

  onShareAppMessage() {
    const video = this.data.video || {};
    return { title: video.title || '小戏小剧影像', path: `/pages/video-detail/video-detail?id=${video.id || this.id || ''}` };
  }
});
