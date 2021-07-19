var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var settings = require('../../utils/settings.js');
var app = getApp();
let interstitialAd=null;
var BasePage = require('../../utils/BasePage.js');
BasePage({
  data:
  {
    booklist: [],
    readList: [],
    guessLikeList:[],
    reclist: [],
    states: -1,
    totalbook: 0,
    message: {},
    pagesize: 12,
    markid: 0,
    isaddmore: false,
    listtype: '',
    hasMore: false,
    showType:1,

    bookmarkEditMode:0,
    bookmarkEditSelectAll:0,
    bookmarkEditSelectNo:0,
    bookmarkEditSelectLessThanAll:0,
    bookmarkEditSelectAny:0,
    loading:true
  },
  onLoad: function (options) {
    if(options.showType != undefined){    
      this.setData({
        showType: options.showType
      });         
    }  
    this.getpropAd();
    this.setData({loading:false})
  },
  getpropAd:function()
  {
    return;
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
  onShow: function () {
    if (interstitialAd) {   
      interstitialAd.show().catch((err) => {
        console.error("插屏广告 显示错误",err)
      })
    }
    var that = this;
    app.TellVersionCheck((headerInfo)=>{
      let loginInfo=app.globalData.userInfo;
      that.LoadMarkList(false,loginInfo,headerInfo);
      that.requestReadRecordList(loginInfo.username,headerInfo);
      that.requestRecommendList(settings.global.recent_read_guess_like, 1, 3,headerInfo);
    })

  },
  bindNovelDetail: function (e) {
    var that=this;
    var novelid = e.currentTarget.dataset.bid;
    var chaptercode = e.currentTarget.dataset.cid;


    var rentreadlist = util.wxf.getStorageSync("content_rentreadlist");
    if(this.data.bookmarkEditMode=='1'){
      var index=e.currentTarget.id;
      var newbooklist = that.data.booklist;
      newbooklist[index].delstatus = 0;

      //判断是否全部选中状态
      var choooseCount=0;
      for(var index=0;index<newbooklist.length;index++){
        if(newbooklist[index].delstatus==1){
          choooseCount+=1;
        }
      }
      var selectAny=(choooseCount>0?1:0);
      var selectNo=(choooseCount==0?1:0);
      that.setData({
        booklist: newbooklist,
        bookmarkEditMode:1,
        bookmarkEditSelectAll:0,
        bookmarkEditSelectNo:selectNo,
        bookmarkEditSelectLessThanAll:1,
        bookmarkEditSelectAny:selectAny
      });
      return;
    }


    for (var i = 0; i < rentreadlist.length; i++) {      
      if (rentreadlist[i]['novel_id'] == novelid) {
        chaptercode = rentreadlist[i]['chapter_code'];
        break;
      }
    }

    if (novelid > 0 && chaptercode >= 0) {
      util.wxf.navigateTo('../book/chapter/detail/detail?novelid=' + novelid + '&chaptercode=' + chaptercode);
    }
  },
  //书架编辑-选中单本小说
  bindSelectNovel:function(e){
    var that=this;
    var bookid = e.currentTarget.dataset.bid;
    var index=e.currentTarget.id;
    var newbooklist = that.data.booklist;

    var currentDeleteStatus=newbooklist[index].delstatus;
    var newDeleteStatus=currentDeleteStatus==1 ? 0:1;
    newbooklist[index].delstatus = newDeleteStatus;
    
    //判断是否全部选中状态
    var choooseCount=0;
    for(var index=0;index<newbooklist.length;index++){
      if(newbooklist[index].delstatus==1){
        choooseCount+=1;
      }
    }
    var selectedAll=(choooseCount==newbooklist.length?1:0);
    var lessThanAll=(choooseCount < newbooklist.length?1:0);
    var selectNo = choooseCount==0?1:0;
    var selectAny = choooseCount>0?1:0;
    that.setData({
      booklist: newbooklist,
      bookmarkEditMode:1,
      bookmarkEditSelectAll:selectedAll,
      bookmarkEditSelectNo:selectNo,
      bookmarkEditSelectLessThanAll:lessThanAll,
      bookmarkEditSelectAny:selectAny
    });
 
    wx.hideTabBar({
      
    })

  },
  //编辑书架-返回
  bindExitEditBookMark:function(e){
    var that=this;
    that.setData({
      bookmarkEditMode:0,
      bookmarkEditSelectAll:0,
      bookmarkEditSelectNo:0,
      bookmarkEditSelectLessThanAll:0,
      bookmarkEditSelectAny:0
    });
    wx.showTabBar({
      animation: true,
    });
    util.wxf.switchTab('/pages/bookmark/bookmark');
  },
  //编辑书架-删除选中的书
  bindDeleleSelectedBookMark:function(e){
    var that=this;
    var newbooklist = that.data.booklist;
    var savedbooklist=[];
    var deleteNovelIdArr=[];

    for(var index=0;index<newbooklist.length;index++){
      if(newbooklist[index].delstatus==1){
        deleteNovelIdArr.push(newbooklist[index].novelid);      
      }
      else{
        savedbooklist.push(newbooklist[index]);
      }    
    }
    if(deleteNovelIdArr.length>0){
      var novelIds=deleteNovelIdArr.join(',');
      app.TellGetUser((loginInfo,headerInfo)=>{
        api.request.delBookFavList(
          {
            UN: loginInfo.username,
            NovelIdList: novelIds
          },
          headerInfo,
          function (res) {//success 
            that.setData({
              booklist: savedbooklist,
              bookmarkEditMode:0,
              bookmarkEditSelectAll:0,
              bookmarkEditSelectNo:0,
              bookmarkEditSelectLessThanAll:0,
              bookmarkEditSelectAny:0
            });
            wx.showTabBar({
              animation: true,
            })
          },
          function (res) {//fail           
            that.setData({ 'message.content': '操作失败', 'message.iconPath': '/image/noright.png', 'message.duration': 3000 });
          }
        )
      })

    }
  },
  //编辑书架-选中所有小说
  bindSelectAllBookMark:function(e){
    var that=this;
    var newbooklist = that.data.booklist;
    for(var index=0;index<newbooklist.length;index++){
      newbooklist[index].delstatus = 1;     
    }
    that.setData({
      booklist: newbooklist,
      bookmarkEditMode:1,
      bookmarkEditSelectAll:1,
      bookmarkEditSelectNo:0,
      bookmarkEditSelectLessThanAll:0,
      bookmarkEditSelectAny:1
    });
  },
  //编辑书架-取消选中小说
  bindCancelSelectAllBookMark:function(){
    var that=this;
    var newbooklist = that.data.booklist;
    for(var index=0;index<newbooklist.length;index++){
      newbooklist[index].delstatus = 0; 
    }
    that.setData({
      booklist: newbooklist,
      bookmarkEditMode:1,
      bookmarkEditSelectAll:0,
      bookmarkEditSelectNo:1,
      bookmarkEditSelectLessThanAll:1,
      bookmarkEditSelectAny:0
    });
   
  },
  bindImageToIndex:function(e){
    util.wxf.switchTab('/pages/index/index');
  },
  bindChangeShowType:function(e){   
    var showType=e.currentTarget.dataset.showtype;
    this.setData({showType:showType});
    if(showType=="0"){
      util.wxf.setNavigationBarTitle("阅读记录");
    }
    else if(showType=="1"){
      util.wxf.setNavigationBarTitle("我的书架");
    }
    this.ResetBookMarkState();
  },
  readEvent: function(e) {
    var nid = e.currentTarget.dataset.nid;
    var code = e.currentTarget.dataset.code;
    console.log("nid="+nid+"code="+code);
    wx.navigateTo({
        url: '/pages/book/chapter/detail/detail?novelid=' + nid + '&chaptercode=' + code
    })
 },
  oTs: function (e) {

    var m = this;

    if (m.data.listtype == "recommend") return;

    m._x = e.touches[0].clientX;
    m._y = e.touches[0].clientY;

  },
  oTe: function (e) {
    var id = e.currentTarget.id;
    var m = this;

    if (m.data.listtype == "recommend") return;

    var newbooklist = m.data.booklist;

    m._new_x = e.changedTouches[0].clientX;
    m._new_y = e.changedTouches[0].clientY;

    if (m._new_y - m._y > -100 && m._new_y - m._y < 100 && m._new_x != m._x) {
      if (m._new_x - m._x > 10) {
        newbooklist[id].currentstate = 0;
      }

      if (m._new_x - m._x < -10) {
        newbooklist[id].currentstate = 1;
      }

      m.setData({
        booklist: newbooklist,
        states: id
      });
    }
  },
  bindDel: function (e) {
    var _this = this;
    var bookid = e.currentTarget.dataset.bid;
    var idx = e.currentTarget.dataset.idx;
    if (bookid > 0) {    
      app.TellGetUser((loginInfo,headerInfo)=>{
        api.request.delBookFav(
          {
            UN: loginInfo.username,
            novelid: bookid
          },
          headerInfo,
          function (res) {//success
            var newbooklist = _this.data.booklist;
            newbooklist[idx].delstatus = 1;
            var leftbook = _this.data.totalbook;
            if (_this.data.totalbook > 0) {
              var leftbook = _this.data.totalbook - 1
            }
            _this.setData({
              booklist: newbooklist,
              totalbook: leftbook
            });
            if (_this.data.totalbook < 20) {
              _this.LoadMarkList(true,loginInfo,headerInfo);
            }
          },
          function (res) {//fail
            //  util.wxf.showToast('删除失败，请重试', null, 1000)
            _this.setData({ 'message.content': '操作失败', 'message.iconPath': '/image/noright.png', 'message.duration': 3000 });
          }
        )
      })

    }
  },
  //加载更多
  AddMore: function (e) {
    if (this.data.hasMore)
      return;

    this.LoadMarkList(true);
  },


  //加载收藏的书
  LoadMarkList: function (isadd,loginInfo,headerInfo) {
    var _this = this;
    var markid = _this.data.markid;
    var pagesize = _this.data.pagesize;

    _this.setData({ message: { visiable: true }, hasMore: true })
   
    try {
     
      var data = {};
          if (!isadd) {
            data = {
              un: loginInfo.username,
              pagesize: pagesize
            };
            _this.setData({
              //booklist: [],
              totalbook: 0,
              markid: 0
            });
          } else {
            data = {
              un: loginInfo.username,
              markid: markid,
              pagesize: pagesize
            }
          }
          api.request.bookMarkList(
            data,
            headerInfo,
            function (res) {
              // success
              if (!util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
                var booklists = new Array();
                for (var i = 0; i < res.list.item.length; i++) {
                  var items = util.json.extend({}, [{'delstatus': '0' }, res.list.item[i]], true);
                  booklists[i] = items;
                }

                var curbookcount = util.common.toNumber(res.list.count);
                var totalbooks = _this.data.totalbook + curbookcount;
                var lastmarkid = res.list.item[curbookcount - 1].id;//获取最后书架ID
                if (lastmarkid == markid) {
                  _this.setData({
                    isaddmore: true
                  });
                } else {
                  _this.setData({
                    isaddmore: false
                  });
                }
                // success
                if (!util.common.isEmptyObject(_this.data.booklist) && !util.common.isEmptyObject(booklists)) {
                  _this.setData({ reclist: [] });
                }

                _this.setData({
                  // booklist: _this.data.booklist.concat(booklists),
                  booklist: (isadd ? _this.data.booklist : []).concat(booklists),
                  totalbook: totalbooks,
                  markid: lastmarkid,
                  listtype: 'book',
                  hasMore: false
                });

              } else {
                if (!isadd) {
                  _this.setData({ booklist: [], hasMore: false });
                  //_this.LoadRecommendList();
                }
              }
            }
          )


    } catch (err) {
      _this.setData({ hasMore: false })
    }
  },
   //获取推荐位
   requestRecommendList: function (classId, pageIndex, pageSize,headerInfo) { 
    var that = this;
    var data = {
      ClassId: classId,
      PageIndex: pageIndex,
      PageSize: pageSize
    };
    api.request.recommendList(
      data,
      headerInfo,
      function (res) {            
        if (res && !util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
          
          var resObj = res.list;
          var set;
          switch (resObj.recclassid) {
            case settings.global.recent_read_guess_like: // 阅读记录猜你喜欢
              set = {
                  guessLikeList: resObj.item,                     
              };
              break;                 
            default:
              break;
          }        
          that.setData(set);
        }
      }
    )  
    
  },
  ResetBookMarkState:function(e){
    var that=this;
    var newbooklist = that.data.booklist;
    for(var index=0;index<newbooklist.length;index++){
      newbooklist[index].delstatus = 0; 
    }
    that.setData({
      booklist: newbooklist,
      bookmarkEditMode:0,
      bookmarkEditSelectAll:0,
      bookmarkEditSelectNo:1,
      bookmarkEditSelectLessThanAll:1,
      bookmarkEditSelectAny:0
    });
  },

  // 获取阅读记录
   requestReadRecordList:function(userName,headerInfo) {
    let _this = this;
    api.request.readRecordList({
      UN: userName,
      pageIndex:1,
      pageSize:30
      },
      headerInfo,
      (res) => {
          if (res && !util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list) && !util.common.isEmptyObject(res.list.item)) {
              // 取到阅读记录
              let novelInfo = res.list.item;
              _this.setData({ readList: novelInfo });
          } else {
              _this.setData({ readList: [] });
          }
      })
  }
})

