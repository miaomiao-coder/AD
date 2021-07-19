// pages/classnovel/index.js
var api = require('../../utils/api.js');
var apiurl = require('../../utils/apiurl.js');
var util = require('../../utils/util.js');
var ad = require('../../utils/ad.js');
var BasePage = require('../../utils/BasePage.js');
var app = getApp();
let interstitialAd=null;
BasePage({

  /**
   * 页面的初始数据
   */
  data: {
    isHideLoadMore:true,
    classList: [],
    selectedId: 0,
    showMore:false,
    showLoading: false,
    pageIndex: 1,
    pageCount: 0,
    bookList: [],
    totalCount: 0,
    bookClass: [],
    toTop: false,
    adidList: [{
      type:'banner',
      id: "adunit-ebe0126c49332ec7"
    },{
      type:'vedio',
      id: "adunit-8f235499f96ea611"
    }],
    showAdList:[],
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.TellVersionCheck((headerInfo) => {
      // ad.adclass.InterstitialAd(interstitialAd,3,(result)=>{
      //   interstitialAd=result;
      // });
      this.setData({
        loading:false
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    app.TellVersionCheck((headerInfo,setbarTitle) => {   
      setbarTitle(); 
      // ad.adclass.ShowAd(interstitialAd);
      api.request.getNovelClass('', headerInfo, (res) => {
        if (res.list) {
          res.list.item.unshift({ id: 0, name: "全部" });
          _this.setData({
            classList: res.list.item
          });
        }
      });
      this.requestBookList();
    })  
  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: '成功',
    })
  },
  getNovelListAdId: function (num) {
    for (let i = 0; i < num; i++) {
      ad.adclass.GetTempleAdList((idList)=>{
        this.setData({
          showAdList: this.data.showAdList.concat( idList[0])
        });
      },3,1)
  }
  
  },
  getpropAd: function () {
    // if (wx.createInterstitialAd) {
    //   interstitialAd = wx.createInterstitialAd({
    //     adUnitId: 'adunit-b3c95883e4bd1d66'
    //   })
    //   interstitialAd.onLoad(() => { console.log('插屏 广告加载成功') })
    //   interstitialAd.onError((err) => { console.log('插屏 广告错误', err) })
    //   interstitialAd.onClose(() => { console.log('插屏 广告关闭') })
    // }
    
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
  onReady:function(){
    if (this.data.loading == true) {
      this.clearStore();
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
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: that.data.bookinfo.title,
        path: '/pages/classnovel/index?from=test'
      }
    }
    return {
      title: that.data.bookinfo.title,
      path: '/pages/classnovel/index?from=test'
    }
  },
  More:function()
  {
    this.setData({
      showMore: true,
    })
    console.log(this.data.showMore);
  },
  ChangeCate: function (e) {
    let cateid = e.currentTarget.dataset.cateid;
    this.setData({
      selectedId: cateid,
    })
    this.setData({
      pageIndex: 1,
      bookList: [],
      pageCount: 0,
      totalCount: 0
  });

    this.requestBookList();
  },
  scrolltolowerEvent: function (e) {
    if (this.data.hasMore)
      return;
    this.requestBookList();
   
},
  requestBookList: function () {
    var _this = this;
    var pageIndex = _this.data.pageIndex;
    var pageCount = _this.data.pageCount;
    if (pageCount > 0 && pageIndex > pageCount)
      return;
     _this.setData({ showLoading: true, hasMore: true });
    var requestData = {
      pageIndex: _this.data.pageIndex,
      pagesize: 10,
      classid: _this.data.selectedId
    };

    try {
      app.TellVersionCheck((headInfo) => {   
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
            // _this.getNovelListAdId(2);
          }
          else {
            //没有记录
          }

          _this.setData({ showLoading: false, hasMore: false });
          console.log(_this.data.showLoading,_this.data.pageIndex,_this.data.pageCount);
        }, () => { _this.setData({ showLoading: false, hasMore: false }); }, () => { _this.setData({ showLoading: false, hasMore: false }); });
      })

 


    } catch (err) {
      _this.setData({ showLoading: false, hasMore: false });
    }
  },
  toTopEvent: function (e) {
    this.setData({ toTop: true });
    this.setData({ toTop: false });
},
  tonovel:function()
  {
    wx.navigateTo({
      url: '../morenovel/index?classid=125'
  });
  }
})