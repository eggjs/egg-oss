import { Client as OSSClient } from 'oss-client';

export { OSSClient };

declare module 'egg' {
  interface Application {
    oss: { get(id: string): OSSClient } & OSSClient;
  }

  interface Context {
    oss: Application['oss'];
  }

  // interface EggAppConfig {
  //   ddsOSS: {
  //     cacheDir: string;
  //     datasource: {
  //       /** 单数据源 */
  //       client?: DdsOSSClientConfig;
  //       /** 多数据源 */
  //       clients?: { [key: string]: DdsOSSClientConfig };
  //     }
  //   }
  // }
}
