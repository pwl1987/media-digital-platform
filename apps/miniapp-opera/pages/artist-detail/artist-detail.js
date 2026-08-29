const { artists } = require('../../utils/mock');

Page({
  data: { artist: null },
  onLoad(options) {
    const artist = artists.find((item) => item.id === options.id) || artists[0];
    this.setData({ artist });
  }
});
