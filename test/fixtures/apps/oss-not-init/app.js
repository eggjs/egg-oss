'use strict';

module.exports = function(app) {
  app.uploader = app.createOss(app.config.uploader);
};
