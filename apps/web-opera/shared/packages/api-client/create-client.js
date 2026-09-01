// 端无关 client 工厂：三端（miniapp/h5/app）共用一个入口
// - 默认 transport = mock（开发/评审阶段）
// - H5/APP 端可通过 options.transport 注入 http / fetch transport
// - facade 与装饰层独立放在 decorator.js / facade.js，端 UI 一律 require facade
const { createClient } = require('./index.js');
const { createMockTransport } = require('./transports/mock.js');
const { createHttpTransport } = require('./transports/http.js');

function createExperienceClient(options = {}) {
  // 平台无关：transport 由调用方注入；mock transport 仍是端内可用的离线 fallback
  const transport = (options && options.transport) || createMockTransport();
  const client = createClient(transport);
  // facade 是端 UI 的真正入口；调用方也可单独 require facade.js
  const facade = require('./facade.js').createFacade(client);
  return facade;
}

module.exports = { createExperienceClient, createHttpTransport, createMockTransport };