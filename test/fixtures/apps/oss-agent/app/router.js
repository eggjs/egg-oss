'use strict';

module.exports = app => {
  app.get('/agent', function*() {
    yield wrapPromise(app);
    this.body = 'OK';
  });
};

function wrapPromise(app) {
  const d = Promise.defer();

  app.messenger.broadcast('oss start');
  app.messenger.on('oss done', () => {
    d.resolve();
  });

  return d.promise;
}
