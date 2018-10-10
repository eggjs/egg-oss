'use strict';

const fs = require('fs');

module.exports = agent => {
  agent.messenger.on('oss start', () => {
    (async () => {
      const name = 'chair-oss-test-upload-' + process.version + '-' + Date.now();
      await agent.oss.put(name, fs.createReadStream(__filename));
      agent.messenger.broadcast('oss done');
    })();
  });
};
