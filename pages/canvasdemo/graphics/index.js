// pages/canvasdemo/graphics/index.js
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mackcicle();
    this.mackrectangle();
    this.macktriangle();
    //x坐标，y坐标，长，宽, 圆角
    this.roundRect(10, 10, 200, 100, 20,"radiorectangle","#454C56");
    this.macksector(120,120,100,"sector");
  },
  mackcicle: function () {
   this.roundRect(10, 10, 120, 120, 60,"circle","#454C56");
  },
  mackrectangle: function () {
    var ctx = wx.createContext();//创建并返回绘图上下文context对象。
    ctx.beginPath();//开始一个新的路径
    //x坐标，y坐标，长，宽
    ctx.rect(10, 10, 200, 100);//添加一个长度为200px、宽度为为100px的矩形路径到当前路径
    ctx.setFillStyle("#454C56");
    ctx.fill();
    // ctx.stroke();//对当前路径进行描边
    // ctx.setStrokeStyle("#454C56");  //边框颜色
    ctx.closePath();//关闭当前路径
    wx.drawCanvas({
      canvasId: 'rectangle',//画布标识，对应
      actions: ctx.getActions()//导出context绘制的矩形路径并显示到页面
    })
  },
  macktriangle: function () {
    var ctx = wx.createContext();//创建并返回绘图上下文context对象。
    ctx.beginPath();//开始一个新的路径
    ctx.moveTo(10, 100)
    ctx.lineTo(210, 100)
    ctx.lineTo(110, 0)
    ctx.setFillStyle("#454C56");
    ctx.fill()
    ctx.closePath();//关闭当前路径
    wx.drawCanvas({
      canvasId: 'triangle',//画布标识，对应
      actions: ctx.getActions()//导出context绘制的矩形路径并显示到页面
    })
  },
  roundRect: function (x, y, w, h, r,id, c = '#454C56') {
    if (w < 2 * r) { r = w / 2; }
    if (h < 2 * r) { r = h / 2; }
    var ctx = wx.createContext();
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);

    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);

    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);

    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);

    ctx.fill();
    ctx.closePath();

    wx.drawCanvas({
      canvasId: id,//画布标识，对应
      actions: ctx.getActions()//导出context绘制的矩形路径并显示到页面
    })
  },
  macksector:function(x,y,r,id,c="#454C56"){
    var ctx = wx.createContext();
    var array = [30, 30, 30,30,60];
    var arrayposition = [];
    var colors = ["#228B22", "#008B8B","#ADFF2F","#22b6B4","#00bb33"];
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
      
      let width=r/2*Math.cos(start + array[i] / total * 2 * Math.PI/2)
      let height=r/2*Math.sin(start + array[i] / total * 2 * Math.PI/2)
      console.log(x+width,y+height);
      arrayposition.push({w:x+width,h:y+height});

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