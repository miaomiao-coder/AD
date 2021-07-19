// pages/index/index.js
var util = require('../../utils/util.js');
var settings = require('../../utils/settings.js');
var ad = require('../../utils/ad.js');
const api = require('../../utils/api.js');
var fun_base64 = require('../../utils/encrypt/base64.js')
let canRoll = false, lotteryArrLen = 6, num = 1;
var app = getApp();
let interstitialAd = null;
let rewardedVideoAd = null;
var base64 = new fun_base64.Base64();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lottery: [],
    msgList: [],
    animation: '',
    ciclewidth: 475,
    leftwidth: 0,
    propShow: false,
    rewardShow: false,
    isbtn: false,
    hasNum: 0,
    choosedReward: {},
    sysLoginInfo: {},
    unitName: settings.global.unit,
    awardLogId:0,
    wxName:"",
    userfee:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene)
    console.log("scene",scene);
    if(scene&&scene=="istest=1")
    {
      util.wxf.redirectTo("../home/index?from=test");
    }
    app.TellVersionCheck((headerInfo) => {
      let loginInfo=app.globalData.userInfo;
      var isWxAuth = util.wxf.getStorageSync("wxAuth");
      this.setData({
        sysLoginInfo: isWxAuth == 'yes' ? loginInfo : {username:loginInfo.username,a_username:base64.encode(base64.xor_encrypt(settings.global.loginkey, base64.encode(loginInfo.username)))},
        wxName:options.sourcename?options.sourcename:''
      });
      this.getfee(base64.encode(base64.xor_encrypt(settings.global.loginkey, base64.encode(loginInfo.username))),headerInfo);
      this.getLottery(headerInfo);
    })

    this.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 2000,
      timingFunction: 'ease',
      success: function (res) {
      }

    })
    this.setData({
      leftwidth: this.data.ciclewidth / 2 * Math.tan(Math.PI / lotteryArrLen)
    })
    // this.getpropAd();
  },
  getfee:function(UN,heardInfo)
  {
    var that=this;
    api.request.getFee({
      UN
    }, heardInfo, (res) => {
      console.log("getFee",res);
      if(res&&res.ret_result&&res.ret_result.ret_code==1)
      {
        that.setData({
          userfee:Number(res.userinfo.fee)+Number(res.userinfo.ticketfee)
        })
      }
    })
  },
  rotate: function () {
    if (canRoll) {
      let that = this;
      if (that.data.hasNum >= 3) {
        that.ShowProp(false);
      }
      else {
        let aniData = this.animation; //获取this对象上的动画对象
        this.getGoldId((prizeid) => {
          that.data.lottery.forEach((x, rightNum) => {
            if (x.id == prizeid) {
              console.log(`id是${prizeid}`);
              console.log(`随机数是${rightNum}`);
              console.log('奖品是：', that.data.lottery[rightNum]);
              console.log(360 * 5 + 360 / lotteryArrLen * rightNum);
              aniData.rotate(360 * 5 * num - 360 / lotteryArrLen * rightNum).step();
              that.setData({
                animation: aniData.export(),
                hasNum: that.data.hasNum + 1,
                choosedReward: that.data.lottery[rightNum]
              })
              num++;
              canRoll = false;
              return;
            }
          })
          //  let rightNum = ~~(Math.random() * lotteryArrLen); //生成随机数
          this.propShow();
        })

      }
    }

  },
  animationend: function () {
    //动画结束
    this.setData({
      rewardShow: true
    })
    //动画效果结束后才可重新点击抽奖
    canRoll = true;
  },
  toAuth: function () {
    var that = this;
    util.wxf.getUserInfo(function (userInfo) {
      that.requestUserDetail(userInfo);
    }, null, function () {
    });
  },
  getLottery: function (heardInfo) {
    var that = this;
    api.request.getLotteryList({
      ActivityId: settings.global.ActivityId
    }, heardInfo, (res) => {
      if (res && res.list) {
        that.setData({
          lottery: res.list.item
        })
        canRoll = true;
        for (let i = 0; i < res.list.item.length; i++) {
          let index = ~~(Math.random()*res.list.item.length);
          that.setData({
            msgList:that.data.msgList.concat(res.list.item[index].content)
          })
        }
      }
    })
  },
  requestUserDetail: function (loginInfo) {
    var that = this;
    app.getOpenId(function (session) {
      if (session && !util.common.isEmptyString(session)) {
        app.ApiLogin(loginInfo, function (loginInfo) {
          var isWxAuth = util.wxf.getStorageSync("wxAuth");
          console.log(loginInfo);
          that.setData({
            sysLoginInfo: loginInfo
          })
          app.setUserInfo(loginInfo);
        }, function () {
        });
      }
    });
  },
  ContinueRead: function () {
    this.ShowProp(true);
  },
  ShowProp: function (isbtn) {
    this.setData({
      propShow: true,
      isbtn: isbtn
    })
  },
  CloseProp: function () {
    this.setData({
      propShow: false,
      rewardShow: false
    })
  },
  toLog: function () {
    util.wxf.navigateTo("../lotteryLog/index");
  },
  RewardAd: function () {
    this.rewardShow();
  },
  getpropAd: function () {
    ad.adclass.InterstitialAd(interstitialAd, 1, (result) => {
      interstitialAd = result;
    });
    ad.adclass.RewardedVideoAd(rewardedVideoAd, 1, (result) => {
      rewardedVideoAd = result;
    }, () => {
      this.AddGold();
    });
    ad.adclass.GetTempleAdList((idList) => {
      this.setData({
        unitBottomid: idList[0]
      });
    }, 1, 1, 1)
  },
  AddGold: function () {
    var that = this;
    app.getHeaderInfo(function (headerInfo) {
      api.request.addLottery({
        ActivityId: settings.global.ActivityId,
        UN: that.data.sysLoginInfo.a_username,
        winawardid: base64.encode(base64.xor_encrypt(settings.global.encodeNameKey, base64.encode(that.data.awardLogId)))
      }, headerInfo, (res) => {
          if (res.ret_result.ret_code == 1) {
            util.wxf.showToast("恭喜获得"+that.data.choosedReward.content+that.data.unitName,"",2000);
            that.CloseProp();
            that.setData({
              userfee:Number(that.data.userfee)+Number(that.data.choosedReward.content)
            })
          }
      })
    })
  },
  getGoldId: function (success) {
    var that = this;
    app.getHeaderInfo(function (headerInfo) {
      api.request.getLotteryId({
        ActivityId: settings.global.ActivityId,
        UN: that.data.sysLoginInfo.a_username
      }, headerInfo, (res) => {
        if (res && res.detail) {
          var winawardid = base64.decode(base64.xor_encrypt(settings.global.namekey, base64.decode(res.detail.winawardid)));
          that.setData({awardLogId:winawardid})
          success(res.detail.prizeid);
        }
      })
    })
  },
  propShow: function () {
    ad.adclass.ShowAd(interstitialAd);
  },
  rewardShow: function () {
    var that = this;
    ad.adclass.ShowAd(rewardedVideoAd, 1, () => {
      //拉去广告失败
      util.wxf.showModal('暂无激励广告', '请稍后重试', () => {
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      selected: 0,
      showBar: true
    })
  }
      // this.propShow();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})