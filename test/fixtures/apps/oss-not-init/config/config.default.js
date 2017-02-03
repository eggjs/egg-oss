'use strict';

const env = process.env;

exports.uploader = {
  accessKeyId: env.ALI_SDK_OSS_ID,
  accessKeySecret: env.ALI_SDK_OSS_SECRET,
  endpoint: env.ALI_SDK_OSS_ENDPOINT,
  bucket: 'egg-oss-test-bucket-test99',
};

exports.oss = {
  init: false,
};
