// pages/canvasdemo/static/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.macksector(120, 120, 100, "sector");
  },
  macksector: function (x, y, r, id, c = "#454C56") {
    var ctx = wx.createContext();
    var array = [30, 30, 30, 30, 60];
    var arrayposition = [];
    var colors = ["#228B22", "#008B8B", "#ADFF2F", "#22b6B4", "#00bb33"];
    var total = 0;
    for (var val = 0; val < array.length; val++) {
      total += array[val];
    }
    for (var i = 0; i < array.length; i++) {
      ctx.beginPath();
      var start = 0;
      if (i > 0) {
        for (var j = 0; j < i; j++) {
          start += array[j] / total * 2 * Math.PI;
        }
      }

      let width = r / 2 * Math.cos(start + array[i] / total * 2 * Math.PI / 2)
      let height = r / 2 * Math.sin(start + array[i] / total * 2 * Math.PI / 2)
      console.log(x + width, y + height);
      arrayposition.push({ w: x + width, h: y + height });

      ctx.arc(x, y, r, start, start + array[i] / total * 2 * Math.PI, false);
      ctx.setLineWidth(2)
      ctx.lineTo(x, y);
      ctx.setStrokeStyle('#F5F5F5');
      ctx.setFillStyle(colors[i]);
      ctx.fill();
      ctx.closePath();
      ctx.stroke();
    }
    for (var i = 0; i < array.length; i++) {
      ctx.setFillStyle('red')
      ctx.setFontSize(20)
      ctx.fillText(array[i], arrayposition[i].w, arrayposition[i].h);
      ctx.setTextAlign('center')
    }
    wx.drawCanvas({
      canvasId: id,//画布标识，对应
      actions: ctx.getActions()//导出context绘制的矩形路径并显示到页面
    })
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