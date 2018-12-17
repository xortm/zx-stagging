
import appFn from './common/appFn';
import req, { encryptMD5 } from './common/request';
import './common/myApp';
import config from './config';
import qs from 'qs';

//app.js
App({
  data: {
    openId: '',
    sessionKey: '',
    unionId: '',
    pos: {
      id: '110000',
      name: '北京',
    }, // 地理位置
    system: "", // 操作系统
    pageLink: [], // 路由记录
  },
  global: appFn.global,
  getPhoneNumber: appFn.getPhoneNumber,
  onShow({ path, query, scene, referrerInfo }) {
    this.getSystemInfo();
  },

  //页面隐藏，清除计时器
  onHide() {
  },

  getSystemInfo() {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.data.statusBarHeight = res.statusBarHeight;
        that.data.pixelRatio = res.pixelRatio;
        that.data.phoneModel = res.model; // 手机型号
        if (res.system.indexOf("Android") != -1) {
          // 安卓系统
          that.data.system = "Android";
          that.data.userPhoneType = 2;
        } else {
          that.data.system = "iOS";
          that.data.userPhoneType = 1;
        }
      },
    })
  },
})
