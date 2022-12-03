import { Client as OSSClient } from 'oss-client';

export { OSSClient };

declare module 'egg' {
  interface Application {
    oss: { get(id: string): OSSClient } & OSSClient;
  }

  interface Context {
    oss: Application['oss'];
  }
}
