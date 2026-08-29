const fallback = {
  title: '沂蒙文化内容',
  typeLabel: '内容',
  summary: '这里展示来自统一内容平台的结构化内容。真实接入后将由 Content API 提供。',
  body: '内容详情、人物资料、历史背景与多媒体资料将在后台接入后完整呈现。',
  relations: [
    { title: '相关故事', type: '故事' },
    { title: '相关影像', type: '视频' },
    { title: '相关资料', type: '文献' }
  ]
};

Page({
  data: { loading: true, content: fallback },
  onLoad(options) {
    const typeMap = { person: '人物', story: '故事', place: '地点', media: '影像', content: '专题' };
    const typeLabel = typeMap[options.type] || '内容';
    this.setData({
      loading: false,
      content: {
        ...fallback,
        typeLabel,
        title: options.id ? `${typeLabel}·${options.id}` : fallback.title
      }
    });
  },
  askAI() {
    wx.switchTab({ url: '/pages/ai/ai' });
  },
  onShareAppMessage() {
    return { title: this.data.content.title, path: '/pages/detail/detail' };
  }
});
