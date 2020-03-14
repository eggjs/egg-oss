'use strict';

module.exports = {
  async createOss(...args) {
    return await this.oss.createInstanceAsync.call(this.oss, ...args);
  },
};
