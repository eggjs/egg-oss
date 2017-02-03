'use strict';

const pedding = require('pedding');
const mm = require('egg-mock');
const request = require('supertest');
const oss = require('ali-oss');
const config = require('./fixtures/apps/oss/config/config.default').oss.client;
const assert = require('assert');
const env = process.env;
const region = env.ALI_SDK_OSS_REGION || 'oss-cn-hangzhou';
// const prefix = process.platform + '-' + process.version + '/';

describe('test/oss.test.js', () => {
  afterEach(mm.restore);
  describe.only('oss', () => {
    let app;
    let lastUploadFileName;
    before(function* () {
      const ossConfig = {
        accessKeyId: config.accessKeyId,
        accessKeySecret: config.accessKeySecret,
        endpoint: config.endpoint,
        region,
        callbackServer: 'http://d.rockuw.com:4567',
      };
      console.log(ossConfig);
      const store = oss(ossConfig);
      const bucket = config.bucket;
      const result = yield store.putBucket(bucket, region);
      assert.equal(result.bucket, bucket);
      assert.equal(result.res.status, 200);
      app = mm.app({
        baseDir: 'apps/oss',
      });
      return app.ready();
    });

    after(function* () {
      if (lastUploadFileName) {
        yield app.oss.delete(lastUploadFileName);
      }
      app.close();
    });

    it('https?://endpoint should replace', function(done) {
      const ta = mm.app({
        baseDir: 'apps/oss-endpoint-http',
      });
      ta.ready(function() {
        assert(ta.oss.options.endpoint.host === 'oss-test.aliyun-inc.com');
        done();
      });
    });

    it('should throw error when missing endpoint or region', function(done) {
      const app = mm.app({
        baseDir: 'apps/oss-missing-config',
      });
      app.on('error', err => {
        assert(err.message === '[egg-oss] Must set `accessKeyId` and `accessKeySecret` in oss\'s config');
        done();
      });
    });

    it('should be config correctly', function* () {
      const config = app.config.oss.client;
      assert(typeof config.accessKeyId === 'string');
      assert(typeof config.accessKeySecret === 'string');
      assert(typeof config.bucket === 'string');
    });

    it('should be injected correctly', function(done) {
      request(app.callback())
        .get('/')
        .expect({
          app: true,
          ctx: true,
          putBucket: true,
        })
        .expect(200, done);
    });

    it('should upload file stream to oss', function(done) {
      done = pedding(2, done);
      request(app.callback())
        .get('/uploadtest')
        .expect(function(res) {
          console.log(res.body);
          lastUploadFileName = res.body.name;
          assert(typeof res.body.name === 'string');
          assert(/^http:\/\/egg\-oss\-test\-bucket\-test99.oss\-test.aliyun\-inc.com/.test(res.body.url));
          assert(res.body.res.status === 200);
          done();
        })
        .expect(200, done);
    });

    it('should upload file stream to oss using custom init oss', function(done) {
      const app = mm.app({
        baseDir: 'apps/oss-not-init',
      });
      app.ready(() => {
        done = pedding(2, done);
        request(app.callback())
          .get('/uploadtest')
          .expect(function(res) {
            lastUploadFileName = res.body.name;
            assert(typeof res.body.name === 'string');
            assert(/^http:\/\/egg\-oss\-test\-bucket\-test99.oss\-test.aliyun\-inc.com/.test(res.body.url));
            assert(res.body.res.status === 200);
            done();
          })
          .expect(200, done);
      });
    });

    it('should upload file stream to cluster oss', function(done) {
      done = pedding(2, done);
      app = mm.app({
        baseDir: 'apps/oss-cluster',
      });
      app.ready(() => {
        request(app.callback())
          .get('/uploadtest')
          .expect(function(res) {
            lastUploadFileName = res.body.name;
            assert(typeof res.body.name === 'string');
            assert(/^http:\/\/egg\-oss\-test\-bucket\-test99.oss\-test.aliyun\-inc.com/.test(res.body.url));
            assert(res.body.res.status === 200);
            done();
          })
          .expect(200, done);
      });
    });
  });

  describe('oss in agent', function() {
    let app;

    before(function(done) {
      app = mm.cluster({
        baseDir: 'apps/oss-agent',
      });
      app.ready(done);
    });

    after(function() {
      app.end();
    });

    it('should work', function(done) {
      request(app)
        .get('/agent')
        .expect(200, 'OK', done);
    });
  });

  describe('oss with clients', () => {
    let app;
    let lastUploadFileName;
    before(function(done) {
      app = mm.app({
        baseDir: 'apps/oss-clients',
      });
      app.ready(done);
    });

    after(function* () {
      if (lastUploadFileName) {
        yield app.oss.get('oss2').delete(lastUploadFileName);
      }
    });

    it('should upload file stream to oss', function(done) {
      done = pedding(2, done);
      request(app.callback())
        .get('/uploadtest')
        .expect(function(res) {
          lastUploadFileName = res.body.name;
          assert(typeof res.body.name === 'string');
          assert(/^http:\/\/egg\-oss\-test\-bucket\-test99.oss\-test.aliyun\-inc.com/.test(res.body.url));
          assert(res.body.res.status === 200);
          done();
        })
        .expect(200, done);
    });
  });
});
