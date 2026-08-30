const endpoints = {
  feed: (id) => `/api/v1/feeds/${encodeURIComponent(id)}`,
  search: '/api/v1/search',
  content: (id) => `/api/v1/contents/${encodeURIComponent(id)}`,
  news: '/api/v1/news',
  newsDetail: (id) => `/api/v1/news/${encodeURIComponent(id)}`,
  operaNews: '/api/v1/opera/news',
  operaNewsDetail: (id) => `/api/v1/opera/news/${encodeURIComponent(id)}`,
  works: '/api/v1/opera/works',
  workDetail: (id) => `/api/v1/opera/works/${encodeURIComponent(id)}`,
  events: '/api/v1/opera/events',
  eventDetail: (id) => `/api/v1/opera/events/${encodeURIComponent(id)}`,
  videos: '/api/v1/opera/videos',
  videoDetail: (id) => `/api/v1/opera/videos/${encodeURIComponent(id)}`,
  live: '/api/v1/opera/live',
  liveDetail: (id) => `/api/v1/opera/live/${encodeURIComponent(id)}`,
  people: '/api/v1/yimeng/people',
  knowledge: '/api/v1/yimeng/knowledge',
  yimengOrigin: '/api/v1/yimeng/origin',
  yimengTimeline: '/api/v1/yimeng/timeline',
  yimengArchives: '/api/v1/yimeng/archives',
  yimengArchiveDetail: (id) => `/api/v1/yimeng/archives/${encodeURIComponent(id)}`,
  aiChat: '/api/v1/yimeng/ai/chat'
};

function createClient(transport) {
  const get = (path, query) => transport.request(path, { method: 'GET', query });
  const post = (path, body) => transport.request(path, { method: 'POST', body });
  return {
    endpoints,
    getFeed: (id) => get(endpoints.feed(id)),
    search: (q, extra) => get(endpoints.search, { q, ...(extra || {}) }),
    getContent: (id) => get(endpoints.content(id)),
    getNews: (query) => get(endpoints.news, query),
    getNewsDetail: (id) => get(endpoints.newsDetail(id)),
    getOperaNews: (query) => get(endpoints.operaNews, query),
    getOperaNewsDetail: (id) => get(endpoints.operaNewsDetail(id)),
    getWorks: (query) => get(endpoints.works, query),
    getWork: (id) => get(endpoints.workDetail(id)),
    getEvents: (query) => get(endpoints.events, query),
    getEvent: (id) => get(endpoints.eventDetail(id)),
    getVideos: (query) => get(endpoints.videos, query),
    getVideo: (id) => get(endpoints.videoDetail(id)),
    getLives: (query) => get(endpoints.live, query),
    getLive: (id) => get(endpoints.liveDetail(id)),
    getPeople: (query) => get(endpoints.people, query),
    getKnowledge: (query) => get(endpoints.knowledge, query),
    getOrigin: () => get(endpoints.yimengOrigin),
    getTimeline: () => get(endpoints.yimengTimeline),
    getArchives: (query) => get(endpoints.yimengArchives, query),
    getArchive: (id) => get(endpoints.yimengArchiveDetail(id)),
    chat: (message, sessionId, context) => post(endpoints.aiChat, {
      message,
      session_id: sessionId,
      context: context || undefined
    })
  };
}

module.exports = { endpoints, createClient };