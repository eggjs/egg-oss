'use strict';

const path = require('path');
const pedding = require('pedding');
const mm = require('egg-mock');
const request = require('supertest');
const ossConfig = require('./fixtures/apps/oss/config/config.default').oss.client;
const assert = require('assert');

describe('test/oss.test.js', () => {
  afterEach(mm.restore);

  describe('oss', () => {
    let app;
    let lastUploadFileName;
    before(function* () {
      app = mm.app({
        baseDir: 'apps/oss',
      });
      yield app.ready();

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

    it.skip('should throw error when missing endpoint or region', function(done) {
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
          lastUploadFileName = res.body.name;
          assert(typeof res.body.name === 'string');
          assert(/^https?:\/\/egg\-oss\-test-bucket\.\w+/.test(res.body.url));
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
            assert(/^https?:\/\/egg\-oss\-test\-bucket\.\w+/.test(res.body.url));
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
            assert(/^https:\/\/egg\-oss\-test\-bucket\.\w+/.test(res.body.url));
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
          assert(/^https?:\/\/egg\-oss\-test\-bucket\.\w+/.test(res.body.url));
          assert(res.body.res.status === 200);
          done();
        })
        .expect(200, done);
    });
  });
});
