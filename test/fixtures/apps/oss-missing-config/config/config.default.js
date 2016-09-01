'use strict';

let env = process.env;

exports.oss = {
  accessKeyId: env.ALI_SDK_OSS_ID,
  endpoint: env.ALI_SDK_OSS_ENDPOINT,
  bucket: 'js-sdk-bucket-sts',
};