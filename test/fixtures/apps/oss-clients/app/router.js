'use strict';

const fs = require('fs');

module.exports = function(app) {
  app.get('/uploadtest', async ctx => {
    const name = 'oss-test-upload-' + process.version + '-' + Date.now();
    ctx.body = await ctx.oss.get('oss2').put(name, fs.createReadStream(__filename));
  });
};
