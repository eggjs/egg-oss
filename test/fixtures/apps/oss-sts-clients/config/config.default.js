'use strict';

exports.keys = '123';
exports.oss = {
  clients: {
    client1: Object.assign({ sts: true }, require('../../../../sts_config')),
  },
};
