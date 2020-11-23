/* eslint-disable */
import util from '@util/util';
import api from '@api/api';
import JSBridge from '@lib/JSBridge';
import { TRANSFER } from '../config';

export default class Patient {
  constructor() {
    this.list = [];
    this.patientInfo = {};
    this.fn = null;
  }

  register(params) {
    if (params.fn) {
      this.fn = params.fn;
    }
    this.type = params.type;
  }

  init() {
    this.nativeInit();
    this.getList();
  }

  async getList() {
    const { corpId, unionId } = util.query();
    const {
      data: { patientModel },
    } = await api.getPatientModel().fetch();
    let res = util.patientModel(
      patientModel,
      parseInt(unionId),
      parseInt(corpId),
    );
    // 就诊人模式
    if (res === 'Patient') {
      let func = api.getPatients({ unionId, corpId });
      func.fetch().then(res => {
        if (res.success) {
          this.list = res.data;
          this.get();
        }
      });
    } else {
      // 电子健康卡模式
      const res = await api.getWxAppToken({ unionId, corpId }).fetch();
      if (res.success) {
        const res1 = await api
          .getCardListByOpenId({ unionId, corpId, appToken: res.data.appToken })
          .fetch();
        if (res1.success) {
          this.list = res1.data;
          this.get();
        }
      }
    }
  }

  get() {
    if (this.list.length === 0) {
      this.fn && this.fn(false);
      return false;
    }

    const filterDefault = this.list.filter(
      item => item.default || item.defaultPatient,
    );
    const needDefault = localStorage.getItem('needDefault');
    let data;
    // 存在默认就诊人 且needDefault为'false'
    if (filterDefault.length > 0 && needDefault != 'false') {
      data = filterDefault[0];
    } else {
      const patientId = localStorage.getItem('patientId');
      const filterData = this.list.filter(
        item => (item.id || item.patientId) == patientId,
      );

      // localStorage中有patientId 且list中存在
      if (patientId && filterData.length > 0) {
        data = filterData[0];
      } else {
        localStorage.removeItem('patientId');
        data = this.list[0];
      }
    }

    this.patientInfo = {
      ...data,
      patientId: data.id || data.patientId,
      patientIdNo: data.idNo || data.guarderIdNo || data.idNumber,
      patientCardCount: data.cardCount,
      patientIdType: data.idType,
    };

    localStorage.removeItem('needDefault');
    this.fn && this.fn(this.patientInfo);
  }

  set(data = {}) {
    for (let key in data) {
      localStorage.setItem(key, data[key]);
    }
  }

  // unionId, corpId, flag...etc
  choose(params) {
    const { patientId } = this.patientInfo;
    const { unionId, corpId } = util.query();
    window.location.href = `${TRANSFER}${util.flat({
      target: '_blank',
      transferKey: '50',
      lastSelectPatientId: patientId,
      unionId,
      corpId,
      ...params,
      referrer: window.location.href,
    })}`;
  }

  // 监听native选择就诊人
  nativeInit() {
    if (util.isInYuantuApp()) {
      JSBridge.on('0', result => {
        if (result && result.ret == 'SUCCESS') {
          const data = result.data ? JSON.parse(result.data) : null;
          if (data) {
            this.patientInfo = { ...data };
            this.fn && this.fn(this.patientInfo);
          }
        }
      });
    }
  }
}
