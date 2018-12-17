
import req from '../../common/request';
import wx from '../../core/wx';

const app = getApp();
const sendFormId = data => req.post('course-user/sendFormId', { data });
const updateUserInfo = data => req.post('course-user/updateUserInfo', { data });

Component({
  externalClasses: ['form-class', 'btn-class', 'my-class', 'my-hover-class'],
  properties: {
    urlType: {
      type: 'string',
      value: 'navigate',
    },
    url: {
      type: 'string',
      value: '',
    },
    btnType: {
      type: 'string',
      value: '',
    },
    myOpenType: {
      type: 'string',
      value: '',
    },
    myStyle: {
      type: 'string',
      value: '',
    },
    myId: {
      type: 'string',
      value: '',
    },
  },
  relations: {
    '../headBar/headBar': {
      type: 'parent',
    },
  },
  data: {
    userInfoAuth: false,
  },
  lifetimes: {
    attached: function() {
      let that = this;
      // 在组件实例进入页面节点树时执行
      wx.getSetting({
        complete(res) {
          if (res.authSetting['scope.userInfo']) {
            that.setData({ userInfoAuth: true })
          } else {
            that.setData({ userInfoAuth: false })
          }
        },
      })
    },
  },
  methods: {
    handleSubmit(e) {
      const formId = e.detail.formId;
      app.global((err, { openId }) => {
        if (err) return false;
        const data = { form_id: formId, touser: openId };
        sendFormId(data);
        if (this.dataset.key) {
          app.report(this.dataset.key);
        }
        this.triggerEvent('mytap', this.dataset);
        const { url, urlType, myOpenType } = this.properties;
        console.info('url...', url);
        if (!!url && !myOpenType) {
          switch (urlType) {
            case 'switchTab':
              wx.switchTab({ url });
              break;
            case 'redirect':
              wx.redirectTo({ url });
              break;
            case 'reLaunch':
              wx.reLaunch({ url });
              break;
            case 'navigateBack':
              wx.navigateBack({ delta: url });
              break;
            default:
              switch (url) {
                case '/pages/index/index':
                case '/pages/mine/mine':
                  wx.reLaunch({ url });
                  break;
                default:
                  wx.navigateTo({ url });
                  break;
              }
              break;
          }
        }
      });
    },
    handleUserInfo(e) {
      const errMsg = e.detail.errMsg;
      if (errMsg !== 'getUserInfo:ok') {
        return;
      }
      this.triggerEvent('userInfo', e);
      app.global((err, { openId }) => {
        updateUserInfo({ ...e.detail.userInfo, openId });
        this.setData({
          userInfoAuth: true,
        })
        this.handleSubmit(e);
      })
    },
    handleOpenSetting(e) {
      this.triggerEvent('openSetting', e);
    },
    handlephonenumber(e) {
      this.triggerEvent('phonenumber', e);
    },
    handleTap(e) {
      this.triggerEvent('tap', e);
    },
  },
})
