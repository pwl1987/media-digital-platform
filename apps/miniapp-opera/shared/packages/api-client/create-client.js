const { createClient } = require('./index.js');
const { createMockTransport } = require('./transports/mock.js');

function createExperienceClient(options = {}) {
  const transport = options.transport || createMockTransport();
  return createClient(transport);
}

module.exports = { createExperienceClient };
