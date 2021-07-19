var util = require('./utils/util.js');
var api = require('./utils/api.js');
var fun_md5 = require('./utils/encrypt/md5.js')
var fun_sha1 = require('./utils/encrypt/sha1.js')
var fun_base64 = require('./utils/encrypt/base64.js')
var fun_aes = require('./utils/encrypt/aes.js');
const settings = require('./utils/settings.js');

//app.js
App({
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    /*var logs = util.wxf.getStorageSync('logs')
     logs.unshift(Date.now())
     util.wxf.setStorageSync('logs', logs)*/
     var that = this;
    if (options.query) {
      var parentid = options.query.parentid;
      that.globalData.parentid = parentid;
    }
 
    that.versionCheck((headerInfo) => {
      // that.getUser((loginInfo) => { 
      //   that.GetFirstUser(loginInfo,headerInfo);
      // });
    });



  },
  GetVersionCheckHeader: function (headerInfo,setbarTitle) {

  },
  GetFirstUser: function (loginInfo) {
    
  },
  getUserInfo: function (success) {
    var that = this;
    if (that.globalData.userInfo && !util.common.isEmptyObject(that.globalData.userInfo)) {
      success(that.globalData.userInfo);
    }
    else {
      // that.getUser((logininfo) => { console.log(logininfo); success(logininfo); });
    }
  },
  setUserInfo:function(userInfo)
  {
    var that = this;
    that.globalData.userInfo = userInfo;
    if (that.globalData.loginInfo && !util.common.isEmptyObject(that.globalData.loginInfo)) {
      that.globalData.loginInfo.nickname = userInfo.nickName;
      that.globalData.loginInfo.mynickname = userInfo.nickName;
    }
  },
  addGold: function () {
    var that = this;
    api.request.getGold({
      UN: that.globalData.loginInfo.username,
      RuleType: 6,
      ParentId: that.globalData.parentid
    }, {},
      (res) => {
        if (!util.common.isEmptyObject(res)) {
          if (res.ret_result.ret_code == 1) { }
        } else { }
      },
      function () { }
    );
  },
  onError: function (message) {
    util.common.logs({
      title: 'onError',
      message: message
    });
  },
  TellOpts:function(value,success)
  {
    let formvalue=util.wxf.getStorageSync('prevvalue');
    console.log("formvalue",formvalue,value);
    if(formvalue&&formvalue=="test")
    {
      success();
    }
    else if(value&&value=="test")
    {
      console.log("formvalue",formvalue);
      util.wxf.setStorageSync('prevvalue',value);
      success()
    }
    console.log("formvalue",formvalue);
  },
TellVersionCheck:function(loading){
  if (this.globalData.hasversionCheck == 1) {
    loading(this.globalData.headerInfo, (title) => {
      this.setBarTitle(title);
      console.log("TellVersionCheck", title);
    });
  }
  else {
    this.GetVersionCheckHeader = loading;
  }
},
TellGetUser:function(loading){
  if (this.globalData.loginInfo && !util.common.isEmptyObject(this.globalData.loginInfo)) {
    loading(this.globalData.loginInfo,this.globalData.headerInfo);
  }
  else{
  this.GetFirstUser = loading;
  }
},
  versionCheck: function (success) {
    var that = this;
    that.getHeaderInfo(function (headerInfo) {
      api.request.versionCheck({}, headerInfo, function (clientInfo) {
        util.common.logs({
          title: 'app.versioncheck.clientinfo.clientid',
          message: clientInfo.clientid
        });
        if (JSON.stringify(clientInfo).indexOf("mynickname") > 0) {
          clientInfo = JSON.parse(clientInfo.replace("{mynickname}", "\"\""));
          // that.globalData.navigationBarTitle = "免费阅读";
          that.globalData.userInfo = clientInfo.userinfo;
          util.wxf.setStorageSync('users', clientInfo.userinfo);
        }
        else{
          that.globalData.userInfo=util.wxf.getStorageSync('users');
        }
        console.log("navigationBarTitle1",that.globalData.navigationBarTitle);
        if (clientInfo && clientInfo.clientid > 0) {
          headerInfo = util.json.extend({}, [headerInfo, {
            clientId: util.common.toString(clientInfo.clientid)
          }], true);
          that.setHeaderInfo(headerInfo);
          util.common.logs({
            title: 'page.versionCheck.headerInfo',
            message: headerInfo
          });
          util.wxf.setStorageSync('clientId', clientInfo.clientid);
        
          // util.wxf.setStorageSync('isPay', clientInfo.wxapp.ispay);
          success(headerInfo);
          that.globalData.hasversionCheck = 1;
          that.GetVersionCheckHeader(headerInfo,(title)=>{that.setBarTitle(title)});
          console.log("1");
        } else {
          // 版本验证失败
          // util.wxf.navigateTo('/pages/logs/logs');
        }
      });
    }, true);
  },
  setBarTitle:function(title=this.globalData.navigationBarTitle)
  {
    console.log("navigationBarTitle",title);
    util.wxf.setNavigationBarTitle(title)
  },
  getWXSession: function (cb) {
    var that = this;
    util.wxf.login(function (code) {
      that.getHeaderInfo(function (headInfo) {
        api.request.getSession({
          code: code,
          wxaid:settings.global.wxaid
        }, headInfo, function (sessionInfo) {
          if (sessionInfo &&
            !util.common.isEmptyObject(sessionInfo.ret_result) &&
            sessionInfo.ret_result.ret_code == 1 &&
            !util.common.isEmptyObject(sessionInfo) &&
            !util.common.isEmptyString(sessionInfo.session)) {
            that.globalData.session = sessionInfo.session;
            util.common.isFunction(cb) && cb(sessionInfo.session)
          }
        });
      })
    }, function () {
      //微信登录失败.
    });


  },
  getUser: function (cb) {
    //获取缓存session
    //无session则微信登录并获取openid相关信息
    //有则判断session是否过期
    //未过期则使用session获取用户信息（获取信息失败则重新登录获取）
    //过期则重新微信登录并获取openid信息
    var that = this;
    var session = util.wxf.getStorageSync("session");
    if (!util.common.isEmptyString(session)) {
      console.log("缓存有session");
      that.globalData.session = session;
      that.checkSession(() => {
        //用户信息赋值
        console.log("session未过期", session);
        that.getHeaderInfo(function (headInfo) {
          api.request.getUser({
            session: encodeURIComponent(session)
          }, headInfo, function (res) {
            console.log("getuserapi",res);
            if (res && !util.common.isEmptyObject(res) &&
              !util.common.isEmptyObject(res.ret_result) &&
              res.ret_result.ret_code == 1 &&
              !util.common.isEmptyObject(res.userinfo)) {
              that.globalData.loginInfo = res.userinfo;
              util.common.isFunction(cb) && cb(that.globalData.loginInfo)
            }
            else {
              that.getOpenId(function (session, userinfo) {
                util.common.isFunction(cb) && cb(userinfo)
              }, 0);
            }
          });
        });
      }, () => {
        //session过期，重新登录
        console.log("session过期");
        that.getOpenId(function (session, userinfo) {
          util.common.isFunction(cb) && cb(userinfo)
        }, 0);
      });

    } else {
      console.log("无session");
      that.getOpenId(function (session, userinfo) {
        util.common.isFunction(cb) && cb(userinfo)
      }, 0);
    }
  },
  checkSession: function (success, fail) {
    var that = this;
    util.wxf.checkSession(function () {
      //登录态未过期
      var session = that.globalData.session; // v1.0.2
      if (session && !util.common.isEmptyString(session)) {
        that.getHeaderInfo(function (headInfo) {
          api.request.sessionCheck({
            session: encodeURIComponent(session)
          }, headInfo, function (res) {
            if (res &&
              !util.common.isEmptyObject(res) &&
              res.status == 0) {
              //登录态过期
              console.log("登录过期1");
              util.common.isFunction(fail) && fail();
            } else {
              console.log("checksession成功",res); 
              util.common.isFunction(success)&&success(session);
            }
          }, function () { util.common.isFunction(fail) && fail();console.log("checksession错误"); })
        })
      } else {
        console.log("登录过期2");
        util.common.isFunction(fail) && fail();
      }
    }, function () {
      //登录态过期
      console.log("登录过期3");
      util.common.isFunction(fail) && fail();
    })
  },
  getOpenId: function (cb, parentId) {
    var that = this;
    util.wxf.login(function (code) {
      console.log("新code", code);
      that.getHeaderInfo(function (headerInfo) {
        api.request.getSession({
          code: code,
          wxaid:settings.global.wxaid,
          logintype: 1,
          parentId: that.globalData.parentid ? that.globalData.parentid : 0
        }, headerInfo, function (sessionInfo) {
          if (sessionInfo &&
            !util.common.isEmptyObject(sessionInfo.ret_result) &&
            sessionInfo.ret_result.ret_code == 1 &&
            !util.common.isEmptyObject(sessionInfo) &&
            !util.common.isEmptyString(sessionInfo.session)) {
            that.globalData.loginInfo = sessionInfo.userinfo;
            that.globalData.session = sessionInfo.session;
            util.wxf.setStorageSync("session", sessionInfo.session);
            util.common.isFunction(cb) && cb(sessionInfo.session, sessionInfo.userinfo)
          }
        });
      });
    });
  },
  isLogin: function (success, fail) {
    var that = this;
    if ((this.globalData.userInfo && !util.common.isEmptyObject(this.globalData.userInfo))) {
      util.common.isFunction(success) && success(that.globalData.userInfo)
    }
    else {
      util.common.isFunction(fail) && fail()
    }
  },
  ApiLogin: function (userInfo, success, fail) {
    var that=this;
    var base64 = new fun_base64.Base64();

    that.getHeaderInfo(function (headInfo) {
      api.request.login({
        un:base64.encode(base64.xor_encrypt(settings.global.loginkey, base64.encode(that.globalData.loginInfo.username))),
        session: encodeURIComponent(that.globalData.session),
        rawdata: encodeURIComponent(userInfo.rawData),
        signature: encodeURIComponent(userInfo.signature),
        encrypteddata: encodeURIComponent(userInfo.encryptedData),
        iv: encodeURIComponent(userInfo.iv)
      }, headInfo, function (loginInfo) {
        if (loginInfo &&
          !util.common.isEmptyObject(loginInfo.ret_result) &&
          loginInfo.ret_result.ret_code == 1 &&
          !util.common.isEmptyObject(loginInfo.userinfo)) {
          that.globalData.loginInfo = loginInfo.userinfo;
          util.wxf.setStorageSync("wxAuth", 'yes');
          util.common.isFunction(success) && success(loginInfo.userinfo)
        }
      });
    })
  },
  getClientId: function (cb) {
    var that = this;

    var clientId = 0;
    if (this.globalData.headerInfo &&
      !util.common.isEmptyObject(this.globalData.headerInfo) &&
      this.globalData.headerInfo.clientId > 0) {
      clientId = util.common.toNumber(this.globalData.headerInfo.clientId)
    } else {
      var storageClientId = util.wxf.getStorageSync('clientId')
      if (storageClientId &&
        util.common.isNumber(storageClientId) &&
        storageClientId > 0) {
        clientId = storageClientId;
      }
    }

    util.common.logs({
      title: 'app.getClientInfo.clientId',
      message: clientId
    });
    util.common.isFunction(cb) && cb(clientId);
  },
  getHeaderInfo: function (cb, isVersionCheck) {
    var that = this;
    if (this.globalData.headerInfo && !util.common.isEmptyObject(this.globalData.headerInfo)) {
      var ua = "";
      that.getSystemInfo(function (res) {
        ua = res.model;
      });
      var headerInfo = util.json.extend({}, [that.globalData.headerInfo, {
        ua: ua
      }], true);
      if (headerInfo && !util.common.isEmptyObject(headerInfo)) {
        that.globalData.headerInfo = headerInfo
        util.common.isFunction(cb) && cb(headerInfo);
      }
    } else {
      var headerInfo = api.request.headerInfo;
      util.common.logs({
        title: 'app.getHeaderInfo.default.headerInfo',
        message: headerInfo
      });
      var clientId = 0;
      that.getClientId(function (res) {
        clientId = res;
      });

      var ua = "";
      that.getSystemInfo(function (res) {
        ua = res.model;
      });
      if (clientId > 0) {
        headerInfo = util.json.extend({}, [headerInfo, {
          ua: ua,
          clientId: util.common.toString(clientId)
        }], true);
        util.common.logs({
          title: 'app.getHeaderInfo.storage.headerInfo',
          message: headerInfo
        });
      }

      if (headerInfo &&
        !util.common.isEmptyObject(headerInfo) &&
        !util.common.isEmptyString(headerInfo.v) &&
        (isVersionCheck || (!isVersionCheck && util.common.isNumber(headerInfo.clientId) && headerInfo.clientId > 0))) {
        that.globalData.headerInfo = headerInfo;
        util.common.isFunction(cb) && cb(headerInfo);
      }
    }
  
  },
  setHeaderInfo: function (headerInfo) {
    var that = this;

    that.globalData.headerInfo = headerInfo;
  },
  getSystemInfo: function (cb) {
    var that = this;

    if (this.globalData.systemInfo) {
      util.common.isFunction(cb) && cb(this.globalData.systemInfo);
    } else {
      util.wxf.getSystemInfo(function (res) {
        that.globalData.systemInfo = res;
        util.common.isFunction(cb) && cb(res);
      })
    }
  },
  getNetworkType: function (success, fail) {
    var that = this;

    util.wxf.getNetworkType(function (res) {
      that.globalData.networkType = res.networkType;
      util.common.isFunction(success) && success(res.networkType);
    }, function () {
      util.common.isFunction(fail) && fail();
    })
  },
  getShareMessage: function (success) {
    this.getHeaderInfo(function (headInfo) {
      api.request.getGoldShareInfo({}, headInfo, (data) => {
        if (data.detail) {
          util.common.isFunction(success) && success(data.detail);
        }
      });
    });
  },
  globalData: {
    parentid: 0,
    headerInfo: null,
    session: null,
    userInfo: null,
    loginInfo: null,
    systemInfo: null,
    ruletype: 0,
    navigationBarTitle:'',
    hasversionCheck:0
  }
})