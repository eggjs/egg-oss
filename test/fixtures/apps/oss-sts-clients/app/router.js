'use strict';

const assert = require('assert');
const roleArn = require('../../../../sts_config').roleArn;
const createSTSClient = require('../../../../sts_client');

module.exports = function(app) {
  app.get('/assume-role', async ctx => {
    const result = await app.oss.get('client1').assumeRole(roleArn);
    assert(result.res.status === 200);

    const accessKeyId = result.credentials.AccessKeyId;
    const accessKeySecret = result.credentials.AccessKeySecret;
    const stsToken = result.credentials.SecurityToken;

    const client = createSTSClient(accessKeyId, accessKeySecret, stsToken);
    const list = await client.list();
    ctx.body = list.objects.length;
  });
};
