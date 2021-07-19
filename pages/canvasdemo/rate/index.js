// pages/canvasdemo/rate/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minsecond:20,
    setInter:"",
    rateName:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.drawClock();
    this.activePrize();
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
  drawClock: function () {
    var that = this;
    var bgcontext = wx.createCanvasContext('canvasProgressbg')
     // arc(x,y,半径,起始位置，结束位置，false为顺时针运动)
     bgcontext.beginPath();
    bgcontext.arc(60,60, 50, 0, 2* Math.PI, false)
    bgcontext.closePath();
    bgcontext.setLineWidth(3)
    bgcontext.setStrokeStyle('#e1e1e1')
    bgcontext.stroke()
    bgcontext.draw();
  },
  activePrize: function() {
    var that = this;
    const context2 = wx.createCanvasContext('canvasProgress')
    //将计时器赋值给setInter
    let num=0;
    if (that.data.minsecond > 0) {
      that.data.setInter = setInterval(
        function() {
          num++;
          var startAngle = 1.5 * Math.PI,
          endAngle = 0;
          endAngle = num * 2 * Math.PI / that.data.minsecond + 1.5 * Math.PI;
          context2.arc(60,60, 50, startAngle, endAngle, false)
          context2.setLineWidth(3)
          context2.setStrokeStyle('#ff5c4d')
          context2.stroke()
          context2.draw();
          that.setData({rateName:Math.round(num/that.data.minsecond*100)})
          if (num == that.data.minsecond) {
            clearInterval(that.data.setInter);
            return;
          }
        }, 1000);

    }
  }

})