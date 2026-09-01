// PC Web 端 ESM 入口（与 H5 runtime/client.js 同源镜像）
// - 零构建零依赖，<script type="module"> 直接消费
// - 数据：共享 mock-data 种子（seed.js 由 scripts/sync-h5-seed.mjs 双端输出）
// - 接真实后端：整体替换本文件实现为 fetch 调用（baseURL 在替换时显式注入并做白名单校验）
import { decorateNews, decorateVideo } from './decorator.js';
import * as seed from './seed.js';

const SEED_OPERA = {
  news: seed.news || [],
  works: seed.works || [],
  artists: seed.artists || [],
  organizations: seed.organizations || [],
  events: seed.events || [],
  performances: seed.performances || [],
  videos: seed.videos || [],
  lives: seed.lives || []
};

// 当前阶段为纯本地 mock（不发起任何网络请求）
function createClient() {
  return {
    async getNews(query) { return mockList(SEED_OPERA.news, query); },
    async getNewsDetail(id) { return mockDetail(SEED_OPERA.news, id); },
    async getWorks(query) { return mockList(SEED_OPERA.works, query); },
    async getWork(id) { return mockDetail(SEED_OPERA.works, id); },
    async getArtists(query) { return mockList(SEED_OPERA.artists, query); },
    async getArtist(id) { return mockDetail(SEED_OPERA.artists, id); },
    async getOrganizations(query) { return mockList(SEED_OPERA.organizations, query); },
    async getOrganization(id) { return mockDetail(SEED_OPERA.organizations, id); },
    async getEvents(query) { return mockList(SEED_OPERA.events, query); },
    async getEvent(id) { return mockDetail(SEED_OPERA.events, id); },
    async getPerformances(query) { return mockList(SEED_OPERA.performances, query); },
    async getVideos(query) { return mockList(SEED_OPERA.videos, query); },
    async getVideo(id) { return mockDetail(SEED_OPERA.videos, id); },
    async getLives(query) { return mockList(SEED_OPERA.lives || [], query); },
    async getLive(id) { return mockDetail(SEED_OPERA.lives || [], id); }
  };
}

function mockList(items, query = {}) {
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || items.length || 50);
  return Promise.resolve(ok({
    items,
    page,
    pageSize,
    total: items.length
  }));
}

function mockDetail(items, id) {
  const item = items.find((x) => x.id === id) || null;
  return Promise.resolve(ok(item));
}

function ok(data) {
  return { data, meta: { transport: 'mock-web' }, error: null };
}

// ---- Facade（与小程序端同源：装饰字段） ----
export function createExperienceClient() {
  const client = createClient();
  return {
    sourceLevelLabels: { official: '官方发布', organizer: '官方发布', media: '媒体报道', historical: '历史资料', user: '用户内容' },

    async getNews({ category, page = 1, pageSize = 20 } = {}) {
      const query = category && category !== '最新发布' ? { category, page, pageSize } : { page, pageSize };
      const res = await client.getNews(query);
      if (!res.data) return res;
      return { ...res, data: { ...res.data, items: (res.data.items || []).map(decorateNews) } };
    },
    async getNewsDetail(id) {
      const res = await client.getNewsDetail(id);
      if (!res.data) return res;
      return { ...res, data: decorateNews(res.data) };
    },
    getWorks: (q) => client.getWorks(q),
    getWork: (id) => client.getWork(id),
    getArtists: (q) => client.getArtists(q),
    getArtist: (id) => client.getArtist(id),
    getOrganizations: (q) => client.getOrganizations(q),
    getOrganization: (id) => client.getOrganization(id),
    getEvents: (q) => client.getEvents(q),
    getEvent: (id) => client.getEvent(id),
    getPerformances: (q) => client.getPerformances(q),
    async getVideos(q) {
      const res = await client.getVideos(q);
      if (!res.data) return res;
      return { ...res, data: { ...res.data, items: (res.data.items || []).map(decorateVideo) } };
    },
    async getVideo(id) {
      const res = await client.getVideo(id);
      if (!res.data) return res;
      return { ...res, data: decorateVideo(res.data) };
    },
    getLives: (q) => client.getLives(q),
    getLive: (id) => client.getLive(id)
  };
}