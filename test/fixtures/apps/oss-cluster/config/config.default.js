'use strict';

exports.oss = {
  client: {
    cluster: [
      Object.assign({}, require('../../../../config')),
      Object.assign({}, require('../../../../config')),
    ],
  },
};
