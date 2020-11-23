import axios from 'axios';
import util from '@util/util';

/**
 * https://github.com/axios/axios
 */

// 拦截器
axios.interceptors.response.use(function(res) {
  const data = res.data;
  if (data.resultCode == '202') {
    util.goLogin();
    return;
  }
});

export default axios;
