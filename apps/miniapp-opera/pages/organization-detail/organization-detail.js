const { organizations } = require('../../utils/mock');

Page({
  data: { organization: null },
  onLoad(options) {
    const organization = organizations.find((item) => item.id === options.id) || organizations[0];
    this.setData({ organization });
  }
});
