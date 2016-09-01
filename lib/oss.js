'use strict';

const assert = require('assert');
const OSS = require('ali-oss');

module.exports = app => {
  const config = app.config.oss;

  app.config.oss = compact(config);

  if (app.config.oss !== config) {
    app.deprecate('[egg-oss] 配置格式已修改，请尽快查阅 egg-oss 文档并更新到新版配置格式');
  }

  app.addSingleton('oss', (config, app) => {
    config = Object.assign({}, config, { urllib: app.urllib });
    if (config.cluster) {
      config.cluster.forEach(checkBucketConfig);
      return new OSS.ClusterClient(config);
    }

    checkBucketConfig(config);
    return new OSS(config);
  });
  app.createOss = app.oss.createInstance.bind(app.oss);
};

function compact(originalConfig) {
  if (originalConfig.cluster || originalConfig.accessKeyId) {
    const config = {
      useAgent: originalConfig.useAgent,
    };
    config.client = originalConfig;
    delete config.client.default;
    delete config.client.useAgent;
    delete config.client.init;
    return config;
  }
  return originalConfig;
}

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
