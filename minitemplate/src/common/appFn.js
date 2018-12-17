import wx from '../core/wx';
import request from './request';

// 获取openId
const decodeUserInfo = data => request.post('course-user/decodeUserInfo', { data });
// 上报用户进入时间
const updateUserLastloginTime = data => request.post('course-user/updateUserLastloginTime', { data });
// 刷新seesionKey
const getSessionKey = data => request.get('course-user/getSessionKey', { data });
// 获取手机号（解码）
const shouquanPhoneNo = data => request.post('course-user/shouquanPhoneNo', { data });

export default {

  /**
    * 静默登录 获取openId
    * @param {object} param0
    * 如果同时调用多次会请求多次接口，有待优化
    */
  global(cb) {
    if (this.data.openId) return cb(null, this.data);
    const openId = wx.getStorageSync('openId');
    const sessionKey = wx.getStorageSync('sessionKey');
    const phoneNumber = wx.getStorageSync('phoneNumber');
    const userId = wx.getStorageSync('userId');
    if (openId) {
      this.data.openId = openId;
      this.data.sessionKey = sessionKey;
      this.data.phoneNumber = phoneNumber;
      this.data.userId = userId;
      updateUserLastloginTime({ openId });
      return cb(null, this.data);
    }
    const { channelSite, relatedAppId } = this.data;
    if (this.data.logining) {
      return setTimeout(() => this.global(cb), 100);
    }
    this.data.logining = true;
    wx.login().then(({ code }) => {
      decodeUserInfo({
        channelSite,
        relatedAppId,
        code,
        u: this.data.fromId,
        v: this.data.videoId,
        userSource: 1,
        userPhoneType: this.data.userPhoneType,
      }).then(({ state, message, content }) => {
          if (state != 1) return cb(message);
          this.data.openId = content.openId;
          this.data.userId = content.userId;
          updateUserLastloginTime({ openId: content.openId });
          wx.setStorage({ key: 'openId', data: content.openId });
          wx.setStorage({ key: 'userId', data: content.userId });
          wx.setStorage({ key: 'sessionKey', data: content.sessionKey });
          this.data.sessionKey = content.sessionKey;
          this.data.todayLoginTimes = content.todayLoginTimes;
          this.data.unionId = content.unionId || '';
          cb(null, this.data);
          this.data.logining = false;
        }).catch(err => {
          insertDateReport({
            reportKey: 'login_fail',
            reportValue: err.message,
            ...this.data,
          });
          wx.reportAnalytics('login_fail', {
            err,
            ...this.data,
          })
        })
    }).catch(err => cb(err));
  },
  /**
   * 获取手机号
   * promise =》 state 1 成功 phoneNumber 手机号， state 0 失败 message 错误信息
   */
  getPhoneNumber({ encryptedData, iv }) {
    return new Promise((resolve, reject) => {
      this.global((err, { openId, sessionKey, channelSite, relatedAppId }) => {
        wx.checkSession()
          .then(res => {
            shouquanPhoneNo({ openId, encryptedData, iv, session_key: sessionKey, channelSite })
              .then(res => {
                if (res.state != 1) return reject({ state: 0, message: '解密失败' });
                const { purePhoneNumber } = JSON.parse(res.content.jiemi);
                wx.setStorage({ key: 'phoneNumber', data: purePhoneNumber });
                this.data.phoneNumber = purePhoneNumber;
                return resolve({ state: 1, phoneNumber: purePhoneNumber });
              })
              .catch(err => reject({ state: 0, message: '解密失败' }))
          })
          .catch(err => {
            wx.login()
              .then(({ code }) => {
                getSessionKey({ channelSite, relatedAppId, code })
                  .then(res => {
                    if (res.state != 1) return reject({ state: 0, message: '刷新sessionKey失败' });
                    const newSessionKey = res.content.sessionKey;
                    wx.setStorage({ key: 'sessionKey', data: newSessionKey });
                    this.data.sessionKey = newSessionKey;
                    shouquanPhoneNo({ openId, encryptedData, iv, session_key: newSessionKey, channelSite })
                      .then(res => {
                        if (res.state != 1) return reject({ state: 0, message: '解密失败' });
                        const { purePhoneNumber } = JSON.parse(res.content.jiemi);
                        wx.setStorage({ key: 'phoneNumber', data: purePhoneNumber });
                        this.data.phoneNumber = purePhoneNumber;
                        return resolve({ state: 1, phoneNumber: purePhoneNumber });
                      })
                      .catch(err => reject({ state: 0, message: '解密失败' }))
                  })
                  .catch(err => reject({ state: 0, message: '刷新sessionKey失败' }));
              })
              .catch(err => reject({ state: 0, message: '登录失败' }));
          })
      })
    })
  }
}
