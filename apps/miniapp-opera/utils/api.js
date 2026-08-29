const { news, works, artists, organizations, events, performances, videos } = require('./mock');

function ok(data) {
  return Promise.resolve({ data, meta: { request_id: `mock-${Date.now()}` }, error: null });
}

function paginate(items, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, pageSize, total: items.length, hasMore: start + pageSize < items.length };
}

const api = {
  getNews({ category, page = 1, pageSize = 20 } = {}) {
    const items = category && category !== '最新发布' ? news.filter((item) => item.category === category) : news;
    return ok(paginate(items, page, pageSize));
  },
  getNewsDetail(id) {
    return ok(news.find((item) => item.id === id) || null);
  },
  getWorks({ tag } = {}) {
    const items = tag ? works.filter((item) => item.tag === tag) : works;
    return ok(paginate(items));
  },
  getWork(id) {
    return ok(works.find((item) => item.id === id) || null);
  },
  getArtists() {
    return ok(paginate(artists));
  },
  getArtist(id) {
    return ok(artists.find((item) => item.id === id) || null);
  },
  getOrganizations() {
    return ok(paginate(organizations));
  },
  getOrganization(id) {
    return ok(organizations.find((item) => item.id === id) || null);
  },
  getEvents({ lifecycleStatus } = {}) {
    const items = lifecycleStatus ? events.filter((item) => item.lifecycleStatus === lifecycleStatus) : events;
    return ok(paginate(items));
  },
  getEvent(id) {
    return ok(events.find((item) => item.id === id) || null);
  },
  getPerformances({ workId, eventId } = {}) {
    let items = performances;
    if (workId) items = items.filter((item) => item.workId === workId);
    if (eventId) items = items.filter((item) => item.eventId === eventId);
    return ok(paginate(items));
  },
  getVideos({ category } = {}) {
    const items = category ? videos.filter((item) => item.category === category) : videos;
    return ok(paginate(items));
  },
  getVideo(id) {
    return ok(videos.find((item) => item.id === id) || null);
  }
};

module.exports = api;
