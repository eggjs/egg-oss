'use strict';

const path = require('path');
const mm = require('egg-mock');
const ossConfig = require('./fixtures/apps/oss/config/config.default').oss.client;
const assert = require('assert');

describe('test/oss.test.js', () => {
  afterEach(mm.restore);

  it('should throw error when missing endpoint or region', function* () {
    const app = mm.app({
      baseDir: 'apps/oss-missing-config',
    });
    try {
      yield app.ready();
      throw new Error('should not run');
    } catch (err) {
      assert(err.message === '[egg-oss] Must set `accessKeyId` and `accessKeySecret` in oss\'s config');
    } finally {
      yield app.close();
    }
  });

  describe('oss', () => {
    let app;
    let lastUploadFileName;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/oss',
      });
      yield app.ready();
    });
    before(function* () {
      const bucket = ossConfig.bucket;
      // const buckets = yield store.listBuckets();
      try {
        const result = yield app.oss.putBucket(bucket, ossConfig.region);
        assert.equal(result.bucket, bucket);
        assert.equal(result.res.status, 200);
      } catch (err) {
        // console.log('putBucket error: %s', err);
        if (err.name !== 'BucketAlreadyExistsError') {
          console.log('create bucket %s error: %s', bucket, err);
          console.log(err);
          console.log(err.stack);
          throw err;
        }
      }
    });
    after(function* () {
      if (lastUploadFileName) {
        yield app.oss.delete(lastUploadFileName);
      }
      yield app.close();
    });

    it('should app.oss put file ok', function* () {
      const result = yield app.oss.put(path.basename(__filename), __filename);
      assert(result.url);
      assert(result.res.status === 200);
    });

    it('should return promise', function* () {
      const p = app.oss.put(path.basename(__filename), __filename);
      assert(typeof p.then === 'function');
      const result = yield p;
      assert(result.url);
    });

    it('should be config correctly', function* () {
      const config = app.config.oss.client;
      assert(typeof config.accessKeyId === 'string');
      assert(typeof config.accessKeySecret === 'string');
      assert(typeof config.bucket === 'string');
    });

    it('should be injected correctly', function* () {
      yield app.httpRequest()
        .get('/')
        .expect({
          app: true,
          ctx: true,
          putBucket: true,
        })
        .expect(200);
    });

    it('should upload file stream to oss', function* () {
      yield app.httpRequest()
        .get('/uploadtest')
        .expect(res => {
          lastUploadFileName = res.body.name;
          assert(typeof res.body.name === 'string');
          assert(/^https?:\/\/egg\-oss\-test-bucket\.\w+/.test(res.body.url));
          assert(res.body.res.status === 200);
        })
        .expect(200);
    });

    it('should pass httpclient', function* () {
      assert(app.oss.urllib === app.httpclient);
    });
  });

  describe('oss not init', () => {
    let app;
    let lastUploadFileName;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/oss-not-init',
      });
      yield app.ready();
    });
    after(function* () {
      if (lastUploadFileName) {
        yield app.uploader.delete(lastUploadFileName);
      }
    });
    after(function* () {
      yield app.close();
    });

    it('should upload file stream to cluster oss', function* () {
      yield app.httpRequest()
        .get('/uploadtest')
        .expect(function(res) {
          lastUploadFileName = res.body.name;
          assert(typeof res.body.name === 'string');
          assert(/^https?:\/\/egg\-oss\-test\-bucket\.\w+/.test(res.body.url));
          assert(res.body.res.status === 200);
        })
        .expect(200);
    });
  });

  describe('oss cluster', () => {
    let app;
    let lastUploadFileName;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/oss-cluster',
      });
      yield app.ready();
    });
    after(function* () {
      if (lastUploadFileName) {
        yield app.oss.delete(lastUploadFileName);
      }
      yield app.close();
    });

    it('should upload file stream to cluster oss', function* () {
      yield app.httpRequest()
        .get('/uploadtest')
        .expect(function(res) {
          lastUploadFileName = res.body.name;
          assert(typeof res.body.name === 'string');
          assert(/^https:\/\/egg\-oss\-test\-bucket\.\w+/.test(res.body.url));
          assert(res.body.res.status === 200);
        })
        .expect(200);
    });
  });

  describe('oss in agent', function() {
    let app;
    before(function* () {
      app = mm.cluster({
        baseDir: 'apps/oss-agent',
      });
      yield app.ready();
    });
    after(function* () {
      yield app.close();
    });

    it('should work', function* () {
      yield app.httpRequest()
        .get('/agent')
        .expect('OK')
        .expect(200);
    });
  });

  describe('oss with clients', () => {
    let app;
    let lastUploadFileName;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/oss-clients',
      });
      yield app.ready();
    });
    after(function* () {
      if (lastUploadFileName) {
        yield app.oss.get('oss2').delete(lastUploadFileName);
      }
      yield app.close();
    });

    it('should upload file stream to oss', function* () {
      yield app.httpRequest()
        .get('/uploadtest')
        .expect(function(res) {
          lastUploadFileName = res.body.name;
          assert(typeof res.body.name === 'string');
          assert(/^https?:\/\/egg\-oss\-test\-bucket\.\w+/.test(res.body.url));
          assert(res.body.res.status === 200);
        })
        .expect(200);
    });
  });

  describe('endpoint with http', () => {
    let app;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/oss-endpoint-http',
      });
      yield app.ready();
    });
    after(function* () {
      yield app.close();
    });

    it('should set http', function* () {
      assert(app.oss.options.endpoint.hostname === 'oss.aliyun.com');
      assert(app.oss.options.endpoint.protocol === 'http:');
    });
  });

  describe('endpoint with https', () => {
    let app;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/oss-endpoint-https',
      });
      yield app.ready();
    });
    after(function* () {
      yield app.close();
    });

    it('should set https', function* () {
      assert(app.oss.options.endpoint.hostname === 'oss.aliyun.com');
      assert(app.oss.options.endpoint.protocol === 'https:');
    });
  });

  describe('oss sts', () => {
    let app;
    let lastUploadFileName;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/oss-sts',
      });
      yield app.ready();
    });
    after(function* () {
      if (lastUploadFileName) {
        yield app.oss.delete(lastUploadFileName);
      }
      yield app.close();
    });

    it('should assumeRole', function* () {
      yield app.httpRequest()
        .get('/assume-role')
        .expect(200);
    });
  });

});
