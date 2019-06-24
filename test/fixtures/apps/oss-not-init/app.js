'use strict';

module.exports = function(app) {
  app.beforeStart(async () => {
    app.uploader = await app.createOss(app.config.uploader);
  });
};
