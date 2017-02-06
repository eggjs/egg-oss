'use strict';

module.exports = {
  /**
   * OSS Singleton instance
   * @member Context#oss
   * @since 1.0.0
   * @see App#oss
   */
  get oss() {
    return this.app.oss;
  },
};
