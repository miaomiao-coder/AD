var api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
var ad = require('../../../utils/ad.js');
var settings = require('../../../utils/settings.js');
var app = getApp();
let interstitialAd=null;
var BasePage = require('../../../utils/BasePage.js');
var context = wx.createCanvasContext('canvasid');
var strat_num = 1, end_num = 20;
var sAngle = 1.5 * Math.PI, eAngle = 0;
BasePage({
  data: {
    id: 0,
    bookinfo: {},
    chapter: {},
    totalchaptercount: 0,
    markcontent: '加入书架',
    markcolorclass:"colorred",
    markbackgroundclass: "backgroundred",
    bookmarkcount: [],
    markdisabled: false,
    reclist: [],
    message: {},
    unitidList: [
    {
      type:'temple',
      id: " adunit-691d33325ae96dc7"
    }
   
  ],
    unitid:{
    },
    markimg:"/image/tobookmark.png",
    tagList:[],
    loading:true
  },
  onLoad: function(options) {
    this.setData({
      id: options.novelid,
      loading:false
    });
    // this.getAd();
    // ad.adclass.InterstitialAd(interstitialAd,2,(result)=>{interstitialAd=result});
  },
  getAd:function()
  {
    ad.adclass.GetTempleAdList((idList)=>{
      console.log(idList[0]);
      this.setData({
        unitid: idList[0]
      });
    },2,1)
  },
  getpropAd:function()
  {
    // 在页面中定义插屏广告
    // let interstitialAd = null
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-b3c95883e4bd1d66'
      })
      interstitialAd.onLoad(() => { console.log('插屏 广告加载成功')})
      interstitialAd.onError((err) => {  console.log('插屏 广告错误',err)})
      interstitialAd.onClose(() => {  console.log('插屏 广告关闭')})
    }
 
  },
  onShow: function(options) {
    // ad.adclass.ShowAd(interstitialAd);

    var that = this;
    var novelid = that.data.id;
    if (novelid > 0) {     
      app.TellVersionCheck((headerInfo) => {
        that.getNovelDetail(novelid,headerInfo,(novelDetail)=>{
          that.getBookMarkFavStatus(novelid,headerInfo);         
          that.getGuessLikeBookList(novelid,headerInfo);
          //that.getChapterList(novelid,headerInfo);
        },(error)=>{
          console.log("书籍详情getNovelDetail发生错误",error);
        });      
      })     
    }
  },
  onReady: function () {
    if (this.data.loading == true) {
      this.canvas();
    }
  },
  canvas:function(){
    var that=this;
    if (strat_num <= end_num){
      eAngle = strat_num * 2 * Math.PI / end_num + 1.5 * Math.PI;
      setTimeout(function () {
       context.setStrokeStyle("#00ff00")
       context.setLineWidth(2)
       context.fillText(strat_num * 5 <= 100?strat_num * 5:100, 95, 95)
       context.arc(100, 100, 60, sAngle, eAngle, false)
       context.stroke()
       context.draw()
       that.canvas()
       strat_num++
     },200)
     } else {
      console.log('strat_num_end:', strat_num)
     }
  },
  onShareAppMessage: function (res) {

    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: that.data.bookinfo.title,
        path: '/pages/book/detail/detail?novelid=' + that.data.id + '&from=test',
        imageUrl: that.data.bookinfo.small_cover == '' ? '/image/defaultcover.png' : that.data.bookinfo.small_cover
      }
    }
    return {
      title: that.data.bookinfo.title,
      path: '/pages/book/detail/detail?novelid=' + that.data.id +"&from=test",
      imageUrl: that.data.bookinfo.small_cover == '' ? '/image/defaultcover.png' : that.data.bookinfo.small_cover
    }
  },
  //跳转到书籍正文
  btnRead: function() {
    var chaptercode = 0;
    var rentreadlist = util.wxf.getStorageSync("content_rentreadlist");
    for (var i = 0; i < rentreadlist.length; i++) {
      if (rentreadlist[i]['novel_id'] == this.data.id) {
        chaptercode = rentreadlist[i]['chapter_code'];
        break;
      }
    }
    util.wxf.navigateTo('../chapter/detail/detail?novelid=' + this.data.id + '&chaptercode=' + chaptercode);
  },
  tohome: function () {
    util.wxf.switchTab('../../index/index');
  },
  //最近章节跳转到正文
  bindChapterToContent: function(e) {
    var chaptercode = e.currentTarget.dataset.cid;
    if (chaptercode >= 0) {
      util.wxf.navigateTo('../chapter/detail/detail?novelid=' + this.data.id + '&chaptercode=' + chaptercode);
    }
  },
  //添加到书架
  btnMark: function() {
    var _this = this;
    if (!_this.data.markdisabled) {
      var bookid = _this.data.id;
      if (bookid > 0) {
        app.getHeaderInfo(function(headerInfo) {
          app.isLogin(function(loginInfo) {
              api.request.addBookFav({
                  //data
                  novelid: bookid,
                  chaptercode: 0,
                  un: loginInfo.username //
                },
                headerInfo,
                function(res) {
                  //success
                  if (!util.common.isEmptyObject(res)) {
                    _this.setData({
                      markcontent: '已在书架',
                      markdisabled: true,
                      markcolorclass: "colorgray",
                      markimg: "/image/hasbookmark.png"
                    });
                  }
                },
                function(code) {
                  //error
                  if (code == 10110) {
                    _this.setData({
                      'message.content': '未授权',
                      'message.iconPath': '/image/noright.png',
                      'message.duration': 3000
                    });
                    
                    //util.wxf.showToast('身份识别失败，请重新登录', null, 1000);
                  } else {
                    _this.setData({
                      'message.content': '操作失败',
                      'message.iconPath': '/image/noright.png',
                      'message.duration': 3000
                    });
                    
                    //util.wxf.showToast('加入书架失败，请重试', null, 1000);
                  }
                }
              )
            },
            function() {
              util.wxf.redirectTo('../../error/error?msg=温馨提醒&desc=游客暂未开放书架功能&mainAction=&actionType=');
              //_this.setData({ 'message.content': '游客暂未开放书架功能', 'message.iconPath': '/image/noright.png', 'message.duration': 3000 });
              //msg.show.call(_this, _this.data.message);
              //util.wxf.showToast('身份识别失败，请重新登录', null, 1000)
            });
        })
      }
    }
  },

  //更多章节
  bindChapters: function() {
    var bookid = this.data.id;
    if (bookid > 0) {
      var url = '../chapter/list/list?id=' + bookid;
      util.wxf.navigateTo(url);
    }
  },

  emptyevent: function(e) {},

  //获取书籍是否加入书架状态
  getBookMarkFavStatus:function(novelId,headerInfo){
    var that=this;
    app.isLogin(function(loginInfo) {
      api.request.bookMarkList({
          UN: loginInfo.username,
          novelid: novelId
        },
        headerInfo,
        function(res) {
          // success
          if (!util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
            that.setData({
              bookmarkcount: res.list.count
            });
          }
          if (that.data.bookmarkcount > 0) {
            that.setData({
              markcontent: '已在书架',
              markdisabled: true,
              markcolorclass:"colorgray",
              markimg: "/image/hasbookmark.png"
            });
          }
        }
      )
    });

  },
  //获取最新章节信息
  getChapterList:function(novelId,headerInfo){
    var that=this;
    api.request.chapterList({
      novelid: novelId,
      sort: 'desc'
    },
    headerInfo,
    function(res) {
      // success
      if (!util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
        that.setData({
          chapter: res.list.item[0],
          totalchaptercount: res.list.totalcount
        });
      }
    }
 );

  },
  //获取猜你喜欢
  getGuessLikeBookList:function(bookSpetype,headerInfo){
    var that=this;
    let rec_classid = settings.global.noveldetail_rec_female_classId;
    if (bookSpetype == 'male')
      rec_classid = settings.global.noveldetail_rec_male_classId;

      api.request.recommendList({
        classid: rec_classid,
        pagesize: 3
      },
      headerInfo,
      function(res) {
        if (!util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
          that.setData({
            reclist: res.list.item
          })
        }
      }
    )

  },
  //获取书籍详情
  getNovelDetail:function(novelId,headerInfo,success,errorcallback){
    var that=this;
    api.request.novelDetail({
        novelid: novelId
      }, headerInfo,
      function(res) {
        // success       
        if (!util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.detail)) {
          console.log("novelinfo",res.detail);    
          let taglist=[];                         
          if (!util.common.isEmptyObject(res.detail.tags))
          {
            let tags = res.detail.tags;
            taglist = tags.indexOf(',') > 0 ? tags.split(',') :tags.indexOf('，') > 0 ? tags.split('，') : tags.indexOf('；') > 0 ? tags.split('；') :tags.split(';');               
          }
          that.setData({
            bookinfo: res.detail,
            loading:false,
            tagList: taglist
          })
          util.common.isFunction(success)&&success(res.detail);
        }    
      },
      function(error){
        util.common.isFunction(errorcallback)&&errorcallback(error);
      }
    ); 
  }
})