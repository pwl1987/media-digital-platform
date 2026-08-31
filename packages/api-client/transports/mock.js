const opera = require('../../mock-data/opera');
const heritage = require('../../mock-data/heritage');

const ERA_ORDER = ['1910s', '1920s', '1930s', '1940s', '1950s', '1960s-70s', '1980s-90s', '2000s', '2010s', 'new-era'];

function ok(data) {
  return Promise.resolve({ data, meta: { request_id: `mock-${Date.now()}` }, error: null });
}

function findById(items, id) {
  return items.find((item) => item.id === id) || null;
}

function paginate(items, query = {}) {
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || query.page_size || 20);
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, pageSize, total: items.length, hasMore: start + pageSize < items.length };
}

function filterArchives(query = {}) {
  let items = heritage.archives;
  if (query.archiveType) items = items.filter((item) => item.archiveType === query.archiveType);
  if (query.era) items = items.filter((item) => item.era === query.era);
  if (query.grade) items = items.filter((item) => item.grade === query.grade);
  if (query.personId) items = items.filter((item) => (item.relatedPersonIds || []).includes(query.personId));
  if (query.q) {
    const q = String(query.q).trim().toLowerCase();
    items = items.filter((item) => `${item.title} ${item.summary || ''}`.toLowerCase().includes(q));
  }
  return items;
}

function createMockTransport() {
  return {
    request(path, options = {}) {
      const method = options.method || 'GET';
      // ---- Yimeng Heritage（API_CONTRACT_V0.2 §5）----
      if (method === 'GET' && path === '/api/v1/yimeng/origin') return ok({ items: heritage.origin });
      if (method === 'GET' && path === '/api/v1/yimeng/timeline') {
        const eras = [...new Set(heritage.timeline.map((e) => e.era))]
          .sort((a, b) => ERA_ORDER.indexOf(a) - ERA_ORDER.indexOf(b))
          .map((era) => ({ era, events: heritage.timeline.filter((e) => e.era === era) }));
        return ok({ eras, total: heritage.timeline.length });
      }
      if (method === 'GET' && path === '/api/v1/yimeng/archives') return ok(paginate(filterArchives(options.query), options.query));
      if (method === 'GET' && path.startsWith('/api/v1/yimeng/archives/')) return ok(findById(heritage.archives, path.split('/').pop()));
      if (method === 'GET' && path === '/api/v1/yimeng/people') return ok(paginate(heritage.people, options.query));
      if (method === 'GET' && path === '/api/v1/yimeng/stories') return ok(paginate(heritage.stories, options.query));
      if (method === 'POST' && path === '/api/v1/yimeng/ai/chat') return ok(heritage.aiChat(options.body && options.body.message));
      // ---- Shared / Opera ----
      if (method === 'GET' && path === '/api/v1/news') {
        const { category, page = 1, pageSize = 20 } = options.query || {};
        const items = category ? opera.news.filter((item) => item.category === category) : opera.news;
        const start = (Number(page) - 1) * Number(pageSize);
        return ok({ items: items.slice(start, start + Number(pageSize)), page: Number(page), pageSize: Number(pageSize), total: items.length, hasMore: start + Number(pageSize) < items.length });
      }
      if (method === 'GET' && path.startsWith('/api/v1/news/')) return ok(findById(opera.news, path.split('/').pop()));
      if (method === 'GET' && path === '/api/v1/opera/news') return ok({ items: opera.news, page: 1, pageSize: opera.news.length, total: opera.news.length, hasMore: false });
      if (method === 'GET' && path.startsWith('/api/v1/opera/news/')) return ok(findById(opera.news, path.split('/').pop()));
      if (method === 'GET' && path === '/api/v1/opera/works') return ok({ items: opera.works, page: 1, pageSize: opera.works.length, total: opera.works.length, hasMore: false });
      if (method === 'GET' && path.startsWith('/api/v1/opera/works/')) return ok(findById(opera.works, path.split('/').pop()));
      if (method === 'GET' && path === '/api/v1/opera/events') return ok({ items: opera.events, page: 1, pageSize: opera.events.length, total: opera.events.length, hasMore: false });
      if (method === 'GET' && path.startsWith('/api/v1/opera/events/')) return ok(findById(opera.events, path.split('/').pop()));
      if (method === 'GET' && path === '/api/v1/opera/videos') return ok({ items: opera.videos, page: 1, pageSize: opera.videos.length, total: opera.videos.length, hasMore: false });
      if (method === 'GET' && path.startsWith('/api/v1/opera/videos/')) return ok(findById(opera.videos, path.split('/').pop()));
      if (method === 'GET' && path === '/api/v1/search') {
        const q = String(options.query?.q || '').trim().toLowerCase();
        const items = q ? [...opera.news, ...opera.works, ...opera.events, ...opera.videos].filter((item) => `${item.title} ${item.summary || ''}`.toLowerCase().includes(q)) : [];
        return ok({ items, page: 1, pageSize: items.length, total: items.length, hasMore: false });
      }
      return Promise.resolve({ data: null, meta: { request_id: `mock-${Date.now()}` }, error: { code: 'MOCK_NOT_FOUND', message: `Unsupported mock endpoint: ${path}` } });
    }
  };
}

module.exports = { createMockTransport };
