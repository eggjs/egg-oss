'use strict';

const config = Object.assign({}, require('../../../../config'));

exports.keys = '123';
exports.oss = {
  client: {
    accessKeyId: config.accessKeyId,
    region: config.region,
    bucket: config.bucket,
  },
};
