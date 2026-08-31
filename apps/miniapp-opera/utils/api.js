// 小戏小剧官方平台 · API facade（页面唯一数据入口）
// 走共享 api-client（Mock 只替代 transport 层）；接口签名与旧 facade 保持兼容。
const { createExperienceClient } = require('../shared/packages/api-client/create-client.js');

const client = createExperienceClient();

// 官方徽章映射（OPERA_UI_VISUAL_BASELINE_V0.1 §5.1）
const SOURCE_LEVEL_LABELS = { official: '官方发布', organizer: '官方发布', media: '媒体报道', historical: '历史资料', user: '用户内容' };

// 时长角标 mm:ss（MediaCard 必备字段，视觉基线 §6.4）
function formatDuration(seconds) {
  const s = Number(seconds || 0);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

function decorateNews(item) {
  return { ...item, sourceLevelLabel: SOURCE_LEVEL_LABELS[item.sourceLevel] || '官方发布' };
}

function decorateVideo(item) {
  return { ...item, durationLabel: formatDuration(item.durationSeconds) };
}

const api = {
  formatDuration,
  sourceLevelLabels: SOURCE_LEVEL_LABELS,

  getNews({ category, page = 1, pageSize = 20 } = {}) {
    // "最新发布"为运营位语义：不过滤分类
    const query = category && category !== '最新发布' ? { category, page, pageSize } : { page, pageSize };
    return client.getNews(query).then((res) => ({
      ...res,
      data: res.data ? { ...res.data, items: (res.data.items || []).map(decorateNews) } : res.data
    }));
  },
  getNewsDetail: (id) => client.getNewsDetail(id).then((res) => ({
    ...res,
    data: res.data ? decorateNews(res.data) : res.data
  })),
  getWorks: ({ tag } = {}) => client.getWorks(tag ? { tag, pageSize: 50 } : { pageSize: 50 }),
  getWork: (id) => client.getWork(id),
  getArtists: () => client.getArtists({ pageSize: 50 }),
  getArtist: (id) => client.getArtist(id),
  getOrganizations: () => client.getOrganizations({ pageSize: 50 }),
  getOrganization: (id) => client.getOrganization(id),
  getEvents: ({ lifecycleStatus } = {}) => client.getEvents(lifecycleStatus ? { lifecycleStatus, pageSize: 50 } : { pageSize: 50 }),
  getEvent: (id) => client.getEvent(id),
  getPerformances: ({ workId, eventId } = {}) => client.getPerformances({ workId, eventId, pageSize: 50 }),
  getVideos: ({ category } = {}) => client.getVideos(category ? { category, pageSize: 50 } : { pageSize: 50 }).then((res) => ({
    ...res,
    data: res.data ? { ...res.data, items: (res.data.items || []).map(decorateVideo) } : res.data
  })),
  getVideo: (id) => client.getVideo(id).then((res) => ({
    ...res,
    data: res.data ? decorateVideo(res.data) : res.data
  }))
};

module.exports = api;
