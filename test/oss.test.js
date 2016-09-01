'use strict';

const pedding = require('pedding');
const mm = require('egg-mock');
const request = require('supertest');
const urllib = require('urllib');

describe('test/oss.test.js', () => {
  afterEach(mm.restore);
  describe('oss', () => {
    let app;
    let lastUploadFileName;
    before(() => {
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
        ta.oss.options.endpoint.host.should.eql('oss-cn-hangzhou-zmf.aliyuncs.com');
        done();
      });
    });

    it('should throw error when missing endpoint or region', function(done) {
      const app = mm.app({
        baseDir: 'apps/oss-missing-config',
      });
      app.on('error', err => {
        err.message.should.equal('[egg:oss] Must set `accessKeyId` and `accessKeySecret` in oss\'s config');
        done();
      });
    });

    it('should be config correctly', function* () {
      const config = app.config.oss.client;
      config.accessKeyId.should.be.a.String;
      config.accessKeySecret.should.be.a.String;
      config.bucket.should.be.a.String;
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
        console.log(res);
        lastUploadFileName = res.body.name;
        res.body.name.should.be.a.String;
        res.body.url.should.match(/^https?:\/\/alipay\-rmsdeploy\-dev\-assets\./);
        // oss url 能够被访问到
        urllib.request(res.body.url, function(err, _, res) {
          res.status.should.equal(200);
          done(err);
        });
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
          res.body.name.should.be.a.String;
          res.body.url.should.match(/^https?:\/\/alipay\-rmsdeploy\-dev\-assets\./);
          // oss url 能够被访问到
          urllib.request(res.body.url, function(err, _, res) {
            res.status.should.equal(200);
            done(err);
          });
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
          res.body.name.should.be.a.String;
          res.body.url.should.match(/^https?:\/\/alipay\-rmsdeploy\-dev\-assets\./);
          // oss url 能够被访问到
          urllib.request(res.body.url, function(err, _, res) {
            res.status.should.equal(200);
            done(err);
          });
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
      app.stop();
    });

    it('should work', function(done) {
      request(app)
        .get('/agent')
        .expect(200, 'OK', done);
    });
  });

  describe('oss with new config style', () => {
    let app;
    let lastUploadFileName;
    before(function(done) {
      app = mm.app({
        baseDir: 'apps/oss-new',
      });
      app.ready(done);
    });

    after(function* () {
      if (lastUploadFileName) {
        yield app.oss.delete(lastUploadFileName);
      }
    });

    it('should upload file stream to oss', function(done) {
      done = pedding(2, done);
      request(app.callback())
      .get('/uploadtest')
      .expect(function(res) {
        lastUploadFileName = res.body.name;
        res.body.name.should.be.a.String;
        res.body.url.should.match(/^https?:\/\/alipay\-rmsdeploy\-dev\-assets\./);
        // oss url 能够被访问到
        urllib.request(res.body.url, function(err, _, res) {
          res.status.should.equal(200);
          done(err);
        });
      })
      .expect(200, done);
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
        res.body.name.should.be.a.String;
        res.body.url.should.match(/^https?:\/\/alipay\-rmsdeploy\-dev\-assets\./);
        // oss url 能够被访问到
        urllib.request(res.body.url, function(err, _, res) {
          res.status.should.equal(200);
          done(err);
        });
      })
      .expect(200, done);
    });
  });
});
