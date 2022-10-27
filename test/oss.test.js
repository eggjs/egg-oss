const path = require('path');
const mm = require('egg-mock');
const assert = require('assert');

describe('test/oss.test.js', () => {
  afterEach(mm.restore);

  it('should throw error when missing endpoint or region', async () => {
    const app = mm.app({
      baseDir: 'apps/oss-missing-config',
    });
    try {
      await app.ready();
      throw new Error('should not run');
    } catch (err) {
      assert(err.message === '[egg-oss] Must set `accessKeyId` and `accessKeySecret` in oss\'s config');
    } finally {
      await app.close();
    }
  });

  describe('oss', () => {
    let app;
    let lastUploadFileName;
    before(async () => {
      app = mm.app({
        baseDir: 'apps/oss',
      });
      await app.ready();
    });
    after(async () => {
      if (lastUploadFileName) {
        await app.oss.delete(lastUploadFileName);
      }
      await app.close();
    });

    it('should app.oss put file ok', async () => {
      const result = await app.oss.put(path.basename(__filename), __filename);
      assert(result.url);
      assert(result.res.status === 200);
    });

    it('should return promise', async () => {
      const p = app.oss.put(path.basename(__filename), __filename);
      assert(typeof p.then === 'function');
      const result = await p;
      assert(result.url);
    });

    it('should be config correctly', async () => {
      const config = app.config.oss.client;
      assert(typeof config.accessKeyId === 'string');
      assert(typeof config.accessKeySecret === 'string');
      assert(typeof config.bucket === 'string');
    });

    it('should be injected correctly', async () => {
      await app.httpRequest()
        .get('/')
        .expect({
          app: true,
          ctx: true,
        })
        .expect(200);
    });

    it('should upload file stream to oss', async () => {
      await app.httpRequest()
        .get('/uploadtest')
        .expect(res => {
          lastUploadFileName = res.body.name;
          assert(typeof res.body.name === 'string');
          assert(/^https?:\/\/\w+/.test(res.body.url));
          assert(res.body.res.status === 200);
        })
        .expect(200);
    });

    it('should pass httpclient', async () => {
      assert(app.oss.urllib === app.httpclient);
    });
  });

  describe('oss not init', () => {
    let app;
    let lastUploadFileName;
    before(async () => {
      app = mm.app({
        baseDir: 'apps/oss-not-init',
      });
      await app.ready();
    });
    after(async () => {
      if (lastUploadFileName) {
        await app.uploader.delete(lastUploadFileName);
      }
    });
    after(async () => {
      await app.close();
    });

    it('should upload file stream to cluster oss', async () => {
      await app.httpRequest()
        .get('/uploadtest')
        .expect(function(res) {
          lastUploadFileName = res.body.name;
          assert(typeof res.body.name === 'string');
          assert(/^https?:\/\/\w+/.test(res.body.url));
          assert(res.body.res.status === 200);
        })
        .expect(200);
    });
  });

  describe.skip('oss cluster', () => {
    let app;
    let lastUploadFileName;
    before(async () => {
      app = mm.app({
        baseDir: 'apps/oss-cluster',
      });
      await app.ready();
    });
    after(async () => {
      if (lastUploadFileName) {
        await app.oss.delete(lastUploadFileName);
      }
      await app.close();
    });

    it('should upload file stream to cluster oss', async () => {
      await app.httpRequest()
        .get('/uploadtest')
        .expect(function(res) {
          lastUploadFileName = res.body.name;
          assert(typeof res.body.name === 'string');
          assert(/^https:\/\/egg\-oss\-unittest\.\w+/.test(res.body.url));
          assert(res.body.res.status === 200);
        })
        .expect(200);
    });
  });

  describe('oss in agent', function() {
    let app;
    before(async () => {
      app = mm.cluster({
        baseDir: 'apps/oss-agent',
      });
      await app.ready();
    });
    after(async () => {
      await app.close();
    });

    it('should work', async () => {
      await app.httpRequest()
        .get('/agent')
        .expect('OK')
        .expect(200);
    });
  });

  describe('oss with clients', () => {
    let app;
    let lastUploadFileName;
    before(async () => {
      app = mm.app({
        baseDir: 'apps/oss-clients',
      });
      await app.ready();
    });
    after(async () => {
      if (lastUploadFileName) {
        await app.oss.get('oss2').delete(lastUploadFileName);
      }
      await app.close();
    });

    it('should upload file stream to oss', async () => {
      await app.httpRequest()
        .get('/uploadtest')
        .expect(function(res) {
          lastUploadFileName = res.body.name;
          assert(typeof res.body.name === 'string');
          assert(/^https?:\/\/\w+/.test(res.body.url));
          assert(res.body.res.status === 200);
        })
        .expect(200);
    });
  });

  describe('endpoint with http', () => {
    let app;
    before(async () => {
      app = mm.app({
        baseDir: 'apps/oss-endpoint-http',
      });
      await app.ready();
    });
    after(async () => {
      await app.close();
    });

    it('should set http', async () => {
      assert(app.oss.options.endpoint.hostname === 'oss.aliyun.com');
      assert(app.oss.options.endpoint.protocol === 'http:');
    });
  });

  describe('endpoint with https', () => {
    let app;
    before(async () => {
      app = mm.app({
        baseDir: 'apps/oss-endpoint-https',
      });
      await app.ready();
    });
    after(async () => {
      await app.close();
    });

    it('should set https', async () => {
      assert(app.oss.options.endpoint.hostname === 'oss.aliyun.com');
      assert(app.oss.options.endpoint.protocol === 'https:');
    });
  });

  describe.skip('oss sts', () => {
    let app;
    before(async () => {
      app = mm.app({
        baseDir: 'apps/oss-sts',
      });
      await app.ready();
    });
    after(async () => {
      await app.close();
    });

    it('should assumeRole', async () => {
      await app.httpRequest()
        .get('/assume-role')
        .expect(200)
        .expect(res => {
          assert(res.body >= 0);
        });
    });
  });

  describe.skip('oss sts clients', () => {
    let app;
    before(async () => {
      app = mm.app({
        baseDir: 'apps/oss-sts-clients',
      });
      await app.ready();
    });
    after(async () => {
      await app.close();
    });

    it('should assumeRole', async () => {
      await app.httpRequest()
        .get('/assume-role')
        .expect(200)
        .expect(res => {
          assert(res.body >= 0);
        });
    });
  });

});
