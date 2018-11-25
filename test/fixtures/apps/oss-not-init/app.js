'use strict';

module.exports = app => {
  app.uploader = app.createOss(app.config.uploader);
};
