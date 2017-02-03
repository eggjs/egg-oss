'use strict';

const co = require('co');
const fs = require('fs');

module.exports = agent => {
  agent.messenger.on('oss start', () => {
    co.call(agent, function* () {
      const name = 'chair-oss-test-upload-' + process.version + '-' + Date.now();
      yield this.oss.put(name, fs.createReadStream(__filename));
      this.messenger.broadcast('oss done');
    });
  });
};
