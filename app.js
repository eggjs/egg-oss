const oss = require('./lib/oss');

module.exports = class {
  constructor(app) {
    this.app = app;
  }

  configDidLoad() {
    oss(this.app);
  }
};
