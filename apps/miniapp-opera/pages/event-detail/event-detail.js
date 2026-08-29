const { events, performances } = require('../../utils/mock');

Page({
  data: { event: null, eventPerformances: [] },
  onLoad(options) {
    const event = events.find((item) => item.id === options.id) || events[0];
    const eventPerformances = performances.filter((item) => item.eventId === event.id);
    this.setData({ event, eventPerformances });
  }
});
