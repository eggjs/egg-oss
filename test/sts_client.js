const { Client } = require('oss-client');

module.exports = function createSTSClient(accessKeyId, accessKeySecret, stsToken) {
  return new Client({
    accessKeyId,
    accessKeySecret,
    stsToken,
    region: process.env.ALI_SDK_OSS_REGION,
    bucket: process.env.ALI_SDK_OSS_BUCKET,
    secure: true,
  });
};
