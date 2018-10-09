'use strict';

const assert = require('assert');
const roleArn = require('../../../../sts_config').roleArn;

module.exports = function(app) {
  const policy = {
    Statement: [
      {
        Action: [
          'oss:*',
        ],
        Effect: 'Allow',
        Resource: [ 'acs:oss:*:*:*' ],
      },
    ],
    Version: '1',
  };

  app.get('/assume-role', async ctx => {
    const result = await app.oss.assumeRole(roleArn, policy);
    assert(result.res.status === 200);
    ctx.body = 'done';
  });
};
