// pages/canvasdemo/wheel/index.js
var util = require('../../../utils/util.js')
var backgroundText = [
  { "jing": "肝经", "shi": "丑时" },
  { "jing": "肺经", "shi": "寅时" },
  { "jing": "大肠经", "shi": "卯时" },
  { "jing": "胃经", "shi": "辰时" },
  { "jing": "脾经", "shi": "巳时" },
  { "jing": "心经", "shi": "午时" },
  { "jing": "小肠经", "shi": "未时" },
  { "jing": "膀胱经", "shi": "申时" },
  { "jing": "肾经", "shi": "酉时" },
  { "jing": "心包经", "shi": "戌时" },
  { "jing": "三焦经", "shi": "亥时" },
  { "jing": "胆经", "shi": "子时" },
]
var setInter="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 0,
    height: 0,
    pageWidth: 0,//页面宽
    pageHeight: 0,//页面高
    canvaswidth: 0,//画布宽
    canvasheight: 0,//画布高
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
        that.height = res.windowHeight
      }
    })
    this.setData({
      canvaswidth: that.width,
      canvasheight: that.width * 0.8,
      pageWidth: that.width,
      pageHeight: that.height
    })
    setInter=setInterval(this.drawTurntable,1000)
    // this.drawTurntable();
  },
  drawTurntable:function(){
    let timeStr = util.common.formatTime(new Date())
    //获取页面的宽和高
     var h = this.height;       //页面高
     var w = this.width;        //页面宽
     var x= w / 2;             // 圆心横坐标 0.5w
     var y= x * 0.8;           // 圆心纵坐标 0.4w
     var r = w *0.35;     //圆半径 0.35w
     var num = timeStr.split(":")[0];  //截取小时（24小时制）
     var ctx = wx.createCanvasContext("turntableCanvas", this);//获取画笔
     ctx.setStrokeStyle("#EFE7AF");    //设置边框颜色。（背景色）
     ctx.setLineWidth(1)               //设置边框宽度
     ctx.arc(x, y, r, 0, 2 * Math.PI, false); //画大转盘圆
     ctx.setFillStyle("#439A67");      //设置填充色
     ctx.fill();                       //填充大转盘圆
     for(var i = 0; i < 12; i++){      //画扇形分割线
       ctx.beginPath()
       ctx.arc(x, y, r, (1 / 6 * i -7/ 12) * Math.PI, (1 / 6 * (i + 1)-7/12) * Math.PI , false);//画扇形起始位置第二象限偏Y轴15度
       ctx.lineTo(x,y);                //链接圆心
       ctx.stroke()                    //显示画笔走过的路径
       if (parseInt(num / 2) == i) {   //改变指针指示区域颜色
         ctx.setFillStyle("#FF9E04");
         ctx.fill();
       }
     } 
     ctx.beginPath()//画转盘小圆
     ctx.arc(x, y, r/1.3, 0, 2 * Math.PI , false);
     ctx.stroke();
     //画指针圆
     ctx.beginPath()
     ctx.arc(x, y, r / 2.7, 0, 2 * Math.PI, false);
     ctx.setFillStyle("#F84752");
     ctx.fill();
     ctx.save()                          //保存画笔状态
     //画指针
     ctx.beginPath()
     ctx.translate(x, y)                 //设置旋转中心
     ctx.rotate(num *15* Math.PI / 180)  //旋转角度
     ctx.moveTo(r/5, 0);                 //从旋转中心x偏移r/5
     ctx.lineTo(- r / 5, 0);             //链接旋转中心x反方向偏移r/5
     ctx.lineTo(0, - r / 1.8);           //链接Y轴反方向r/1.8
     ctx.setFillStyle("#F84752");        //设置填充色
     ctx.fill();                         //填充
     //画时钟圆
     ctx.restore();                      //恢复画笔状态
     ctx.beginPath()
     ctx.arc(x, y, r/3.8, 0, 2 * Math.PI, false);
     ctx.setFillStyle("#812028");
     ctx.fill();
     ctx.setFontSize(r/10)
     ctx.setFillStyle("#ffffff");
     ctx.fillText(timeStr.substr(11,8),x-r/5,y+r/20);
    
     //设置文字
    
     ctx.translate(x, y)
     for(var i = 0; i < 12; i++){
       ctx.rotate(30 * Math.PI / 180)
       ctx.setFontSize(r / 10)
       if(backgroundText[i].jing.length==2)
         ctx.fillText(backgroundText[i].jing, -0.1 * r, -0.83 * r); 
       else
         ctx.fillText(backgroundText[i].jing, -0.15*r , -0.86*r);  
       ctx.fillText(backgroundText[i].shi, -0.10 * r, -0.65 * r);
     }
     ctx.draw();
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