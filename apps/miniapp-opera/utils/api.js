// 小戏小剧官方平台 · API facade（页面唯一数据入口）
// 三端共享：H5 / APP / 小程序都从 packages/api-client/facade.js 拿同一份展示层；
// 端 UI 一律 require 此文件，禁止重复写装饰函数。
const { createExperienceClient } = require('../shared/packages/api-client/create-client.js');

module.exports = createExperienceClient();