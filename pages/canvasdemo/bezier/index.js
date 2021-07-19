// pages/canvasdemo/bezier/index.js

let sizeList=[20,25,30];
let colorList=["red","yellow","blue"];
let starX = 0;
let startY = 0;
let timeSenter=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 0,
    height: 0,
    heartsize:20,
    heartcolor:"red",
    bezierCount: 50,
    margintop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function (res) {
        that.setData({
          width:res.windowWidth,
          height:res.windowHeight,   //屏幕高度
          margintop:res.windowHeight-50      //屏幕高度-底部圆心的高度
        })
        //以iphone6为准：1px=2rpx;
        that.starX = that.data.width / 2 - 30 / 2;
        that.startY = that.data.height-25;
        // 这里的单位是PX，实际的手机屏幕有一个Dpr，这里选择iphone，默认Dpr是2
      }
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

  bubbleAnimate: function () {
    var that=this;
    let num = 0;

    let XLeft=[that.starX-that.data.width/6,that.starX-that.data.width/3]
    let XRight=[that.starX+that.data.width/6,that.starX+that.data.width/3]
    let YPath=[that.startY-that.data.height/3,that.startY-that.data.height*2/3];
  
    timeSenter = setInterval(() => {
     //#region 设置按钮心心的大小和颜色
      this.setData({
        heartsize: sizeList[num % sizeList.length],
        heartcolor: colorList[num % colorList.length]
      });
      //#endregion
      
      //#region 使心心每次移动轨迹为左右对称
      var xpoint=XLeft[0];
      var xpoint=XLeft[1];
      var endX=this.getRandom(0,that.data.width/2)
      if(num%2==1)
      {
         xpoint=XRight[0];
         xpoint=XRight[1];
         endX=this.getRandom(that.data.width/2,that.data.width,)
      }
      //#endregion
       //60=width/2/2-heartwidth/2
      let anitPath1 = [{ x: that.starX, y: that.startY }, { x:xpoint, y: YPath[0] }, { x: xpoint, y: YPath[1] }, { x: endX, y: 0 }];
      let factor={
        speed: 0.003, // 运动速度，值越小越慢
        t: 0, //  贝塞尔函数系数
        opacity:1
      }
      var imgnum=num%24+1;
      let data = { factor: factor, image: "../../../image/hearts/" + imgnum + ".png", path: anitPath1, num: num, count: 0 }

      let ctx1 = wx.createCanvasContext("bezier" + num, this);
      this.rawImage(data, true, ctx1);
      if (num ==this.data.bezierCount) {
        clearInterval(timeSenter);
      }
      num++;
    }, 500);
  },
  getRandom: function (min, max) {
    return Math.random() * (max - min) + min;
  },
  rawImage: function (data,first,ctx1,timer1) {
    let path=data.path;
    var that = this
    var p10 = path[0];  /* 三阶贝塞尔曲线起点坐标值*/
    var p11 = path[1];  /* 三阶贝塞尔曲线第一个控制点坐标值*/
    var p12 = path[2];  /* 三阶贝塞尔曲线第二个控制点坐标值*/
    var p13 = path[3];  /* 三阶贝塞尔曲线终点坐标值*/

    // var p10 = path[0][0];  /* 三阶贝塞尔曲线起点坐标值*/
    // var p11 = path[0][1];  /* 三阶贝塞尔曲线第一个控制点坐标值*/
    // var p12 = path[0][2];  /* 三阶贝塞尔曲线第二个控制点坐标值*/
    // var p13 = path[0][3];  /* 三阶贝塞尔曲线终点坐标值*/
    // var p20 = path[1][0];
    // var p21 = path[1][1];
    // var p22 = path[1][2];
    // var p23 = path[1][3];
    // var p30 = path[2][0];
    // var p31 = path[2][1];
    // var p32 = path[2][2];
    // var p33 = path[2][3];
    var t = data.factor.t;
    if (data.factor.t >= 0.5) {
      //变速，先快后慢
      t-=0.001;
    }
    /*计算多项式系数 （下同）*/

    // var cx1 = 3 * (p11.x - p10.x);
    // var bx1 = 3 * (p12.x - p11.x) - cx1;
    // var ax1 = p13.x - p10.x - cx1 - bx1;
    // var cy1 = 3 * (p11.y - p10.y);
    // var by1 = 3 * (p12.y - p11.y) - cy1;
    // var ay1 = p13.y - p10.y - cy1 - by1;
    // var xt1 = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p10.x;
    // var yt1 = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p10.y;
    // var cx2 = 3 * (p21.x - p20.x);
    // var bx2 = 3 * (p22.x - p21.x) - cx2;
    // var ax2 = p23.x - p20.x - cx2 - bx2;
    // var cy2 = 3 * (p21.y - p20.y);
    // var by2 = 3 * (p22.y - p21.y) - cy2;
    // var ay2 = p23.y - p20.y - cy2 - by2;
    // var xt2 = ax2 * (t * t * t) + bx2 * (t * t) + cx2 * t + p20.x;
    // var yt2 = ay2 * (t * t * t) + by2 * (t * t) + cy2 * t + p20.y;
    // var cx3 = 3 * (p31.x - p30.x);
    // var bx3 = 3 * (p32.x - p31.x) - cx3;
    // var ax3 = p33.x - p30.x - cx3 - bx3;
    // var cy3 = 3 * (p31.y - p30.y);
    // var by3 = 3 * (p32.y - p31.y) - cy3;
    // var ay3 = p33.y - p30.y - cy3 - by3;
    // /*计算xt yt的值 */
    // var xt3 = ax3 * (t * t * t) + bx3 * (t * t) + cx3 * t + p30.x;
    // var yt3 = ay3 * (t * t * t) + by3 * (t * t) + cy3 * t + p30.y;

    const x1 = p10.x * Math.pow(1 - t, 3) + 3 * p11.x * t * Math.pow(1 - t, 2) + 3 * p12.x * Math.pow(t, 2) * (1 - t) + p13.x * Math.pow(t, 3);
    const y1 = p10.y * Math.pow(1 - t, 3) + 3 * p11.y * t * Math.pow(1 - t, 2) + 3 * p12.y * Math.pow(t, 2) * (1 - t) + p13.y * Math.pow(t, 3);
    // const x2 = p20.x * Math.pow(1 - t, 3) + 3 * p21.x * t * Math.pow(1 - t, 2) + 3 * p22.x * Math.pow(t, 2) * (1 - t) + p23.x * Math.pow(t, 3);
    // const y2 = p20.y * Math.pow(1 - t, 3) + 3 * p21.y * t * Math.pow(1 - t, 2) + 3 * p22.y * Math.pow(t, 2) * (1 - t) + p23.y * Math.pow(t, 3);
    // const x3 = p10.x * Math.pow(1 - t, 3) + 3 * p31.x * t * Math.pow(1 - t, 2) + 3 * p32.x * Math.pow(t, 2) * (1 - t) + p33.x * Math.pow(t, 3);
    // const y3 = p10.y * Math.pow(1 - t, 3) + 3 * p31.y * t * Math.pow(1 - t, 2) + 3 * p32.y * Math.pow(t, 2) * (1 - t) + p33.y * Math.pow(t, 3);

    var curAlpha = data.factor.opacity;
    curAlpha =y1 /that.data.height+0.3;
    curAlpha = Math.min(1, curAlpha);
    ctx1.globalAlpha = curAlpha;

    let img = data.image;
    ctx1.drawImage(img, x1, y1, 30, 30);
    data.factor.t += data.factor.speed;
    data.count++;
    
    ctx1.draw();
    if (data.factor.t >= 1) {
      data.factor.t = 0;
      that.cancelAnimationFrame(ctx1,timer1);
      // console.log("停止", data.count, data.factor.speed);
      data.count=0;
    } else {
      timer1 =this.requestAnimationFrame(function () {
        that.rawImage(data,false,ctx1,timer1)
      })
    }
  },
  cancelAnimationFrame: function (ctx1,timer1) {
    clearTimeout(timer1);
    ctx1.draw(); // 清空画面
  },
  
  requestAnimationFrame:function(load){
    setTimeout(() => {
      load();
    }, 5);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.timeSenter);
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