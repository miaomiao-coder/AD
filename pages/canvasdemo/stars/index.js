// pages/canvasdemo/stars/index.js
let ctx=null;
let num=0;
let timer=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:0,
    height:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function (res) {
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight
        })

      }
    })
    ctx = wx.createCanvasContext('myCanvas')
    this.drawStars();
  },
  drawStars: function () {
    let potion = []
    for (var i = 0; i < 60; i++) {
      var x = Math.random() * 500;
      var y = Math.random() * 800;
      potion.push({ x: x, y: y })
    }
    var prevadd = false;
    var curAlpha = 1;
    timer= setInterval(() => {
      num++;
      for (var i = 0; i < potion.length; i++) {
        ctx.fillText("☆", potion[i].x, potion[i].y);
        ctx.fillStyle = "white";
      }
      if (prevadd) {
        prevadd = true;
        curAlpha = curAlpha + 0.25;
        if (curAlpha >= 1)
          prevadd = false;
      }
      else {
        curAlpha = curAlpha - 0.25;
        if (curAlpha <= 0.6)
          prevadd = true;
        console.log(prevadd);
      }

      console.log(num, curAlpha);
      curAlpha = Math.min(1, curAlpha);
      ctx.globalAlpha = curAlpha;

      ctx.draw();

      if (num == 100) {
        clearInterval(timer);
      }
    }, 1000);
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
    clearInterval(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer);
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