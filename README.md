# egg-oss

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-oss.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-oss
[travis-image]: https://img.shields.io/travis/eggjs/egg-oss.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-oss
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-oss.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-oss?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-oss.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-oss
[snyk-image]: https://snyk.io/test/npm/egg-oss/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-oss
[download-image]: https://img.shields.io/npm/dm/egg-oss.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-oss

[OSS](https://cn.aliyun.com/product/oss) plugin for egg

## Install

```bash
$ npm i egg-oss
```

## Configration

To enable oss plugin, you should change `${baseDir}/config/plugin.js`

```js
// config/plugin.js
exports.oss = {
  enable: true,
  package: 'egg-oss',
};
```

Then fill in nessary information like OSS's `bucket`, `accessKeyId`, `accessKeySecret` in `${baseDir}/config/config.{env}.js`

Mention, `egg-oss` support normal oss client and oss cluster client, based on [ali-oss](https://github.com/ali-sdk/ali-oss):

```js
// normal oss bucket
exports.oss = {
  client: {
    accessKeyId: 'your access key',
    accessKeySecret: 'your access secret',
    bucket: 'your bucket name',
    endpoint: 'oss-cn-hongkong.aliyun.com',
    timeout: '60s',
  },
};

// cluster oss bucket
// need to config all bucket information under cluster
exports.oss = {
  client: {
    cluster: [{
      endpoint: 'host1',
      accessKeyId: 'id1',
      accessKeySecret: 'secret1',
    }, {
      endpoint: 'host2',
      accessKeyId: 'id2',
      accessKeySecret: 'secret2',
    }],
    schedule: 'masterSlave', //default is `roundRobin`
    timeout: '60s',
  },
};

// if config.sts == true, oss will create STS client
exports.oss = {
  client: {
    sts: true,
    accessKeyId: 'your access key',
    accessKeySecret: 'your access secret',
  },
};
```

Init in egg agent, default is `false`:

```js
exports.oss = {
  useAgent: true,
};
```

## Usage

You can aquire oss instance on `app` or `ctx`.

```js
const path = require('path');

// upload a file in controller
module.exports = function*() {
  const parts = this.multipart();
  let object;
  let part;
  part = yield parts;
  while (part) {
    if (part.length) {
      // arrays are busboy fields
      console.log('field: ' + part[0]);
      console.log('value: ' + part[1]);
      console.log('valueTruncated: ' + part[2]);
      console.log('fieldnameTruncated: ' + part[3]);
    } else {
      // otherwise, it's a stream
      console.log('field: ' + part.fieldname);
      console.log('filename: ' + part.filename);
      console.log('encoding: ' + part.encoding);
      console.log('mime: ' + part.mime);
      // file handle
      object = yield this.oss.put('egg-oss-demo-' + part.filename, part);
    }
    part = yield parts;
  }
  console.log('and we are done parsing the form!');
  if (object) {
    console.log('get oss object: %j', object);
    this.unsafeRedirect(object.url);
  } else {
    this.body = 'please select a file to upload！';
  }
}
```

To learn OSS client API, please check [oss document](https://github.com/ali-sdk/ali-oss)。

## Create one more OSS buckets

Some application need to access more than one oss bucket, then you need to configure `oss.clients`, and
you can create new oss instance dynamicly by `app.oss.createInstance(config)`.

- `${appdir}/config/config.default.js`

```js
exports.oss = {
  clients: {
    bucket1: {
      bucket: 'bucket1',
    },
    bucket2: {
      bucket: 'bucket2',
    },
  },
  // shared by client, clients and createInstance
  default: {
    endpoint: '',
    accessKeyId: '',
    accessKeySecret: '',
  },
};

exports.bucket3 = {
  bucket: 'bucket3',
};
```

- `${appdir}/config/plugin.js`

```js
exports.oss = true;
```

- `${appdir}/app.js`

```js
module.exports = function (app) {
  const bucket1 = app.oss.get('bucket1');
  const bucket2 = app.oss.get('bucket2');
  // it will merge app.config.bucket3 and app.config.oss.default
  const bucket3 = app.oss.createInstance(app.config.bucket3);
}
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## secure keys

ping @fengmk2 to give you the access key!

- [oss secure keys](https://sharelock.io/1/d4dxf7wWoRP2Bh1ogtu4SfP_yt735noKhBld409yX84.acpMDn/-vOrQ4j4BpkMoxKkMeEavhwwUf0d293WY0WzHWDm-iVd8jbSwL/XEd43LrRzS7qmli4oJbbX_GcmG_X4KRu9pCMARJH4n92ebbtP1/y0fqwtoyV3JnK2ZdTJ4Ynky_ZVt7RR_Ji8DhLpn2N9j-A1BabK/FxYHfdXtUUrG4nd0PzN18_W2SuEr8Eyyqc6SHpFHt3qrgdSRse/giuXaV_3igL1CipdL5F5Vy2iDxjeRb_Zt_8Xlkmg1frfQTcnfZ/sfnl9zNYqOBzjGlC8f6YI6dDvShM-o1VoKp5F_kcXok1lAiLt4/3TnriQ6YM-qcx3wL7wgHu7TbzN_-4FN3ijpVOHkIVNPXjIquxL/SfKBlmu50XnZrYetixa0fvlbrc2yIAKx7cPQUxUe33b6Ti8N8b/U_rIfAGGL_8hK4XRLMWGdVevbSbw0IHgokTm6zGvpHj9PEILtP/wGJ5l3-hW6Chr5FJYJO1Wv0H4haJGctf3K2fg40ku8sx7511qv/h8xnoUyQmM0jkRrysIAD7FcW5mplMcvIOVd_CyugoH-NZCZfE1/maLQF303M3Y5_6kLBhF_Yi3jwO-UX7pTFt_Ax_ATh6Wvvix4JC/MjK891qkm4_vumc_Y86XB6HpchO7ox4nW5m2jUJlP016sBEnMw/bKE0FaX2SQ.WSqThAUsnFO7ddCpRJuotw)

## License

[MIT](LICENSE)
