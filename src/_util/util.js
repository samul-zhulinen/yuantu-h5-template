/* eslint-disable */
import url from 'url';
import config from '../config';
import hybridAPI from '@lib/hybridAPI';
// 通用版本判断方法
let versionCommon = {
  v: { x: 0, y: 0, z: 0 },
  gt: function(x, y, z) {
    var aa = [this.v.x, this.v.y, this.v.z];
    var ab = [x, y, z];
    var i = 0;
    var la = aa.length,
      lb = ab.length;
    while (la > lb) {
      ab.push(0);
      ++lb;
    }
    while (la < lb) {
      aa.push(0);
      ++la;
    }
    while (i < la && i < lb) {
      var ai = parseInt(String(aa[i]), 10);
      var bi = parseInt(ab[i], 10);
      if (ai > bi) {
        return true;
      } else if (ai < bi) {
        return false;
      }
      ++i;
    }

    return false;
  },
  // <
  lt: function(x, y, z) {
    // 相等的时候不小于
    if (this.v.x == x && this.v.y == y && this.v.z == z) {
      return false;
    }

    return !this.gt(x, y, z);
  },
};
const util = {
  query: function() {
    var arr = (location.hash || '').split('?')[1].split('&');
    var params = {};
    for (var i = 0; i < arr.length; i++) {
      var data = arr[i].split('=');
      if (data.length === 2) {
        params[data[0]] = decodeURIComponent(data[1]);
      }
    }
    return params;
  },
  isInYuantuApp: function() {
    //临时
    //return navigator.userAgent.indexOf("MicroMessage") != -1;
    return navigator.userAgent.indexOf('YuanTu(') != -1;
    // return navigator.userAgent.indexOf("YuanTu(") != -1;
  },
  isWeixin: function() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (String(ua.match(/MicroMessenger/i)) === 'micromessenger') {
      return true;
    } else {
      return false;
    }
  },
  //跳转到登录页面 history 是否清楚当前页面的历史记录
  goLogin: function(clearHistory) {
    //var h5_domain = config.H5_DOMAIN;
    var query = url.parse(window.location.href, true).query || {};
    var unionId = query.unionId || '';
    var corpId = query.corpId || '';
    var loginUrl = `${config.TRANSFER}`;
    loginUrl += this.flat({
      transferKey: '96',
      backview: 1,
      corpId,
      unionId,
      target: '_blank',
      redirecturl: window.location.href,
    });

    if (this.isInYuantuApp()) {
      loginUrl = `${config.TRANSFER}${util.flat({
        target: '_blank',
        transferKey: '97',
        unionId,
        corpId,
      })}`;
      hybridAPI.openView(loginUrl, 'bottom-in');
    } else {
      if (clearHistory) {
        window.location.replace(loginUrl);
      } else {
        window.location.href = loginUrl;
      }
    }
  },
  h5URL(path) {
    return (
      window.location.protocol +
      '//' +
      config.H5_DOMAIN +
      '/yuantu/h5-cli/' +
      config.VERSION +
      path
    );
  },
  flat: function(param) {
    var str = '';
    for (var key in param) {
      str +=
        key +
        '=' +
        (param[key] != undefined ? encodeURIComponent(param[key]) : '') +
        '&';
    }
    return str.slice(0, -1);
  },
  getPlatform: function() {
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') != -1 || ua.indexOf('iPad') != -1) {
      return 'ios';
    }

    if (ua.indexOf('Android') != -1) {
      return 'android';
    }
    return null;
  },
  //当前客户端版本比较
  version: {
    ...versionCommon,
    v: (function() {
      var versions = navigator.userAgent.match(/YuanTu\((?:QY|YY)\/([\d.]+)\)/);
      if (versions && versions.length) {
        return {
          x: parseInt(versions[1].split('.')[0]),
          y: parseInt(versions[1].split('.')[1]),
          z: parseInt(versions[1].split('.')[2]),
        };
      }

      return { x: 0, y: 0, z: 0 };
    })(),
    test: function() {
      var v = {
        v: {
          x: 2,
          y: 1,
          z: 19,
        },
      };

      // console.log( this.version.test() )
      return [this.v.x, this.v.y, this.v.z].join('.') > [x, y, z].join('.');
    },
  },
  /**
   * 根据配置筛选模式
   * @param {Object} config
   * @param {Number} unionId
   * @param {Number} corpId
   */

  patientModel(config, unionId, corpId) {
    const { unionIds, corpIds } = config;

    let res = unionIds[unionId]
      ? corpIds[corpId]
        ? corpIds[corpId]
        : unionIds[unionId]
      : corpId
      ? corpIds[corpId]
        ? corpIds[corpId]
        : 'Patient'
      : 'Patient';

    return res;
  },
};

export default util;
