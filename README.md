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
    endpoint: '{https or http}://{your endpoint name}.aliyun.com',
    timeout: '60s',
  },
};

// cluster oss bucket
// need to config all bucket information under cluster
exports.oss = {
  client: {
    cluster: [{
      endpoint: '{https or http}://{your endpoint name}.aliyun.com',
      accessKeyId: 'id1',
      accessKeySecret: 'secret1',
    }, {
      endpoint: '{https or http}://{your endpoint name}.aliyun.com',
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

The example below will upload file to oss using [the `file` mode of egg-multipart](https://github.com/eggjs/egg-multipart#enable-file-mode-on-config).

```js
const path = require('path');
const Controller = require('egg').Controller;
const fs = require('mz/fs');

// upload a file in controller
module.exports = class extends Controller {
  async upload() {
    const ctx = this.ctx;

    const file = ctx.request.files[0];
    const name = 'egg-oss-demo/' + path.basename(file.filename);
    let result;
    try {
      result = await ctx.oss.put(name, file.filepath);
    } finally {
      await fs.unlink(file.filepath);
    }

    if (result) {
      console.log('get oss object: %j', object);
      ctx.unsafeRedirect(result.url);
    } else {
      ctx.body = 'please select a file to upload！';
    }
  }
};
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
    endpoint: '{https or http}://{your endpoint name}.aliyun.com',
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
module.exports = app => {
  const bucket1 = app.oss.get('bucket1');
  const bucket2 = app.oss.get('bucket2');
  // it will merge app.config.bucket3 and app.config.oss.default
  const bucket3 = app.oss.createInstance(app.config.bucket3);
}
```

## Development

Create `.env` file for environment that testcase need.

```ini
ALI_SDK_OSS_REGION=oss-cn-hangzhou
ALI_SDK_OSS_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com
ALI_SDK_OSS_ID=
ALI_SDK_OSS_SECRET=
ALI_SDK_OSS_BUCKET=
ALI_SDK_STS_ID=
ALI_SDK_STS_SECRET=
ALI_SDK_STS_BUCKET=
ALI_SDK_STS_ROLE=
```

And run `npm test`.

The key is saved in [link](https://sharelock.io/1/MJITmvvEAchnIBWfm04PdfgXJs-fzCphRTz-TiVIOMo.wKVjBx/ED9OdTKWdMbkV3OfdJNXX3xG-VductolPWQM36vIgMsfvU2_KE/1XZMzTYEoGZSrCJxERU7iThkRSbhpXB71qYPPbmNbtRHfONL2J/4LB-xlFm82ZoAopEaXriN7IE9O030x3twhCtc0o69Rl5RdXj7b/YjDPa2JHQK7MUDkHskE4AAkmDXqlwoVtbT55bLYjb6tP2uvKtb/LLk1Gdwgjq3ihB1CePk8J3rWWe_-0EwxiLrjoV2tCTgRv18u1B/_AQY3Ui4TM3kQFp_8hfBCMidToOlYgQUwRNQff_Hlc9Ygl_BY6/4vhOrHyFwBg-5_qcAp-NaMeYQ8UN2wdveYQFzdv9CiKO3_Jhdz/JEdNoDO2j9rhRzUdH_c9XaguZ3kO145VRhNxj8WJghpVcmVfJZ/GYv4V-NNF-4Zic0VTtJQ_zs9iJRqHhAxI7GOEOvbaDTzIS2DFI/N5Yc-IcK4d96een8mwzrD81PZmQRYB-X94jMTVIuuDoFrPSaPB/3ks_eN1JnFyIXhshrSIBQvCtm20nyTlgvI3CjZ6mIdZBoRVDVB/e7btgHqXtuCmBgW2FNdk_eqfXDr2LFFwXzgBp5w.fwKGWMsFGx/mNYbeP11buRg) (ask @popomore), you can change the key by run `scripts/gen_env.sh`.

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
