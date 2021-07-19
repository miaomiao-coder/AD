// pages/canvasdemo/playbill/index.js
let bg = '../../../image/mall-shareimg-bg.jpg'
let titleBg = '../../../image/mall-shareimg-title.jpg'
let shareGoods = [
  '../../../image/little.jpg',
  '../../../image/little.jpg',
  '../../../image/little.jpg',
  '../../../image/little.jpg',
  '../../../image/little.jpg',
  '../../../image/little.jpg',
  '../../../image/little.jpg',
  '../../../image/little.jpg',
  '../../../image/little.jpg',
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 0,
    height: 0
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
    this.drawShareImg();
  },
  drawShareImg: function () {
    var that = this;
    let num = 0
    wx.getImageInfo({
      src: bg,
      success: function (res) {
        console.log("bg成功", res);
        let rate = 0.5 // 缩小比例
        let ctx = wx.createCanvasContext('myCanvas')
        // ctx.drawImage(res.path, 0, 0, 690 * rate, 1031 * rate) // 背景
        ctx.drawImage(bg, 0, 0, that.width, that.height) // 背景
        wx.getImageInfo({
          src: titleBg,
          success: function (res) {
            console.log("titleBg成功", res);
            ctx.drawImage(titleBg, 0, 0, that.width, 210 * rate) // 背景标题
            let shareGoodsLen = shareGoods.length
            for (let i = 0; i < shareGoodsLen; i++) {
              console.log(shareGoods[i])
              wx.getImageInfo({
                src: shareGoods[i],
                success: function (res) {
                  // shareGoods[i] = res.path
                  ++num
                  if (num == shareGoodsLen) { // 这里有个异步问题
                    console.log('开始画图')
                    // 先画商品分享图的白色背景，背景高度需要根据3的倍数计算函数
                    // 定位每个商品图片x和y轴
                    let line = Math.ceil(shareGoodsLen / 3) // 行数
                    let xy = [
                      { x: (30 + 30) * rate, y: (246 + 30) * rate },
                      { x: (30 + 275) * rate, y: (246 + 30) * rate },
                      { x: (30 + 520) * rate, y: (246 + 30) * rate },
                      { x: (30 + 30) * rate, y: (246 + 276) * rate },
                      { x: (30 + 275) * rate, y: (246 + 276) * rate },
                      { x: (30 + 520) * rate, y: (246 + 276) * rate },
                      { x: (30 + 30) * rate, y: (246 + 521) * rate },
                      { x: (30 + 275) * rate, y: (246 + 521) * rate },
                      { x: (30 + 520) * rate, y: (246 + 521) * rate }
                    ]

                    // 白色背景
                    ctx.beginPath();
                    ctx.save();
                    ctx.setLineWidth(1)
                    ctx.setStrokeStyle('#fff')
                    ctx.moveTo(40 * rate, 246 * rate);           // 创建开始点
                    let winwidth = that.width - 40 * rate;
                    let nextwinwidth = winwidth + 10 * rate;
                    console.log("winwidth", winwidth);
                    ctx.lineTo(winwidth, 246 * rate);       // 创建水平线
                    let winheight = winwidth - 40 * rate + 256 * rate;
                    let nextwinheight = winheight + 10 * rate
                    ctx.arcTo(nextwinwidth, 246 * rate, nextwinwidth, 256 * rate, 20 * rate); // 创建弧
                    ctx.lineTo(nextwinwidth, winheight);         // 创建垂直线
                    ctx.arcTo(nextwinwidth, nextwinheight, winwidth, nextwinheight, 20 * rate); // 创建弧
                    ctx.lineTo(40 * rate, nextwinheight);         // 创建水平线
                    ctx.arcTo(30 * rate, nextwinheight, 30 * rate, winheight, 20 * rate); // 创建弧
                    ctx.lineTo(30 * rate, 256 * rate);         // 创建垂直线
                    ctx.arcTo(30 * rate, 246 * rate, 40 * rate, 246 * rate, 20 * rate); // 创建弧
                    ctx.closePath()
                    ctx.clip();
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(0, 0, winwidth + 10 * rate, winheight + 10 * rate);
                    ctx.stroke();
                    ctx.restore();

                    shareGoods.forEach((e, idx) => {
                      ctx.beginPath();
                      ctx.save();
                      let width = 200 * rate;
                      let radius = 8 * rate
                      let angleLine = 10 * rate
                      // { x: (30+30)*rate,y: (246+30)*rate },
                      ctx.setLineWidth(1)
                      ctx.setStrokeStyle('#E9E9E9')
                      ctx.moveTo(xy[idx].x + angleLine, xy[idx].y);           // 创建开始点
                      ctx.lineTo(xy[idx].x + angleLine + width, xy[idx].y);          // 创建水平线
                      ctx.arcTo(xy[idx].x + angleLine * 2 + width, xy[idx].y, xy[idx].x + angleLine * 2 + width, xy[idx].y + angleLine, radius); // 创建弧
                      ctx.lineTo(xy[idx].x + angleLine + width + angleLine, xy[idx].y + angleLine + width);         // 创建垂直线
                      ctx.arcTo(xy[idx].x + angleLine * 2 + width, xy[idx].y + angleLine * 2 + width, xy[idx].x + angleLine + width, xy[idx].y + angleLine * 2 + width, radius); // 创建弧
                      ctx.lineTo(xy[idx].x + angleLine, xy[idx].y + angleLine * 2 + width);         // 创建水平线
                      ctx.arcTo(xy[idx].x, xy[idx].y + angleLine * 2 + width, xy[idx].x, xy[idx].y + angleLine + width, radius); // 创建弧
                      ctx.lineTo(xy[idx].x, xy[idx].y + angleLine);         // 创建垂直线
                      ctx.arcTo(xy[idx].x, xy[idx].y, xy[idx].x + angleLine, xy[idx].y, radius); // 创建弧
                      ctx.stroke(); // 这个具体干什么用的？
                      ctx.clip();
                      ctx.drawImage(e, xy[idx].x, xy[idx].y, 220 * rate, 220 * rate);
                      ctx.restore();
                    })

                    ctx.draw()

                    // setTimeout(() => {
                    //   let rate = 2
                    //   wx.canvasToTempFilePath({
                    //     x: 0,
                    //     y: 0,
                    //     width: 345,
                    //     height: 515,
                    //     destWidth: 345 * rate,
                    //     destHeight: 515 * rate,
                    //     canvasId: 'myCanvas',
                    //     success: function (res) {
                    //       that.setData({
                    //         shareImg: res.tempFilePath
                    //       })
                    //       wx.hideLoading()
                    //       console.log('绘图成功')
                    //     },
                    //     fail: function () {
                    //       // 导出图片错误
                    //       /*wx.showModal({
                    //         title: '导出图片时出错',
                    //         content: '请重新尝试！',
                    //       })*/
                    //     },
                    //     complete: function () {
                    //       wx.hideLoading()
                    //     }
                    //   }, that)
                    // }, 1000)
                  }
                },
                fail(e) {
                  console.log('失败')
                  console.log(e)
                }
              })
            }


          },
          fail: function (res) { console.log("titleBg错误", res); }
        })
      },
      fail: function (res) { console.log("res", res); }
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