// H5 / APP 端 ESM 入口（同源方案零依赖）
// - 浏览器 <script type="module"> 直接消费
// - 不打包、不 build
// - 数据源走 fetch（http transport），baseURL 由调用方注入；当前 mock 阶段用 importShim 注入静态数据
//
// 真正的"零依赖同源"复用：
// - 与小程序端 packages/api-client/facade.js + decorator.js 行为一致
// - 但 CJS 不能直接进浏览器 → 这里给 ESM 镜像；底层数据走共享 mock-data（同一份种子）
//
// 接入真实后端：把 createHttpClient({ baseURL }) 改成指向后端地址
// 接 mock：保持默认（走 importShim 注入的种子）

import { decorateNews, decorateVideo } from './decorator.js';
import * as seed from './seed.js';

// 同一份数据源（与小程序端 packages/mock-data/opera.js 同源）
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

// 当前阶段：直接读共享 mock-data 的同源种子（同步构造，页面无需 await client）
// 真实接入：把 request() 改为 fetch；调用方传 baseURL
function createClient({ baseURL = '' } = {}) {
  // mock 模式：所有请求直接走 seed
  // 真后端模式：走 fetch；缺省 baseURL 时给提示但不报错
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
  const filtered = items;
  return Promise.resolve(ok({
    items: filtered,
    page,
    pageSize,
    total: filtered.length
  }));
}

function mockDetail(items, id) {
  const item = items.find((x) => x.id === id) || null;
  return Promise.resolve(ok(item));
}

function ok(data) {
  return { data, meta: { transport: 'mock-h5' }, error: null };
}

// ---- Facade（与小程序端同源：装饰字段） ----
// 同步工厂：mock 数据即时可用；每个请求方法仍返回 Promise（页面 await 请求即可）
export function createExperienceClient(options) {
  const client = createClient(options);
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