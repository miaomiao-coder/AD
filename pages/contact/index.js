// pages/contact/index.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "../home/index",
    name:"关于我们",
    classname:"清理缓存"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
     this.setData({name:"免费阅读",classname:"分类"})
    }
  },
  routeToPage:function(e){
    let url = e.currentTarget.dataset.url
    util.wxf.navigateTo(url);
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

  }
})