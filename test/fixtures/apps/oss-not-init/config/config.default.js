'use strict';

let env = process.env;

exports.uploader = {
	accessKeyId: env.ALI_SDK_OSS_ID,
	accessKeySecret: env.ALI_SDK_OSS_SECRET,
	endpoint: env.ALI_SDK_OSS_ENDPOINT,
  	bucket:env.ALI_SDK_OSS_BUCKET
};

exports.oss = {
	init: false,
};