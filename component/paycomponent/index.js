// component/paycomponent/index.js
var util = require('../../utils/util.js');
var settings = require('../../utils/settings.js');
const api = require('../../utils/api.js');
var fun_base64 = require('../../utils/encrypt/base64.js')
var app = getApp();
var base64 = new fun_base64.Base64();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached: function () {
      var that = this;
      // 在组件实例进入页面节点树时执行
      app.TellVersionCheck((headerInfo) => {
        if (settings.global.ispay) {
          let loginInfo = app.globalData.userInfo;
          that.getfee(base64.encode(base64.xor_encrypt(settings.global.loginkey, base64.encode(loginInfo.username))), headerInfo, () => {
            if (that.data.userfee < that.data.fee) {
              util.wxf.showModal("余额不足", "确认前往大转盘抽奖领取金币", () => {
                that.toIndex();
              }, () => {
                that.toBack()
              })
            }
            else {
              util.wxf.setStorageSync('usergold', that.data.userfee - that.data.fee);
            }
          });
        }
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    fee: 5,
    userfee: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getfee: function (UN, heardInfo, success) {
      var that = this;
      api.request.getFee({
        UN
      }, heardInfo, (res) => {
        console.log("getFee", res);
        if (res && res.ret_result && res.ret_result.ret_code == 1) {
          let usergold = util.wxf.getStorageSync('usergold');
          that.setData({
            userfee: Number(res.userinfo.fee) + Number(res.userinfo.ticketfee) - Number(usergold)
          })
          success();
        }
      })
    },
    toBack: function () {
      // util.wxf.navigateTo("../index/index")
      wx.navigateBack({
        delta: 1
      })
    },
    toIndex: function () {
      util.wxf.switchTab("../../index/index")
    }
  }
})
