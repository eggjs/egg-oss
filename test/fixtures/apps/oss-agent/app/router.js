'use strict';

module.exports = app => {
  app.get('/agent', function* () {
    yield wrapPromise(app);
    this.body = 'OK';
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
