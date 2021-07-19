// pages/canvasdemo/ball/index.js

var diameter = 10
var time = 0
var setInter="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:0,
    height:0,
    numX:1,
    numY:1
  },
  xy:{
    //小球的xy坐标
    x:10,
    y:10
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取系统信息  
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function (res) {
        that.width = res.windowWidth
        // console.log(that.width)   375
        that.height = res.windowHeight
        // console.log(that.height)  625
        // 这里的单位是PX，实际的手机屏幕有一个Dpr，这里选择iphone，默认Dpr是2
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      //随机一个滚动的速度
      time = (1+Math.random()*10)
      setInter=setInterval(this.move,time);
      // this.move();
  },
  move(){
    //x 
    if(this.data.numX == 1){
      this.xy.x++
    }else{
      this.xy.x--
    }
 
    //判断x轴的状态
    if(this.xy.x == this.width-diameter){
       this.data.numX=2
    }
    if(this.xy.x == diameter){
       this.data.numX=1
    }
 
    //y
    if(this.data.numY == 1){
       this.xy.y++
    }else{
       this.xy.y--
    }
 
    //判断y轴的状态
    if(this.xy.y == this.height-diameter){
       this.data.numY=2
    }
    if(this.xy.y == diameter){
       this.data.numY=1
    }
 
    //画图
    this.ballMove(this.xy.x,this.xy.y);
  },
 
 
  ballMove(x,y){
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createContext()
    // context.setShadow(0,1,6,'#000000')//阴影效果
    context.setFillStyle("#FF4500")//球的颜色
    context.setLineWidth(2)
    context.arc(x, y, diameter, 0, 2 * Math.PI, true)
    context.fill()
 
    // 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为
    wx.drawCanvas({
      canvasId: 'ball',
      actions: context.getActions() // 获取绘图动作数组
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
    clearTimeout(setInter);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(setInter);
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