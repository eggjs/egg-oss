'use strict';

const config = Object.assign({}, require('../../../../config'));

exports.oss = {
  clients: {
    oss1: {
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
    },
    oss2: {
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
    },
  },

  default: {
    region: config.region,
    bucket: config.bucket,
  },
};
