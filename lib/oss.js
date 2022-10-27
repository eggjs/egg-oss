const assert = require('assert');
const { Client, STS, ClusterClient } = require('oss-client');

function checkBucketConfig(config) {
  assert(config.endpoint || config.region,
    '[egg-oss] Must set `endpoint` or `region` in oss\'s config');
  assert(config.accessKeySecret && config.accessKeyId,
    '[egg-oss] Must set `accessKeyId` and `accessKeySecret` in oss\'s config');
}

module.exports = app => {
  app.addSingleton('oss', (config, app) => {
    config = Object.assign({}, config, { urllib: app.httpclient });
    if (config.cluster) {
      config.cluster.forEach(checkBucketConfig);
      return new ClusterClient(config);
    }

    if (config.sts === true) {
      return new STS(config);
    }

    checkBucketConfig(config);
    return new Client(config);
  });
  app.createOss = app.oss.createInstance.bind(app.oss);
};
