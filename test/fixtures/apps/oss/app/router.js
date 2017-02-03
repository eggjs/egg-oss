'use strict';

const path = require('path');
const fs = require('fs');
const is = require('is-type-of');

module.exports = function(app) {

  app.get('/', function* () {
    this.body = {
      app: is.object(this.app.oss),
      ctx: is.object(this.oss),
      putBucket: is.generatorFunction(this.oss.putBucket),
    };
  });

  app.get('/uploadtest', function* () {
    const name = 'oss-test-upload-' + process.version + '-' + Date.now();
    this.body = yield this.oss.put(name, fs.createReadStream(__filename));
  });
  app.get('/upload', function* () {
    this.set('x-csrf', this.csrf);
    yield this.render('upload.html');
  });

  app.post('/upload', function* () {
    const stream = yield this.getFileStream();
    const name = 'multipart-test/' + process.version + '-' + Date.now() + '-' + path.basename(stream.filename);
    // 文件处理，上传到云存储等等
    const result = yield this.oss.put(name, stream);
    this.body = {
      name: result.name,
      url: result.url,
      status: result.res.status,
      fields: stream.fields,
    };
  });
};
