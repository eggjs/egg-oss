'use strict';

const fs = require('fs');

module.exports = function(app) {
  app.get('/uploadtest', function*() {
    const name = 'chair-oss-test-upload-' + process.version + '-' + Date.now();
    this.body = yield this.oss.get('oss2').put(name, fs.createReadStream(__filename));
  });
};
