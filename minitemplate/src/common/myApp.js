
/**
 * 插入自定义方法
 * @param {object} t 原生参数
 * @param {string} n 事件名称
 * @param {function} o 追加方法
 */
function e(t, n, o) {
  if (t[n]) {
    var e = t[n];
    t[n] = function (t) {
      o.call(this, t, n), e.call(this, t)
    }
  } else
    t[n] = function (t) {
      o.call(this, t, n)
    }
}

/**
 * 分享自定义方法
 * @param {object} t 原生参数
 * @param {string} a 事件名称
 * @param {function} e 追加方法
 */
function f(t, a, e) {
  if (t[a]) {
    var s = t[a];
    t[a] = function (t) {
      var n = s.call(this, t);
      e.call(this, [t, n], a);
      return n
    }
  } else {
    t[a] = function (t) {
      e.call(this, t, a)
    }
  }
}

/**
 *
 * @param {*} t
 * @param {*} a
 */
function pageShow(t, a) {
  const app = getApp();
  app.report(`${this.route}_page_times`);
  const { pageLink } = app.data;
  pageLink.push(this.route);
  console.info(pageLink);
}

function pageReady(t, a) {
}

function pageHide(t, a) {
}

function pageUnload(t, a) {
}

/**
 * onShow
 */
function pageScroll(e) {

}


const _App = App;
App = function (t) {
  _App(t);
}

const _Page = Page;
Page = function (t) {
  e(t, 'onShow', pageShow);
  e(t, 'onReady', pageReady);
  e(t, 'onHide', pageHide);
  e(t, 'onUnload', pageUnload);
  e(t, 'onPageScroll', pageScroll);
  _Page(t);
}
