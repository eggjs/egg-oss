import { expectType } from 'tsd';
import { OSSClient } from '.';
import { Application } from 'egg';

const client = {} as OSSClient;
expectType<string>(client.signatureUrl('foo'));

const app = {} as Application;
expectType<OSSClient>(app.oss.get('oss-client-1'));
expectType<string>(app.oss.signatureUrl('foo'));
expectType<string>(await app.oss.asyncSignatureUrl('foo'));
