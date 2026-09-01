// facade 工厂：把 raw client 包装成"三端通用展示层"。
// - 不依赖端 API（wx.* / fetch / localStorage 都不要出现）
// - 装饰只做"显示字段加工"，不做业务逻辑
// - 端 UI 一律 require 这层，不再写 decorateNews/formatDuration
const { decorateNews, decorateVideo, decorateList } = require('./decorator.js');

function createFacade(client) {
  return {
    formatDuration: require('./decorator.js').formatDuration,
    sourceLevelLabels: require('./decorator.js').SOURCE_LEVEL_LABELS,

    getNews({ category, page = 1, pageSize = 20 } = {}) {
      const query = category && category !== '最新发布' ? { category, page, pageSize } : { page, pageSize };
      return client.getNews(query).then((res) => ({
        ...res,
        data: res.data ? decorateList(res.data, decorateNews) : res.data
      }));
    },

    getNewsDetail(id) {
      return client.getNewsDetail(id).then((res) => ({
        ...res,
        data: res.data ? decorateNews(res.data) : res.data
      }));
    },

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
      data: res.data ? decorateList(res.data, decorateVideo) : res.data
    })),

    getVideo: (id) => client.getVideo(id).then((res) => ({
      ...res,
      data: res.data ? decorateVideo(res.data) : res.data
    })),

    getLives: (query) => client.getLives(query),
    getLive: (id) => client.getLive(id)
  };
}

module.exports = { createFacade };