
import wx from '../core/wx';
import { sortByKey } from './utils';
import ENV from '../config';
import qs from 'qs';
import md5 from 'md5';

const methods = ['get', 'post', 'put', 'delete'];

// 生成sig
export const encryptMD5 = (value, key) => {
  let apiKey = 'string';
  if (key) apiKey = key;
  if (qs.stringify(sortByKey(value))) {
    return md5(`${apiKey}&${qs.stringify(sortByKey(value), { encode: false })}`)
  } else {
    return md5(apiKey);
  }
};

// 格式化URL
const formateUrl = url => /^http/.test(url) ? url : `${ENV.API}${url}`;

const req = {};
methods.forEach(method => {
  req[method] = (url, obj) => {
    const { brand, model, language, version, system, platform } = wx.getSystemInfoSync();
    let data = {};
    let header = {};
    if (obj && obj.data) {
      data = obj.data;
    }
    header = {
      "_ts": new Date().getTime(),
      brand,
      model,
      language,
      version,
      system,
      platform,
      appId: ENV.APPID,
    }
    const apiKey = 'string';
    header['content-type'] = "application/json";
    if (method == 'get') {
      header['sig'] = encryptMD5(data, apiKey);
    } else {
      header['sig'] = md5(`${JSON.stringify(data)}${apiKey}`);
    }
    if (obj && obj.header) {
      header = { ...header, ...obj.header };
    }
    if (ENV.version) {
      header['XReleaseVersion'] = ENV.version;
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: formateUrl(url),
        method,
        data,
        header,
      }).then(res => resolve(res.data)).catch(err => {
        wx.reportAnalytics('request_fail', {
          url: formateUrl(url),
          header,
        })
        reject(err)
      });
    })
  }
})
export default req;
