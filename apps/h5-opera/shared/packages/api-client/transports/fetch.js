// fetch transport：APP / 跨端通用的 fetch 实现（与 http.js 同语义；保留独立入口便于以后差异化）
// H5 与 APP 都直接走标准 fetch；二者可共用 http.js；本文件作为别名与未来演进位。
module.exports = require('./http.js');