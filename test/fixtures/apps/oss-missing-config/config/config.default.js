'use strict';

const config = Object.assign({}, require('../../../../config'));

exports.oss = {
  client: {
    accessKeyId: config.accessKeyId,
    region: config.region,
    bucket: config.bucket,
  },
};
