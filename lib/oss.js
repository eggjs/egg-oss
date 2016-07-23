'use strict';

const assert = require('assert');
const OSS = require('ali-oss');

module.exports = app => {
  app.addSingoneTon('oss', (config, app) => {
    config = Object.assign({}, config, { urllib: app.urllib });
    if (config.cluster) {
      config.cluster.forEach(checkBucketConfig);
      return new OSS.ClusterClient(config);
    }

    checkBucketConfig(config);
    return new OSS(config);
  });
};

const RE_HTTP_PROTOCOL = /^https?:\/\//;
function checkBucketConfig(config) {
  assert(config.endpoint || config.region,
    '[egg-oss] Must set `endpoint` or `region` in oss\'s config');
  assert(config.accessKeySecret && config.accessKeyId,
    '[egg-oss] Must set `accessKeyId` and `accessKeySecret` in oss\'s config');

  if (config.endpoint && RE_HTTP_PROTOCOL.test(config.endpoint)) {
    config.endpoint = config.endpoint.replace(RE_HTTP_PROTOCOL, '');
  }
}
