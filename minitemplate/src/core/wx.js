
const noPromiseMethods = {
  clearStorage: 1,
  hideToast: 1,
  showNavigationBarLoading: 1,
  hideNavigationBarLoading: 1,
  drawCanvas: 1,
  hideKeyboard: 1,
  getSystemInfo: 1,
  openSetting: 1,
  setClipboardData: 1,
  onPullDownRefresh: 1,
  imgPreview: 1,
  switchTab: 1,
  getBackgroundAudioManager: 1,
  stopBackgroundAudio: 1,
  reportAnalytics: 1,
  getRecorderManager: 1,
};

const _wx = {};

Object.keys(wx).forEach((key) => {
  if (
    noPromiseMethods[key]                        // 特别指定的方法
    || /^(on|create|stop|pause|close)/.test(key) // 以on* create* stop* pause* close* 开头的方法
    || /\w+Sync$/.test(key)                      // 以Sync结尾的方法
  ) {

    // 不进行Promise封装
    _wx[key] = function () {
      return wx[key].apply(wx, arguments);
    };
  } else {
    // 其余方法自动Promise化
    _wx[key] = function (obj) {
      obj = obj || {};
      return new Promise((resolve, reject) => {
        obj.success = resolve;
        obj.fail = (res) => {
          if (res && res.errMsg) {
            reject(new Error(res.errMsg));
          } else {
            reject(res);
          }
        };
        wx[key](obj);
      });
    };
  }
});

export default _wx;