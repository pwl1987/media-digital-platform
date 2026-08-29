const { news, works, events, videos } = require('./mock');

function ok(data) {
  return Promise.resolve({ data, meta: { request_id: `mock-${Date.now()}` }, error: null });
}

const api = {
  getNews({ category } = {}) {
    const items = category && category !== '最新发布' ? news.filter((item) => item.category === category) : news;
    return ok({ items, page: 1, pageSize: items.length, total: items.length, hasMore: false });
  },
  getNewsDetail(id) {
    return ok(news.find((item) => item.id === id) || null);
  },
  getWorks() {
    return ok({ items: works, page: 1, pageSize: works.length, total: works.length, hasMore: false });
  },
  getEvents() {
    return ok({ items: events, page: 1, pageSize: events.length, total: events.length, hasMore: false });
  },
  getVideos() {
    return ok({ items: videos, page: 1, pageSize: videos.length, total: videos.length, hasMore: false });
  }
};

module.exports = api;
