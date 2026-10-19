// 沂蒙精神门户 · 数据 facade（页面唯一数据入口，AGENTS.md 项目原则 3）
// 静态演示模式下加载同源目录快照；配置 apiBase 后走统一 API 前缀。
// 页面（src/main.js）禁止直接 fetch —— 全部网络访问收敛于此。

const config = window.YIMENG_DEMO_CONFIG || {};

export const API_BASE = String(config.apiBase || '').replace(/\/$/, '');
export const SNAPSHOT_URL = './data/archives-snapshot.json';

export async function api(path, options = {}) {
  if (!API_BASE) throw new Error('API_NOT_CONFIGURED');
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) throw new Error(`HTTP_${response.status}`);
  const payload = await response.json();
  if (payload && payload.error) throw new Error(payload.error.message || payload.error.code || 'API_ERROR');
  return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload;
}

export async function loadArchiveSnapshot() {
  // 目录级快照（本地生成、已 gitignore，不随仓库分发）；加载失败按 fail-closed 处理
  const response = await fetch(SNAPSHOT_URL);
  if (!response.ok) throw new Error(`SNAPSHOT_HTTP_${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data?.items) || !data?.meta) throw new Error('SNAPSHOT_FORMAT');
  return data;
}
