// pages/canvas/index.js
const settings = require('../../utils/settings.js');
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  // ,{name:"阅读",url:"../home/index",color:"#F4ECEA"}
  data: {
    dataList:[{name:"时钟",url:"../canvasdemo/time/index",color:"#abb9c2"},{name:"转盘",url:"../canvasdemo/wheel/index",color:"#e3baba"},{name:"合成海报",url:"../canvasdemo/playbill/index",color:"#e7daeb"},{name:"弹力小球",url:"../canvasdemo/ball/index",color:"#83a09c"},{name:"基础图形",url:"../canvasdemo/graphics/index",color:"#e7daeb"},{name:"进度",url:"../canvasdemo/rate/index",color:"#abb9c2"},{name:"点赞",url:"../canvasdemo/zan/index",color:"#fae6ce"},{name:"中心旋转",url:"../canvasdemo/trans/index",color:"#e3baba"},{name:"气泡",url:"../canvasdemo/bezier/index",color:"#fae6ce"},{name:"星星",url:"../canvasdemo/stars/index",color:"#c5d9e6"},{name:"手写字体",url:"../canvasdemo/auto/index",color:"#e3baba"},{name:"统计报表",url:"../canvasdemo/static/index",color:"#83a09c"}],
    specialList:[{name:"左滑效果",url:"../special/leftsider/index",color:"#c4d0d5"}],
    unitName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ unitName: settings.global.unit });
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
        selected: 1,
        showBar: true
      })
    }
  },
  ToPage: function (e) { 
    let url = e.currentTarget.dataset.url;
    util.wxf.navigateTo(url);
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