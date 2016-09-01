'use strict';

let env = process.env;

exports.oss = {
  clients: {
    oss1: {
      accessKeyId: env.ALI_SDK_OSS_ID,
      accessKeySecret: env.ALI_SDK_OSS_SECRET,
    },
    oss2: {
      accessKeyId: env.ALI_SDK_OSS_ID,
      accessKeySecret: env.ALI_SDK_OSS_SECRET,
    },
  },

  default: {
    endpoint: env.ALI_SDK_OSS_ENDPOINT,
    bucket: 'js-sdk-bucket-sts',
  },
};
