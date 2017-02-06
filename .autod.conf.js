'use strict';

module.exports = {
  write: true,
  prefix: '^',
   test: [
     'test',
     'benchmark',
   ],
  devdep: [
    'autod',
    'egg',
    'egg-bin',
    'eslint',
    'eslint-config-egg',
    'supertest',
  ],
  exclude: [
    './test/fixtures',
  ],
}
