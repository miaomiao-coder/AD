// pages/index/index.js
var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var BasePage = require('../../utils/BasePage.js');
var settings = require('../../utils/settings.js');
var ad = require('../../utils/ad.js');
var app = getApp();
let customAd=null;

BasePage({

  /**
   * 页面的初始数据
   */
  data: {
    sexType: 1, // 男女频，1 - 女频; 2 - 男频
    femaleClass: 'top-view-female-sel',
    maleClass: 'top-view-male',
    tabImgClass: 'female',
    showLoading: false,
    loading:true,
    allloading:true,
    hideBanner: false,
    female_likeListPageIndex: 1,
    female_likeListPageCount: 0,
    male_likeListPageIndex: 1,
    male_likeListPageCount: 0,
    scrollviewheight: '', // scroll-view高度
    scrollTop: '',
    // 女频——顶部banner
    female_bannerList: [],
    // 女频——今日热书
    female_todayHotBook: [],
    female_todayHotRowBook: [],
    female_todayHotColBook: [],
    female_todayHotClassId: settings.global.female_hot_classId,
    // 女频——热门分类
    female_hotClass: [{
      classId: 139,
      bgColor: '#F4ECEA',
      isNeedImg: true,
      imgPath: '../../image/class_fire.png',
      className: '婚恋情感'
    }, {
      classId: 140,
      bgColor: '#EDF4EC',
      isNeedImg: true,
      imgPath: '../../image/class_fire.png',
      className: '甜宠总裁'
    }, {
      classId: 141,
      bgColor: '#F5EEE6',
      isNeedImg: false,
      imgPath: '../../image/class_fire.png',
      className: '虐恋苦情'
    }, {
      classId: 142,
      bgColor: '#E8F2F3',
      isNeedImg: false,
      imgPath: '../../image/class_fire.png',
      className: '古言穿越'
    }],
    female_hotClassId: settings.global.female_hotClass_classId,
    // 女频——重磅新书
    female_newBookList: [],
    female_newClassId: settings.global.female_new_classId,
    // 女频——热门推荐
    female_hotRecBookList: [],
    female_hotRecClassId: settings.global.female_rec_classId,
    // 女频——口碑佳作
    female_goodBookList: [],
    female_goodClassId: settings.global.female_good_classId,
    // 女频——经典热书
    female_classicsHotBookList: [],
    female_classicsHotClassId: settings.global.female_classicHot_classId,
    // 女频——必看言情
    female_romanticBookList: [],
    female_romanticClassId: settings.global.female_romantic_classId,
    // 女频——猜你喜欢
    female_mayLikeBookList: [],

    // 男频——顶部banner
    male_bannerList: '',
    // 男频——今日热书
    male_todayHotBook: [],
    male_todayHotRowBook: [],
    male_todayHotColBook: [],
    male_todayHotClassId: settings.global.male_hot_classId,
    // 男频——热门分类
    male_hotClass: [{
      classId: 143,
      bgColor: '#F4ECEA',
      isNeedImg: true,
      imgPath: '../../image/class_fire.png',
      className: '乡村故事'
    }, {
      classId: 144,
      bgColor: '#EDF4EC',
      isNeedImg: true,
      imgPath: '../../image/class_fire.png',
      className: '都市生活'
    }, {
      classId: 145,
      bgColor: '#F5EEE6',
      isNeedImg: false,
      imgPath: '../../image/class_fire.png',
      className: '玄幻仙侠'
    }, {
      classId: 146,
      bgColor: '#E8F2F3',
      isNeedImg: false,
      imgPath: '../../image/class_fire.png',
      className: '历史军事'
    }],
    male_hotClassId: settings.global.male_hotClass_classId,
    // 男频——重磅新书
    male_newBookList: [],
    male_newClassId: settings.global.male_new_classId,
    // 男频——热门推荐
    male_hotRecBookList: [],
    male_hotRecClassId: settings.global.male_rec_classId,
    // 男频——口碑佳作
    male_goodBookList: [],
    male_goodClassId: settings.global.male_good_classId,
    // 男频——经典热书
    male_classicsHotBookList: [],
    male_classicsHotClassId: settings.global.male_classicHot_classId,
    // 男频——必看都市
    male_cityBookList: [],
    male_cityClassId: settings.global.male_city_classId,
    // 男频——猜你喜欢
    male_mayLikeBookList: [],

    //广告
    showAdList:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // ad.adclass.GetTempleAdList((idList) => {
    //   console.log("newAdList",idList);
    // }, 4, 13)


    var res = wx.getSystemInfoSync();
    console.log('getSystemInfoSync：', res.screenHeight + 'px;');
    this.setData({
      scrollviewheight: res.screenHeight + 'px;',
      allloading:false
    });

    // app.TellVersionCheck((headerInfo, setbarTitle) => {
      this.requestData(this.data.sexType);
      this.requestNovelList(this.data.sexType, 1, 5);
      // this.getIndexAdId();
    // })
   
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
    // ad.adclass.ShowAd(customAd,2);
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
    wx.showToast({
      title: '下拉了'
    })
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
          path: '/pages/home/index?from=test'
        }
      }
      return {
        title: that.data.bookinfo.title,
        path: '/pages/home/index?from=test'
      }
  },
  /**
   * 选择女生tab
   */
  selFemale: function () {
    this.setData({
      femaleClass: 'top-view-female-sel',
      maleClass: 'top-view-male',
      tabImgClass: 'female',
      sexType: 1
    });

    this.requestData(this.data.sexType);
    this.requestNovelList(this.data.sexType, 1, 5);
    this.setData({
      scrollTop: '0'
    });
  },
  /**
   * 选择男生tab
   */
  selMale: function () {
    this.setData({
      femaleClass: 'top-view-female',
      maleClass: 'top-view-male-sel',
      tabImgClass: 'male',
      sexType: 2
    });

    this.requestData(this.data.sexType);
    this.requestNovelList(this.data.sexType, 1, 5);
    this.setData({
      scrollTop: '0'
    });
  },
  requestData: function (sexType) {
    if (sexType == 1) { // 女频
      this.getRecAdData(1, this.data.female_bannerList, settings.global.female_banner_classId, 'ad'); // 女频——banner
      this.getRecAdData(1, this.data.female_todayHotBook, settings.global.female_hot_classId, 'rec', 1, 5); // 女频——今日热书
      this.getRecAdData(1, this.data.female_hotClass, settings.global.female_hotClass_classId, 'rec', 1, 8); // 女频——热门分类
      this.getRecAdData(1, this.data.female_newBookList, settings.global.female_new_classId, 'rec', 1, 8); // 女频——重磅新书
      this.getRecAdData(1, this.data.female_hotRecBookList, settings.global.female_rec_classId, 'rec', 1, 3); // 女频——热门推荐
      this.getRecAdData(1, this.data.female_goodBookList, settings.global.female_good_classId, 'rec', 1, 4); // 女频——口碑佳作
      this.getRecAdData(1, this.data.male_classicsHotBookList, settings.global.female_classicHot_classId, 'rec', 1, 8); // 女频——经典热书
      this.getRecAdData(1, this.data.female_romanticBookList, settings.global.female_romantic_classId, 'rec', 1, 3); // 女频——必看言情
      this.setData({hideBanner:true,loading:false})
    } else { // 男频
      this.getRecAdData(2, this.data.male_bannerList, settings.global.male_banner_classId, 'ad'); // 男频——banner
      this.getRecAdData(2, this.data.male_todayHotBook, settings.global.male_hot_classId, 'rec', 1, 5); // 男频——今日热书
      this.getRecAdData(2, this.data.male_hotClass, settings.global.male_hotClass_classId, 'rec', 1, 8); // 男频——热门分类
      this.getRecAdData(2, this.data.male_newBookList, settings.global.male_new_classId, 'rec', 1, 8); // 男频——重磅新书
      this.getRecAdData(2, this.data.male_hotRecBookList, settings.global.male_rec_classId, 'rec', 1, 3); // 男频——热门推荐
      this.getRecAdData(2, this.data.male_goodBookList, settings.global.male_good_classId, 'rec', 1, 4); // 男频——口碑佳作
      this.getRecAdData(2, this.data.male_classicsHotBookList, settings.global.male_classicHot_classId, 'rec', 1, 8); // 男频——经典热书
      this.getRecAdData(2, this.data.male_cityBookList, settings.global.male_city_classId, 'rec', 1, 3); // 男频——必看都市
    
    }
  },
  requestNovelList: function (sexType) {
    var pageIndex = sexType == 1 ? this.data.female_likeListPageIndex : this.data.male_likeListPageIndex;
    var pageCount = sexType == 1 ? this.data.female_likeListPageCount : this.data.male_likeListPageCount;
    if (pageCount > 0) {
      if (pageIndex > pageCount) {
        return;
      }
    }

    this.setData({
      showLoading: true
    });
    var that = this;
    var data = {
      ContentType: '0',
      ClassSpeType: this.data.sexType == 1 ? '2' : '1',
      PageIndex: pageIndex,
      PageSize: 10
    };
    app.getHeaderInfo(function (headerInfo) {
      api.request.mayLikeList(
        data,
        headerInfo,
        function (res) {
          if (res && !util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
            if (res.ret_result.ret_code == 1) {
              if (res.list.pagecount <= 0 || res.list.totalcount <= 0) {
                if (sexType == 1) {
                  that.setData({
                    female_mayLikeBookList: [],
                    female_likeListPageIndex: 1,
                    female_likeListPageCount: 0,
                    showLoading: false
                  });
                } else if (sexType == 2) {
                  that.setData({
                    male_mayLikeBookList: [],
                    male_likeListPageIndex: 1,
                    male_likeListPageCount: 0,
                    showLoading: false
                  });
                }
              } else {
                if (sexType == 1) {
                  that.setData({
                    female_mayLikeBookList: that.data.female_mayLikeBookList.concat(res.list.item),
                    female_likeListPageIndex: pageIndex + 1,
                    female_likeListPageCount: res.list.pagecount,
                    showLoading: true
                  });
                } else if (sexType == 2) {
                  that.setData({
                    male_mayLikeBookList: that.data.male_mayLikeBookList.concat(res.list.item),
                    male_likeListPageIndex: pageIndex + 1,
                    male_likeListPageCount: res.list.pagecount,
                    showLoading: false
                  });
                }
              }
            } else {
              console.log(res.ret_code);
              console.log(res.ret_message);
            }
          }
        }
      );
    });
   
  },
  requestRecommendList: function (classId, pageIndex, pageSize) {
    var that = this;
    var data = {
      ClassId: classId,
      PageIndex: pageIndex,
      PageSize: pageSize
    };

    // 显示加载等待
    // msg.show.call(that, that.data.message);

    app.getHeaderInfo(function (headerInfo) {
      api.request.recommendList(
        data,
        headerInfo,
        function (res) {
          if (res && !util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
            var resObj = res.list;
            that.setPageRecAdList(that.data.sexType, resObj.recclassid, resObj.item, false);
          }
          // msg.hide.call(that);
        }
      )
    })
  },
  requestAdList: function (classId) {
    var that = this;
    var data = {
      ClassId: classId
    };

    // 显示加载等待
    // msg.show.call(that, that.data.message);

    app.getHeaderInfo(function (headerInfo) {
      api.request.adList(
        data,
        headerInfo,
        function (res) {
          if (res && !util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
            var resObj = res.list;
            that.setPageRecAdList(that.data.sexType, resObj.classid, resObj.item, false);
          }
          // msg.hide.call(that);
        }
      )
    })
  },
  requestReplaceRecList: function (recClassId, listCount) {
    var that = this;
    var data = {
      RecClassId: recClassId,
      Count: listCount
    };

    app.getHeaderInfo(function (headerInfo) {
      api.request.replaceRecList(
        data,
        headerInfo,
        function (res) {
          console.log('requestReplaceRecList结果res：', res);
          if (res && !util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
            if (res.ret_result.ret_code == 1) {
              that.setPageRecAdList(that.data.sexType, recClassId, res.list.item, false);
            } else {
              console.log('requestReplaceRecList结果，ret_code：', res.ret_result.ret_code);
              console.log('requestReplaceRecList结果，ret_message：', res.ret_result.ret_message);
            }
          }
        },
        function (fail) {
          console.log('换一换出错，RecClassId：', recClassId);
        }
      )
    })
  },
  /**
   * 猜你喜欢的分页
   */
  scrollPaging: function () {
    console.log('触发分页');
    this.requestNovelList(this.data.sexType);
  },
  /**
   * 点击搜索框进搜索页
   */
  toSearchPage: function () {
    util.wxf.navigateTo('/pages/book/search/index/index');
  },
  /**
   * 点击轮播图进详情
   */
  toDetail: function (obj) {
    var novelId = obj.currentTarget.dataset.id;
    util.wxf.navigateTo('/pages/book/detail/detail?novelid=' + novelId);
  },
  getRecAdData: function (sexType, obj, classId, type, pageIndex, pageSize) {
    var key = (sexType == 1 ? 'female_' + classId : 'male_' + classId);
    if (!(obj && !util.common.isEmptyObject(obj))) {
      var storageData = util.wxf.getStorageInfoSync(key);
      if (storageData == null || storageData == []) {
        if (type == 'rec') {
          this.requestRecommendList(classId, pageIndex, pageSize);
        } else {
          this.requestAdList(classId);
        }
      } else {
        this.setPageRecAdList(sexType, classId, storageData, true);
      }
    }
  },
  setPageRecAdList: function (sexType, classId, obj, onlyStorage) {
    var set;
    switch (classId) {
      case settings.global.female_banner_classId: // 女频——banner
        set = {
          female_bannerList: obj
        };
        break;
      case settings.global.female_hot_classId: // 女频——今日热书
        set = {
          female_todayHotBook: obj,
          female_todayHotRowBook: obj.slice(0, 1),
          female_todayHotColBook: obj.slice(1, obj.length)
        };
        break;
      case settings.global.female_hotClass_classId: // 女频——热门分类
        set = {
          female_hotClass: obj
        };
        break;
      case settings.global.female_new_classId: // 女频——重磅新书
        set = {
          female_newBookList: obj
        };
        break;
      case settings.global.female_rec_classId: // 女频——热门推荐
        set = {
          female_hotRecBookList: obj
        };
        break;
      case settings.global.female_good_classId: // 女频——口碑佳作
        set = {
          female_goodBookList: obj
        };
        break;
      case settings.global.female_classicHot_classId: // 女频——经典热书
        set = {
          female_classicsHotBookList: obj
        };
        break;
      case settings.global.female_romantic_classId: // 女频——必看言情
        set = {
          female_romanticBookList: obj
        };
        break;
      case settings.global.male_banner_classId: // 男频——banner
        set = {
          male_bannerList: obj
        };
        break;
      case settings.global.male_hot_classId: // 男频——今日热书
        set = {
          male_todayHotBook: obj,
          male_todayHotRowBook: obj.slice(0, 1),
          male_todayHotColBook: obj.slice(1, obj.length)
        };
        break;
      case settings.global.male_hotClass_classId: // 男频——热门分类
        set = {
          male_hotClass: obj
        };
        break;
      case settings.global.male_new_classId: // 男频——重磅新书
        set = {
          male_newBookList: obj
        };
        break;
      case settings.global.male_rec_classId: // 男频——热门推荐
        set = {
          male_hotRecBookList: obj
        };
        break;
      case settings.global.male_good_classId: // 男频——口碑佳作
        set = {
          male_goodBookList: obj
        };
        break;
      case settings.global.male_classicHot_classId: // 男频——经典热书
        set = {
          male_classicsHotBookList: obj
        };
        break;
      case settings.global.male_city_classId: // 男频——必看都市
        set = {
          male_cityBookList: obj
        };
        break;
      default:
        break;
    }
    this.setData(set);

    if (!onlyStorage) {
      if (sexType == 1) {
        util.wxf.removeStorageSync('female_' + classId);
        util.wxf.setStorageSync('female_' + classId, obj);
      } else {
        util.wxf.removeStorageSync('male_' + classId);
        util.wxf.setStorageSync('male_' + classId, obj);
      }
    }
  },
  /**
   * 今日热书更多操作
   * @param {点击更多事件} e 
   */
  tapTodayHotMore: function (e) {
    var rec_classId = e.detail;
    wx.navigateTo({
      url: '/pages/morenovel/index?recid=' + rec_classId + '&classname=今日热书'
    });
  },
  /**
   * 热门分类更多分类
   * @param {点击更多分类事件} e 
   */
  tapHotClass: function (e) {
    var rec_classId = e.detail;
    wx.switchTab({
      url: '/pages/classnovel/index'
    });
  },
  /**
   * 重磅新书更多
   * @param {点击更多事件} e 
   */
  tapNew: function (e) {
    var rec_classId = e.detail;
    wx.navigateTo({
      url: '/pages/morenovel/index?recid=' + rec_classId + '&classname=重磅新书'
    });
  },
  /**
   * 热门推荐换一换
   * @param {点击换一换事件} e 
   */
  tapHotRecommend: function (e) {
    var rec_classId = e.detail;
    this.requestReplaceRecList(rec_classId, 3);
  },
  /**
   * 口碑佳作更多
   * @param {点击更多事件} e 
   */
  tapGood: function (e) {
    var rec_classId = e.detail;
    wx.navigateTo({
      url: '/pages/morenovel/index?recid=' + rec_classId + '&classname=口碑佳作',
    })
  },
  /**
   * 经典热书更多
   * @param {点击更多事件} e 
   */
  tapHotClassics: function (e) {
    var rec_classId = e.detail;
    wx.navigateTo({
      url: '/pages/morenovel/index?recid=' + rec_classId + '&classname=经典热书',
    })
  },
  /**
   * 必看言情&必看都市换一换
   * @param {点击换一换事件} e 
   */
  tapRomanticOrCity: function (e) {
    var rec_classId = e.detail;
    this.requestReplaceRecList(rec_classId, 3);
  },
  getIndexAdId: function () {
    ad.adclass.InitCustomAd(customAd,1,(result)=>{
      customAd=result;
    });
    
  }


})