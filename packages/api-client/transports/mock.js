const opera = require('../../mock-data/opera');

function ok(data) {
  return Promise.resolve({ data, meta: { request_id: `mock-${Date.now()}` }, error: null });
}

function findById(items, id) {
  return items.find((item) => item.id === id) || null;
}

function createMockTransport() {
  return {
    request(path, options = {}) {
      const method = options.method || 'GET';
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
