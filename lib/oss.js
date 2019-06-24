'use strict';

const assert = require('assert');
const is = require('is-type-of');
const OSS = require('ali-oss');
const STS = OSS.STS;
const ClusterClient = OSS.ClusterClient;

function checkBucketConfig(config) {
  assert(config.endpoint || config.region,
    '[egg-oss] Must set `endpoint` or `region` in oss\'s config');
  assert(config.accessKeySecret && config.accessKeyId,
    '[egg-oss] Must set `accessKeyId` and `accessKeySecret` in oss\'s config');
}

module.exports = app => {
  app.addSingleton('oss', async (config, app) => {
    config = Object.assign({}, config, { urllib: app.httpclient });
    if (is.function(config.loadConfig)) {
      const result = config.loadConfig(config, app);
      config = is.promise(result) ? (await result) : result;
    }
    if (config.cluster) {
      config.cluster.forEach(checkBucketConfig);
      return new ClusterClient(config);
    }

    if (config.sts === true) {
      return new STS(config);
    }

    checkBucketConfig(config);
    return new OSS(config);
  });
};
