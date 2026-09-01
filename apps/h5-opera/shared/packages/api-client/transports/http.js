// http transport：H5 / APP 用 fetch + 标准 REST 路由表
// 入参：baseURL（缺省 /api/v1 前缀；当前 mock 阶段返回端内数据）
// 出参：与 mock 兼容的统一包 { data, meta, error }
function ok(data) {
  return Promise.resolve({ data, meta: { transport: 'http' }, error: null });
}
function err(code, message) {
  return Promise.resolve({ data: null, meta: { transport: 'http' }, error: { code, message } });
}

async function request(path, { method = 'GET', query, body } = {}) {
  // 真实接入后这里走 fetch；当前 mock 阶段约定 baseURL 缺省时返回"未接入"错误
  const baseURL = this.baseURL || '';
  if (!baseURL) return err('NOT_CONFIGURED', `http transport 未配置 baseURL（path=${path}）`);
  const url = new URL(baseURL.replace(/\/$/, '') + path);
  if (query) Object.entries(query).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  try {
    const res = await fetch(url.toString(), {
      method,
      headers: { 'Accept': 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) return err(res.status, res.statusText);
    return await res.json();
  } catch (e) {
    return err('NETWORK', e && e.message);
  }
}

function createHttpTransport({ baseURL = '' } = {}) {
  const t = { baseURL, request };
  return t;
}

module.exports = { createHttpTransport, ok, err };