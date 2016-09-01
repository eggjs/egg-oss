'use strict';

const oss = require('./lib/oss');

module.exports = agent => {
  const useAgent = agent.config.oss.useAgent;
  if (useAgent) {
    oss(agent);
  }
};
