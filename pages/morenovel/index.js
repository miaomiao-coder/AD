// pages/morenovel/index.js
var api = require('../../utils/api.js');
var apiurl = require('../../utils/apiurl.js');
var util = require('../../utils/util.js');
var BasePage = require('../../utils/BasePage.js');
var app = getApp();
BasePage({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,
    pageIndex: 1,
    pageCount: 0,
    bookList: [],
    totalCount: 0,
    classid:0,
    recid:0,
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.clear && options.clear == 1) { 
      this.clearStore();
    }
    else {
      this.setData({
        classid: options.classid,
        recid: options.recid,
        loading: false
      });
      // util.wxf.setNavigationBarTitle(options.classname)
      app.TellVersionCheck((headerInfo, setbarTitle) => {
        setbarTitle(options.classname);
        if (options.classid > 0) {
          this.requestBookList();
        }
        else if (options.recid > 0) {
          this.requestRecommendList();
        }
      });
    }
  },
  requestRecommendList: function() {
    var _this = this;
    var pageIndex = _this.data.pageIndex;
    var pageCount = _this.data.pageCount;
    if (pageCount > 0 && pageIndex > pageCount)
      return;
      
    _this.setData({ showLoading: true, hasMore: true });
    var requestData = {
      pageIndex: _this.data.pageIndex,
      pagesize: 10,
      classid: _this.data.recid
    };
    app.getHeaderInfo(function(headerInfo) {
      api.request.recommendList(
        requestData,
        headerInfo,
        function(res) {
          if (res && !util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
            
            _this.setData({
              bookList: _this.data.bookList.concat(res.list.item),
              pageIndex: pageIndex + 1,
              pageCount: res.list.pagecount,
              totalCount: res.list.totalcount
            });
          }
          _this.setData({ showLoading: false, hasMore: false });

        })
    })
  },
  requestBookList: function () {
    var _this = this;
    _this.setData({ showLoading: true, hasMore: true });
    var pageIndex = _this.data.pageIndex;
    var pageCount = _this.data.pageCount;
    if (pageCount > 0 && pageIndex > pageCount)
      return;
    var requestData = {
      pageIndex: _this.data.pageIndex,
      pagesize: 10,
      classid: _this.data.classid
    };


    try {
      app.getHeaderInfo(function (headInfo) {
        api.request.novelList(requestData, headInfo, (res) => {
          if (res.list) {
            if (_this.pageIndex == 1) {
              _this.setData({
                showAdList: []
              });
            }
            _this.setData({
              bookList: _this.data.bookList.concat(res.list.item),
              pageIndex: pageIndex + 1,
              pageCount: res.list.pagecount,
              totalCount: res.list.totalcount
            });
            _this.getNovelListAdId(2);
          }
          else {
            //没有记录
          }

          _this.setData({ showLoading: false, hasMore: false });
          console.log(_this.data.showLoading,_this.data.pageIndex,_this.data.pageCount);
        }, () => { _this.setData({ showLoading: false, hasMore: false }); }, () => { _this.setData({ showLoading: false, hasMore: false }); });
      });
    } catch (err) {
      _this.setData({ showLoading: false, hasMore: false });
    }
  },
  scrolltolowerEvent: function (e) {
    if (this.data.hasMore)
      return;
    if (this.data.classid > 0) {
      this.requestBookList();
    }
    else if(this.data.recid > 0){
      this.requestRecommendList();
    }
},


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.data.loading == true) {
      var context = wx.createCanvasContext('firstCanvas')
      //设置画笔的颜色
      context.setStrokeStyle("#00ff00")
      //设置线宽为5个像素
      context.setLineWidth(5)
      //左上角坐标(0，0)长宽200
      context.rect(0, 0, 200, 200)
      //对上面定义动作进行绘制
      context.stroke()
      context.setStrokeStyle("#ff0000")
      context.setLineWidth(2)
      //移动画笔的位置到(160,100)
      context.moveTo(160, 100)
      //左上角坐标(100，100)，半径为60，起始角度0°，终止角度2π，顺时针绘制
      context.arc(100, 100, 60, 0, 2 * Math.PI, false)
      context.moveTo(140, 100)
      context.arc(100, 100, 40, 0, Math.PI, false)
      context.moveTo(85, 80)
      context.arc(80, 80, 5, 0, 2 * Math.PI, true)
      context.moveTo(125, 80)
      context.arc(120, 80, 5, 0, 2 * Math.PI, true)
      context.stroke()
      context.draw()
    }
   
  },
  clearStore:function(){
    util.wxf.removeStorageSync("prevvalue");
    util.wxf.showModal("清理缓存成功", "", () => {
      wx.navigateBack({
        delta: 1
      })
    }, () => {
      wx.navigateBack({
        delta: 1
      })
    });
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