'use strict';

console.log(process.env.ALI_SDK_OSS_ID);
module.exports = {
  accessKeyId: process.env.ALI_SDK_OSS_ID,
  accessKeySecret: process.env.ALI_SDK_OSS_SECRET,
  region: process.env.ALI_SDK_OSS_REGION,
  bucket: 'egg-oss-test-bucket',
  secure: true,
};
