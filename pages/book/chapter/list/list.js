var api = require('../../../../utils/api.js');
var util = require('../../../../utils/util.js');
var app = getApp();
var change = require('../../../../utils/encrypt/base64.js')
var settings = require('../../../../utils/settings.js');
var BasePage = require('../../../../utils/BasePage.js');
var base64 = new change.Base64();

BasePage({
  data: {
    toTop: false,
    titles: [],
    bookid: 0,
    totalcount: 0,
    sort: 'asc',
    pageCount: 0,
    pageIndex: 0,
    message: {},
    bookinfo: null,
    showLoading: false,
    hasMore: false,
    chapterCode: -1,
    loading:true
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      bookid: options.id,
      chapterCode: options.chapterCode ? options.chapterCode : -1,
      loading:false
    });
    if (util.common.isEmptyObject(that.data.bookinfo)) {
      that.BookDetail();
    } else {
      //加载章节
      var pageIndex = that.data.pageIndex + 1;
      that.requestChapterList(that.data.bookid, 'asc', pageIndex, true);
    }
  },
  onShow: function (options) {
    var that = this;
   
  },
  onShareAppMessage: function (res) {
    var that = this;
    app.getHeaderInfo(function (headInfo) {
      app.getShareMessage(function (detail) {
        return {
          title: detail.title,
          path: '/pages/book/detail/detail?novelid=' + that.data.bookid + '&chaptercode=' + detail.chaptercode + 'parentid=' + app.globalData.loginInfo.id,
          imageUrl: data.detail.icon
        }
      })
    });
  },
  //排序
  bindSort: function (e) {
    var txtsort = e.currentTarget.dataset.sort;
    var id = this.data.bookid;
    var pageIndex = 1;
    if (id > 0 && !util.common.isEmptyString(txtsort)) {
      //清空数据
      this.setData({
        titles: []
      })
      this.requestChapterList(id, txtsort, pageIndex, true);
      this.setData({
        sort: this.data.sort == 'asc' ? 'desc' : 'asc'
      });
    }
  },
  bindChapterText: function (e) {
    var chaptercode = e.currentTarget.dataset.cid;
    var novelid = this.data.bookid;
    if (chaptercode >= 0 && novelid > 0) {
      util.wxf.redirectTo('../detail/detail?novelid=' + novelid + '&chaptercode=' + chaptercode);
    }
  },
  //加载更多
  AddMore: function (e) {
    if (this.data.hasMore)
      return;

    var txtsort = this.data.sort;
    var id = this.data.bookid;
    var pageIndex = this.data.pageIndex + 1;
    if (id > 0 && !util.common.isEmptyString(txtsort)) {
      this.requestChapterList(id, txtsort, pageIndex, false);
    }
  },

  toTopEvent: function (e) {
    this.setData({
      toTop: true
    });
    this.setData({
      toTop: false
    });
  },
  requestChapterList: function (id, sort, pageIndex, showLoad) {
    var _this = this;
    var pageSize = 20;
    _this.setData({
      showLoading: true,
      hasMore: true
    });

    try {
      if (pageIndex > _this.data.pageCount && _this.data.pageCount != 0)
        return;

      if (showLoad)
      

      app.getHeaderInfo(function (headerInfo) {
        app.getUserInfo((userInfo) => {
          let username = base64.encode(base64.xor_encrypt(settings.global.loginkey, base64.encode(userInfo.username)))
          api.request.chapterList({
            novelid: id,
            sort: sort,
            pagesize: pageSize,
            pageIndex: pageIndex,
            un: username
          }, headerInfo,
            function (res) {
              // success
              if (!util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
                _this.setData({
                  titles: _this.data.titles.concat(res.list.item),
                  totalcount: res.list.totalcount,
                  pageCount: res.list.pagecount,
                  pageIndex: pageIndex
                })
              }
              if (_this.data.message.visiable)
              

              _this.setData({
                showLoading: false,
                hasMore: false
              });
            },
            () => {
              _this.setData({
                showLoading: false,
                hasMore: false
              });
            },
            () => {
              _this.setData({
                showLoading: false,
                hasMore: false
              });
            }
          );
        });
      })
    } catch (err) {
      _this.setData({
        showLoading: false,
        hasMore: false
      });
    }
  },
  //详情页
  BookDetail: function () {
    var that = this;
    app.getHeaderInfo(function (headerInfo) {
      api.request.novelDetail({
        novelid: that.data.bookid
      }, headerInfo,
        function (res) {
          // success
          if (!util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.detail)) {
            that.setData({
              bookinfo: res.detail
            })
            //加载章节
            var pageIndex = that.data.pageIndex + 1;
            that.requestChapterList(that.data.bookid, 'asc', pageIndex, true);
          }
        }
      );
    });
  }
})