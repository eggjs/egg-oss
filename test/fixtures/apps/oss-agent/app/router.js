'use strict';

module.exports = app => {
  app.get('/agent', async ctx => {
    await wrapPromise(app);
    ctx.body = 'OK';
  });
};

function wrapPromise(app) {
  return new Promise(resolve => {
    app.messenger.broadcast('oss start');
    app.messenger.on('oss done', () => {
      resolve();
    });
  });
}
