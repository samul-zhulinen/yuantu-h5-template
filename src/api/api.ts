import config from '../config';
import JsonpPromise from '@lib/JsonpPromise';
const API_DOMAIN = config.API_DOMAIN;
const PROTOCOL = config.PROTOCOL;
const TMS_DOMAIN = config.TMS_DOMAIN;

function getAPIUri(path: any) {
  return API_DOMAIN.indexOf('http') == 0
    ? API_DOMAIN + path
    : PROTOCOL + API_DOMAIN + path;
}

export default {
  //获取就诊人模式
  getPatientModel() {
    return new JsonpPromise(`${TMS_DOMAIN}/tms/h5/special-config.php`);
  },

  //获取病人列表
  getPatients({ unionId, corpId, patientType = 1, needDesensitize }: any) {
    return new JsonpPromise(getAPIUri('/user-web/restapi/patient/getList'), {
      unionId,
      corpId,
      patientType,
      needDesensitize,
    });
  },

  // 获取微信appToken
  getWxAppToken(params: any) {
    return new JsonpPromise(
      getAPIUri('/user-web/restapi/wechatEHC/getAppToken'),
      { ...params },
    );
  },

  // 获取微信电子健康卡列表
  getCardListByOpenId(params: any) {
    return new JsonpPromise(
      getAPIUri('/user-web/restapi/wechatEHC/getCardListByOpenId'),
      { ...params },
    );
  },
};
