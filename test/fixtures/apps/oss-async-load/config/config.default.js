'use strict';

const assert = require('assert');

exports.keys = '123';
exports.oss = {
  default: {
    async loadConfig(config, app) {
      assert(app && app.name === 'oss-async-load');
      return Object.assign({}, require('../../../../config'), config);
    },
  },
  client: {},
};
