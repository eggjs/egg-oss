'use strict';

exports.keys = '123';
exports.oss = {
  client: {
    cluster: [
      Object.assign({}, require('../../../../config')),
      Object.assign({}, require('../../../../config')),
    ],
  },
};
