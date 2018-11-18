'use strict';

exports.keys = '123';
exports.oss = {
  clients: {
    client1: Object.assign({ sts: true }, require('../../../../sts_config')),
    client2: Object.assign({}, require('../../../../config')),
  },
};
