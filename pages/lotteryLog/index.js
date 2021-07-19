const api = require("../../utils/api");
const util = require("../../utils/util");
var settings = require('../../utils/settings.js');
var ad = require('../../utils/ad.js');
var app = getApp();
var fun_base64 = require('../../utils/encrypt/base64.js')
var base64 = new fun_base64.Base64();
// pages/lotteryLog/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logList: [],
    pageIndex: 0,
    pageCount: 0,
    unitid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: function (res) {
        console.log("statusBarHeight",res.statusBarHeight);
      }});
      // ad.adclass.GetTempleAdList((idList) => {
      //   this.setData({
      //     unitid: idList[0]
      //   });
      //   console.log(idList[0]);
      // }, 2, 1)
   this.requestLogList(this.data.pageIndex);
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

  },
  toBack: function () {
    // util.wxf.navigateTo("../index/index")
    wx.navigateBack({
      delta: 1
    })
  },
  scrolltolowerEvent: function (e) {
    var pageIndex = this.data.pageIndex + 1;
    this.requestLogList(pageIndex);
  },
  requestLogList: function (pageIndex) {
    var that = this;
    console.log(pageIndex,that.data.pageCount,pageIndex > that.data.pageCount && that.data.pageCount != 0);
    if (pageIndex > that.data.pageCount && that.data.pageCount != 0)
      return;
    app.getHeaderInfo(function (headerInfo) {
      console.log(headerInfo);
      api.request.getLogList({
        pageIndex: pageIndex,
        pageSize: 10,
        ActivityId: settings.global.ActivityId,
        UN: base64.encode(base64.xor_encrypt(settings.global.loginkey, base64.encode(app.globalData.userInfo.username))),
      }, headerInfo, (res) => {
        if (!util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
          that.setData({
            logList: that.data.logList.concat(res.list.item),
            pageCount: res.list.pagecount,
            pageIndex: pageIndex
          })
        }
      })
    })
  }
})