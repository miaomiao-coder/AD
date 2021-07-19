var common = {
  formatTime: function(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds();

    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },
  formatNumber: function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  //判断传入的对象是否是函数
  isFunction: function(obj) {
    return typeof obj === 'function';
  },
  //去除字符串两头空格
  trim: function(str) {
    if (typeof(n) === 'string') {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    return str.toString().replace(/(^\s*)|(\s*$)/g, "");
  },
  log: function(message) {
    return;
    if (message) {
      console.log(message);
    }
  },
  logs: function(options) {
    return;
    var title = null;
    var message = null;

    if (options && !this.isEmptyObject(options)) {
      options = json.extend({}, [{
        title: null,
        message: null
      }, options], true);

      title = options.title;
      message = options.message;
    }

    if (title && !this.isEmptyString(title)) {
      console.log(" ------------------------------------ " + title + " ------------------------------------ ");
    }

    if (message) {
      console.log(message);
    }
  },
  isEmptyObject: function(e) {
    var t;
    for (t in e)
      return !1;
    return !0
  },
  isEmptyString: function(str) {
    return str == null || this.trim(str) == "" || this.trim(str).length == 0;
  },
  isNumber: function(n) {
    if (n && !common.isEmptyString(n)) {
      if (typeof(n) === 'number') {
        return true;
      } else if (typeof(n) === 'string') {
        return !isNaN(common.toNumber(n));
      } else {
        return !isNaN(common.toNumber(common.toString(n)));
      }
    }

    return false;
  },
  toString: function(str) {
    if (!common.isEmptyString(str)) {
      return str.toString();
    }

    return '';
  },
  toNumber: function(str) {
    if (!common.isEmptyString(str)) {
      return Number(str);
    }

    return 0;
  },
  getQueryString: function(url, name) {
    url = url.toLowerCase();
    name = name.toLowerCase();
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var index = url.indexOf("?");
    if (index != -1) {
      var r = url.substr(index + 1).match(reg);
      if (r != null) return unescape(r[2]);
    }
    return null;
  },
  randomNum: function (minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  } ,
  /**获取最大最小之前随机值的整数 */
  getRandomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
  },
}
var _keyStr = "2015ChatReaderUserloginKey"
var wxf = {
  request: function(url, data, header, success, error, fail, complete) {
    wx.request({
      url: url || {},
      data: data || {},
      header: json.extend({}, [{
        'content-type': 'application/json'
      }, header], true),
      success: function(res) {
        common.logs({
          title: 'wx.request success',
          message: res
        });
        if (res && !common.isEmptyObject(res) && !common.isEmptyObject(res.data)) {
          common.logs({
            title: 'wx.request success result',
            message: res.data.ret_result
          });
          if (!common.isEmptyObject(res.data.ret_result)) {
            common.logs({
              title: 'wx.request success result.code',
              message: res.data.ret_result.ret_code
            });
            if (res.data.ret_result.ret_code == 1) {
              common.isFunction(success) && success(res.data);
            } else {
              common.isFunction(error) && error(res.data.ret_result.ret_code, res.data.ret_result.ret_message);
            }
          } else {
            common.isFunction(success) && success(res.data);
          }
        }
      },
      fail: function() {
        common.logs({
          title: 'wx.request fail'
        });
        common.isFunction(fail) && fail();
      },
      complete: function() {
        common.logs({
          title: 'wx.request complete'
        });
        common.isFunction(complete) && complete();
      }
    })
  },
  checkSession: function(success, fail) {
    wx.checkSession({
      success: function() {
        //登录态未过期
        console.log("sessionkey未过期");
        common.isFunction(success) && success()
      },
      fail: function() {
        //登录态过期
        console.log("sessionkey已过期");
        common.isFunction(fail) && fail()
      }
    })
  },
  login: function(success, fail) {
    //调用登录接口
    wx.login({
      success: function(res) {
        common.logs({
          title: 'wx.login',
          message: res
        });
        if (res &&
          !common.isEmptyObject(res) &&
          !common.isEmptyString(res.code)) {
          common.isFunction(success) && success(res.code)
        } else {
          common.isFunction(fail) && fail()
        }
      }
    })
  },
  getUserInfo: function (success, fail, wxFail) {
    console.log("getUserProfile", wx.getUserProfile);
    wx.getUserProfile({
        desc: '获取用户详情',
        success: function (res) {
          console.log("授权结果", res);
          if (res && !common.isEmptyObject(res)) {
            common.isFunction(success) && success(res)
          } else {
            common.isFunction(fail) && fail()
          }
        },
        fail: function () {
          common.isFunction(wxFail) && wxFail()
        }

      })
  },
  getStorageInfoSync: function(cb) {
    try {
      var res = wx.getStorageInfoSync();
      common.isFunction(cb) && cb(res);
    } catch (e) {
      common.logs({
        title: 'wx.getStorageInfoSync',
        message: e
      });
    }
  },
  getStorageSync: function(key) {
    if (!common.isEmptyString(key)) {
      try {
        return wx.getStorageSync(key) || [];
      } catch (e) {
        common.logs({
          title: 'wx.getStorageSync',
          message: e
        });
      }
    }

    return [];
  },
  setStorageSync: function(key, data) {
    if (!common.isEmptyString(key)) {
      try {
        wx.setStorageSync(key, data);
      } catch (e) {
        common.logs({
          title: 'wx.setStorageSync',
          message: e
        });
      }
    }
  },
  removeStorageSync: function(key) {
    try {
      if (!common.isEmptyString(key)) {
        wx.removeStorageSync(key)
      }
    } catch (e) {
      common.logs({
        title: 'wx.removeStorageSync',
        message: e
      });
    }
  },
  clearStorageSync: function() {
    try {
      wx.clearStorageSync()
    } catch (e) {
      common.logs({
        title: 'wx.clearStorageSync',
        message: e
      });
    }
  },
  navigateTo: function(url, success, fail, complete) {
    if (!common.isEmptyString(url)) {
      wx.navigateTo({
        url: url,
        success: success,
        fail: fail,
        complete: complete
      });
    }
  },
  redirectTo: function(url, success, fail, complete) {
    if (!common.isEmptyString(url)) {
      wx.redirectTo({
        url: url,
        success: success,
        fail: fail,
        complete: complete
      });
    }
  },
  switchTab: function(url, success, fail, complete) {
    if (!common.isEmptyString(url)) {
      wx.switchTab({
        url: url,
        success: success,
        fail: fail,
        complete: complete
      });
    }
  },
  showToast: function(title, icon, duration) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  },
  hideToast: function() {
    wx.hideToast();
  },
  showModal: function(title, content, yes, no) {
    wx.showModal({
      title: title,
      content: content,
      success: function(res) {
        if (res.confirm) {
          common.isFunction(yes) && yes(res);
        } else {
          common.isFunction(no) && no(res);
        }
      }
    })
  },
  setScreenBrightness: function(value) {
    wx.setScreenBrightness({
      value: value / 100
    })
  },
  getSystemInfo: function(cb) {
    wx.getSystemInfo({
      success: function(res) {
        common.logs({
          title: 'wx.getSystemInfo',
          message: res
        });
        if (res && !common.isEmptyObject(res)) {
          common.isFunction(cb) && cb(res);
        }
      }
    })
  },
  getNetworkType: function(success, fail, complete) {
    wx.getNetworkType({
      success: function(res) {
        common.logs({
          title: 'wx.getNetworkType',
          message: res
        });
        // 返回网络类型2g，3g，4g，wifi
        if (res && !common.isEmptyObject(res) && !common.isEmptyString(res.networkType)) {
          common.isFunction(success) && success(res.networkType);
        }
      },
      fail: function() {
        common.isFunction(fail) && fail();
      },
      complete: function() {
        common.isFunction(complete) && complete();
      }
    })
  },
  setNavigationBarTitle: function(title, success, fail, complete) {
    wx.setNavigationBarTitle({
      title: title,
      success: success,
      fail: fail,
      complete: complete
    })
  },
  setNavigationBarBackgroundColor:function(color){
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
  })
  },
  showNavigationBarLoading: function() {
    wx.showNavigationBarLoading()
  },
  hideNavigationBarLoading: function() {
    wx.hideNavigationBarLoading()
  },
  onShareAppMessage: function(fromtype, title, path, success, fail, complete) {
    if (res.from === fromtype) {
      console.log(res.target)
    }
    return {
      title: title,
      path: path,
      success: success,
      fail: fail,
      complete: complete
    }
  },
  getSetting: function(success, fail, complete) {
    wx.getSetting({
      success: function(res) {
        if (common.isFunction(success)) {
          success(res);
        }
      },
      fail: function() {
        common.isFunction(fail) && fail();
      },
      complete: function() {
        common.isFunction(complete) && complete();
      }
    })
  },
  openSetting: function(success, fail, complete) {
    wx.openSetting({
      success: function(res) {
        if (common.isFunction(success)) {
          success(res);
        }
      },
      fail: function() {
        common.isFunction(fail) && fail();
      },
      complete: function() {
        common.isFunction(complete) && complete();
      }
    })
  },
  navigateToMiniProgram:function(appid,path,extraData,success){
    wx.navigateToMiniProgram({
      appId: appid,
      path: path,
      extraData: extraData|| {},
      envVersion: 'develop',
      success(res) {
        // 打开成功
        success();
      }
    })
  }
}

var json = {
  extend: function(des, src, override) {
    if (src instanceof Array) {
      for (var i = 0, len = src.length; i < len; i++)
        this.extend(des, src[i], override);
    }
    for (var i in src) {
      if (override || !(i in des)) {
        des[i] = src[i];
      }
    }
    return des;
  }
}

module.exports = {
  common: common,
  wxf: wxf,
  json: json
}