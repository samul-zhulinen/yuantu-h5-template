/* eslint-disable */
import JSONP from './JSONP';
import util from '@util/util';
import { VERSION } from '../config';

/**
 * promise 封装jsonp
 */

export default class JsonpPromise {
  constructor(url, params = {}, config = {}) {
    const isInYuantuApp = util.isInYuantuApp();
    const query = util.query();
    params.t = parseInt(Math.random() * 100000);
    params.invokerChannel = params.invokerChannel || 'H5';
    params.invokerDeviceType = isInYuantuApp
      ? 'yuantuApp'
      : util.isWeixin()
      ? 'weixin'
      : 'others';
    params.invokerAppVersion = VERSION;
    params.invokerSource =
      query.invokerSource || sessionStorage.getItem('invokerSource') || '';
    params.thRegisterId = sessionStorage.getItem('thRegisterId') || '';

    if (query.unionId) {
      params.unionId = query.unionId;
    }

    this.url = url;
    this.params = params;
    this.config = config;
  }

  onError = res => {
    if (res.resultCode == '202') {
      util.goLogin();
      return;
    }
    // const { isShowToast = true, showTime = 1000 } = this.config
    // isShowToast && Alert.show(res.msg, showTime)
  };

  subscribe(observer) {
    if (observer.onError) {
      this.onError = observer.onError;
    }
    return this;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      let params = {};
      for (var key in this.params) {
        if (
          this.params[key] !== '' &&
          this.params[key] !== 'undefined' &&
          this.params[key] !== undefined &&
          this.params[key] !== null
        ) {
          params[key] = this.params[key];
        }
      }

      JSONP(this.url, params, res => {
        if (res.success) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    }).catch(res => {
      this.onError(res);
      return res;
    });
  }
}
