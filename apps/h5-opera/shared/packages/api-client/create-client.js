// 端无关 client 工厂：三端（miniapp/h5/app）共用一个入口
// - 默认 transport = mock（开发/评审阶段；仓库内唯一 transport 实现）
// - 接真实后端：调用方注入自定义 transport（实现 request(path, {method, query, body})），
//   实现时必须校验 baseURL 协议白名单（https）并做域名白名单，避免 SSRF
// - facade 与装饰层独立放在 decorator.js / facade.js，端 UI 一律 require facade
const { createClient } = require('./index.js');
const { createMockTransport } = require('./transports/mock.js');

function createExperienceClient(options = {}) {
  // 平台无关：transport 由调用方注入；mock transport 仍是端内可用的离线 fallback
  const transport = (options && options.transport) || createMockTransport();
  const client = createClient(transport);
  // facade 是端 UI 的真正入口；调用方也可单独 require facade.js
  const facade = require('./facade.js').createFacade(client);
  return facade;
}

module.exports = { createExperienceClient, createMockTransport };