const path = require('path');
const fs = require('fs');
const is = require('is-type-of');

module.exports = function(app) {
  app.get('/', async ctx => {
    ctx.body = {
      app: is.object(ctx.app.oss),
      ctx: is.object(ctx.app.uploader),
    };
  });

  app.get('/uploadtest', async ctx => {
    const name = 'chair-oss-test-upload-' + process.version + '-' + Date.now();
    ctx.body = await ctx.app.uploader.put(name, fs.createReadStream(__filename));
  });

  app.get('/upload', async ctx => {
    ctx.set('x-csrf', ctx.csrf);
    await ctx.render('upload.html');
  });

  app.post('/upload', async ctx => {
    const stream = await ctx.getFileStream();
    const name = 'chair-multipart-test/' + process.version + '-' + Date.now() + '-' + path.basename(stream.filename);
    // 文件处理，上传到云存储等等
    const result = await ctx.app.uploader.put(name, stream);
    ctx.body = {
      name: result.name,
      url: result.url,
      status: result.res.status,
      fields: stream.fields,
    };
  });
};
