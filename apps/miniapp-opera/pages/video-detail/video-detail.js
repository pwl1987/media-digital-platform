// 视频详情：播放面（Gate E 状态齐备）+ 著录信息 + 相关影像
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    video: null,
    others: []
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
    Promise.all([api.getVideo(this.id), api.getVideos()])
      .then(([detailRes, listRes]) => {
        if (detailRes.error || !detailRes.data) throw new Error('not found');
        const video = detailRes.data;
        this.setData({
          loading: false,
          video,
          others: ((listRes.data && listRes.data.items) || []).filter((v) => v.id !== video.id).slice(0, 4)
        });
      })
      .catch(() => this.setData({ loading: false, error: true }));
  },

  openVideo(e) {
    wx.redirectTo({ url: `/pages/video-detail/video-detail?id=${e.currentTarget.dataset.id}` });
  },

  onShareAppMessage() {
    const video = this.data.video || {};
    return { title: video.title || '小戏小剧影像', path: `/pages/video-detail/video-detail?id=${video.id || this.id || ''}` };
  }
});
