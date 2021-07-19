// pages/canvasdemo/trans/index.js
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
    var cxt_rotate = wx.createContext();//创建并返回绘图上下文context对象。
    var rotate=0;//默认旋转角度为为0
    setInterval(function(){ //无限循环定时函数    
      cxt_rotate.translate(150,100);//设置坐标系坐标
      rotate++;//旋转角度自增1
      cxt_rotate.rotate(rotate*Math.PI/180)//设置旋转的角度
      cxt_rotate.rect(0,0,50,50)//设置坐标(0,0)，相对于坐标系坐标，边长为为50px的正方形
      cxt_rotate.stroke();//对当前路径进行描边
      wx.drawCanvas({
      canvasId:'canvasid',//画布标识，对应
      actions:cxt_rotate.getActions()//导出context绘制的直线并显示到页面
    });
    },1)   
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