// pages/book/chapter/detail/detail.js
var api = require('../../../../utils/api.js')
var change = require('../../../../utils/encrypt/base64.js')
var util = require('../../../../utils/util.js')
var ad = require('../../../../utils/ad.js')
var md5 = require('../../../../utils/encrypt/md5.js')
var settings = require('../../../../utils/settings.js');
var BasePage = require('../../../../utils/BasePage.js');
var app = getApp()
let interstitialAd = null;
let rewardedVideoAd = null
let chapterNum = 1;
let noAdNum = 0;
var base64 = new change.Base64();
BasePage({
  data: {
    novelInfo: {},
    chapterDetail: [],
    systemInfo: {},
    userInfo: {},
    rangeInfo: {},
    novelId: 0,
    chapterCode: 0,
    goldChapterCode: 0,
    direction: '',
    userFee: 0,
    markStatus: false,
    markcontent: '加入书架',
    rentReadList: [],

    //滑动
    currentGesture: 0,
    toTop: -1,

    //设置
    chapterShow: false,
    orderShow: false, //是否显示单章购买
    orderNovelShow: false, // 是否显示全本购买
    bottomshow: false,
    site: false,
    bookimg: '/image/daybook.png',
    detailimg: '/image/daydetail.png',
    shelfimg: '/image/dayshelf.png',

    setItem: {
      night: false,
      light: '50',
      defaultLight: true,
      contentSize: '36',
      defaultcontentSize: true,
      autoOrder: false,
      autoOrder_novelids: [],
      spacing: '200',
      contentbg: '#F6F6EE',
      loading:true,
    },
    spacingItem: [{
      id: '1',
      value: '180'
    },
    {
      id: '2',
      value: '160'
    },
    {
      id: '3',
      value: '140'
    }
    ],
    contentbgItem: [{
      id: '1',
      value: '#F6F6EE'
    },
    {
      id: '2',
      value: '#EBE0CB'
    },
    {
      id: '3',
      value: '#D6E3D4'
    }
    ],
    message: {
      iconPath: '/image/loading.gif',
      visiable: false
    },
    isPay: false,
    fee_name: settings.global.fee_name,
    unitCenterid: {
    },
    unitBottomid: {},
    parentId: 0,
    //存储计时器
    setInter: '',
    num: 1,
    stopnum: 1,
    progress_txt: "",
    hasTask: false,
    receivestatus: 0,
    activeclass: "",
    infoclass: "",
    imageclass: "hide",
    progressclass: "hide",
    successclass: "none",
    minsecond: 0,
    windowWidth: 750,
    readStartTime: 0,
    firstChapterCode: 0,
    hasJump: false,
    continueTip: false,
    loading:true
  },
  onLoad: function (options) {
    let novelid = null;
    let chaptercode = null;
    let parentid = null;
    if (options.q) {
      let url = decodeURIComponent(options.q);
      console.log("q", q);
      novelid = util.common.getQueryString(url, "novelid");
      chaptercode = util.common.getQueryString(url, "chaptercode");
      parentid = util.common.getQueryString(url, "parentid");
      let channelid = util.common.getQueryString(url, "channelid");
      // 设置全局渠道号 
      if (channelid)
        app.globalData.headerInfo.channelId = channelid;
    }
    var that = this;
    that.setData({
      novelId: novelid ? novelid : options.novelid,
      chapterCode: chaptercode ? chaptercode : options.chaptercode,
      parentId: parentid ? parentid : options.parentid ? options.parentid : 0,
      firstChapterCode: chaptercode ? chaptercode : options.chaptercode
    })
    const res = wx.getSystemInfoSync()
    that.setData({
      windowWidth: res.windowWidth
    })
    app.getSystemInfo(function (systemInfo) {
      that.setData({
        systemInfo: systemInfo
      })
    })
    // this.getpropAd();
      this.getSync();
      this.getInfo(true);
    /*获取支付开关 */
    var isPayType = util.wxf.getStorageSync('isPay');
    that.setData({
      isPay: isPayType == 'yes' ? true : false,
      loading:false
    });
   
  },
  getpropAd: function () {
    ad.adclass.InterstitialAd(interstitialAd, 4, (result) => {
      interstitialAd = result;
    });

    ad.adclass.RewardedVideoAd(rewardedVideoAd, 4, noAdNum, (result) => {
      rewardedVideoAd = result;
    }, () => {
      this.chapterTicket();
    });

    // ad.adclass.GetTempleAdList((idList) => {
    //   this.setData({
    //     unitBottomid: idList[0]
    //   });
    // }, 4, 1, 2)
  },
  propShow: function () {
    // console.log("显示插屏");
    // ad.adclass.ShowAd(interstitialAd);
  },
  rewardShow: function () {
    var that = this;
    ad.adclass.ShowAd(rewardedVideoAd, 1, () => {
      util.wxf.showModal('暂无激励广告', '是否跳转大转盘获取金币?', () => {
        that.requestAdList("lottery");
      });
    });
  },
  requestAdList: function (wxatype, success) {
    var that = this;
    var data = {
      wxaid: settings.global.wxaid,
      wxatype: wxatype
    };
    // 显示加载等待
    app.getHeaderInfo(function (headerInfo) {
      api.request.getNextWxapp(
        data,
        headerInfo,
        function (res) {
          if (res && !util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.detail)) {
            console.log("requestAdList", res);
            var ad = res.detail;
            if (ad) {
              that.setData({
                hasJump: true
              })
              if (wxatype == "lottery") {
                util.wxf.navigateToMiniProgram(ad.appid, "pages/index/index?sourcename=" + app.globalData.navigationBarTitle, {}, () => {
                  util.common.isFunction(success) && success();
                });
              }
              else if (wxatype == "novel") {
                util.wxf.navigateTo("../../../webview/detail?url=" + ad.wxmppath);
              }
            }
          }
        }
      )
    })
  },
  onShow: function () {
    // 在适合的场景显示插屏广
    this.setData({
      readStartTime: new Date(),
      site: false
    })
    console.log("onShow",this.data.loading);
    if (this.data.loading == true)
      this.macksector(120, 120, 100, "sector");
  },
  macksector:function(x,y,r,id,c="#454C56"){
    var ctx = wx.createContext();
    var array = [30, 30, 30,30,60];
    var arrayposition = [];
    var colors = ["#228B22", "#008B8B","#ADFF2F","#22b6B4","#00bb33"];
    var total = 0;
    for (var val = 0; val < array.length; val++) {
    total += array[val];
    }
    for (var i = 0; i < array.length; i++) {
      ctx.beginPath();
      var start = 0;
      if (i > 0) {
        for (var j = 0; j < i; j++) {
          start += array[j] / total * 2 * Math.PI;
        }
      }
      
      let width=r/2*Math.cos(start + array[i] / total * 2 * Math.PI/2)
      let height=r/2*Math.sin(start + array[i] / total * 2 * Math.PI/2)
      console.log(x+width,y+height);
      arrayposition.push({w:x+width,h:y+height});

      ctx.arc(x, y, r, start, start + array[i] / total * 2 * Math.PI, false);
      ctx.setLineWidth(2)
      ctx.lineTo(x, y);
      ctx.setStrokeStyle('#F5F5F5');
      ctx.setFillStyle(colors[i]);
      ctx.fill();
      ctx.closePath();
      ctx.stroke();
    }
    for (var i = 0; i < array.length; i++) {
      ctx.setFillStyle('red')
      ctx.setFontSize(20)
      ctx.fillText(array[i], arrayposition[i].w, arrayposition[i].h);
      ctx.setTextAlign('center')
    }
    wx.drawCanvas({
      canvasId: id,//画布标识，对应
      actions: ctx.getActions()//导出context绘制的矩形路径并显示到页面
    })
  },
  getPoint: function (cb) {
    var that = this;
    app.getHeaderInfo(function (headerInfo) {
      api.request.goldRuleSet({}, headerInfo, function (res) {
        if (res && !util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.detail)) {
          cb(res.detail);
        }

      })
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: that.data.novelInfo.title,
        path: '/pages/book/chapter/detail/detail?novelid=' + that.data.novelId + '&chaptercode=' + that.data.goldChapterCode + '&from=test',
        imageUrl: that.data.novelInfo.small_cover == '' ? '/image/defaultcover.png' : that.data.novelInfo.small_cover
      }
    }
    return {
      title: that.data.novelInfo.title,
      path: '/pages/book/chapter/detail/detail?novelid=' + that.data.novelId + '&chaptercode=' + that.data.goldChapterCode + '&from=test',
      imageUrl: that.data.novelInfo.small_cover == '' ? '/image/defaultcover.png' : that.data.novelInfo.small_cover
    }
  },
 
  onHide: function () {
    // 锁屏
    console.log("锁屏")
    var that = this;
    that.setData({
      stopnum: that.data.num
    })
    // clearInterval(that.data.setInter);
  },
  onUnload: function () {

    // 离开该页面
    // var that = this;
    // clearInterval(that.data.setInter);
    // that.readContent();
    // var interList = util.wxf.getStorageSync("interList");
    // for (var i = 0; i < interList.length; i++)
    // {
    //   clearInterval(interList[i]);
    // }
    // util.wxf.removeStorageSync("interList");
  },
  checkDateInfo: function (dateTime) {
    var olddate = new Date(dateTime);
    //olddate = olddate.getMilliseconds();
    var result = 0;
    var month = 1000; //将ms转换成天
    var just = new Date().getTime(); //获取当前时间，单位ms
    var diff = just - olddate;
    if (diff <= 0) {
      return result;
    }
    var mm = diff / month;
    mm = mm.toFixed(); //取整
    result = parseInt(mm); //转换类型
    return result;
  },
  getInfo: function (load, senter) {
    var that = this;
    var chapter_code = that.data.chapterCode;
    if (load) {
      that.getNovelIfno();
      that.getRange();
      that.getMarkStatus();
    }
    else {
      that.getContent();
    }
  },
  getUserInfo: function (cb) {
    var that = this;
    if ((app.globalData.userInfo && !util.common.isEmptyObject(app.globalData.userInfo)) && (app.globalData.loginInfo && !util.common.isEmptyObject(app.globalData.loginInfo))) {
      util.common.isFunction(cb) && cb(app.globalData.userInfo)
    } else {
      var session = null;
      that.checkSession(function (sessionInfo) {
        if (sessionInfo && !util.common.isEmptyString(sessionInfo)) {
          util.wxf.setStorageSync("session", encodeURIComponent(sessionInfo.session));
          // util.wxf.getUserInfo(function (userInfo) {
          //   app.globalData.userInfo = userInfo;
          //   util.common.isFunction(cb) && cb(session, userInfo)
          // }, null, function () {

          // })
        }
      });
    }
  },
  checkSession: function (cb) {
    var that = this;
    var session = util.wxf.getStorageSync("session");
    if (session == null || session == undefined || util.common.isEmptyString(session)) {
      console.log("parentId=" + that.data.parentId)
      app.getOpenId(function (sessionInfo) {
        util.common.isFunction(cb) && cb(sessionInfo)
      }, that.data.parentId)
    };

  },
  getNovelIfno: function () {
    var that = this;
    app.getHeaderInfo(function (headerInfo) {
      api.request.novelDetail({
        novelid: that.data.novelId
      },
        headerInfo,
        (res) => {
          if (!util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.detail)) {
            if (res.detail.content_type > 0) {
              util.wxf.redirectTo('../../../error/error?msg=&desc=该功能暂未开放&mainAction=首页');
            } else {
              util.wxf.setNavigationBarTitle(res.detail.title)
              that.setData({
                novelInfo: res.detail
              })
              that.getContent();
            }
          }
        }
      );
    });
  },
  getContent: function () {
    console.log("getContent");
    var that = this;
    var novel_id = that.data.novelId;
    var chapter_code = parseInt(that.data.chapterCode);
    var freeChapterCount = parseInt(that.data.novelInfo.free_chapter_count);
    var destChapterCode = 0;
    var chapterDetail = [];
    that.setData({
      'message.visiable': false,
      'message.iconPath': '/image/loading.gif',
      'message.duration': 30000,
      'message.content': '正在加载'
    });
    // msg.show.call(that, that.data.message);
    if (util.common.isNumber(novel_id) > 0) {
      app.getHeaderInfo(function (headerInfo) {
        api.request.chapterContent({
          NovelId: novel_id,
          ChapterCode: chapter_code,
          UN: app.globalData.userInfo.username,
          Direction: that.data.direction
        },
          headerInfo,
          (res) => {
            if (res && !util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.detail) && !util.common.isEmptyObject(res.userinfo)) {
              
              that.setData({
                chapterDetail: res.detail,
                userFee: Number(res.userinfo.fee) + Number(res.userinfo.ticketfee),
                chapterCode: res.detail.chapter_code,
                direction: '',
                toTop: 0,
                chapterShow: false,
                goldChapterCode: res.detail.chapter_code,
                hasJump: false,
                loading:false
              })
              if (res.detail.isread == 'no') {
                  if (that.data.setItem.autoOrder && res.userinfo.fee >= res.detail.fee) {
                    that.chapterOrder()
                  } else {
                    that.setData({
                      chapterShow: false,
                      orderShow: (that.data.novelInfo.feetype == 'chapter' || that.data.novelInfo.feetype == 'novelchapter'),
                      orderNovelShow: that.data.novelInfo.feetype == 'novel'
                    })
                  }
              } else {
                that.setData({
                  chapterShow: true,
                  orderShow: false,
                  orderNovelShow: false
                })
                that.propShow();
              }
              that.rentReadList();
              // ad.adclass.GetTempleAdList((idList) => {
              //   that.setData({
              //     unitCenterid: idList
              //   });
              // }, 4, res.detail.content.length + 1)
            } else {
              that.setData({
                chapterDetail: [],
                userFee: 0,
                direction: '',
                orderShow: false,
                orderNovelShow: false
              })
            }
          })
      })
    }

  },
  error: function () {
    let that = this;
    if (that.data.message.visiable) {
      that.setData({
        'message.visiable': false
      });
    }
    util.wxf.redirectTo('/pages/error/error?msg=出错啦&desc=无法获取您的用户信息&mainAction=授权登录&actionType=login');
  },
  chapterTicket: function () {
    var that = this
    var novel_id = that.data.novelId;
    var chapter_code = that.data.chapterCode;

    app.getHeaderInfo(function (headerInfo) {
      let loginInfo=app.globalData.userInfo;
        console.log("changeChapter",loginInfo);
        let un=base64.encode(base64.xor_encrypt(settings.global.loginkey, base64.encode(loginInfo.username)))
        console.log("changeChapter",un);
        if (util.common.isNumber(novel_id) > 0 && !util.common.isEmptyString(un)) {
          api.request.changeChapter({
            novelid: novel_id,
            chaptercode: chapter_code,
            un: un, //加密用户名
            sign: md5.hex_md5(loginInfo.username + '|' + novel_id + '|' + chapter_code + '|2016ChatReaderOrderKey')
          },
            headerInfo,
            (res) => {
              console.log("解锁结果", res);
              if (res && !util.common.isEmptyObject(res) && res.ret_result.ret_code == 1) {
                util.wxf.showToast('解锁成功', '', 2000);
                that.getContent()
              }
            },
            (res) => {
              console.log(res);
              if (res&&res.ret_result&&res.ret_result.ret_code == 11060) {
                util.wxf.showToast('解锁成功', '', 2000);
                that.getContent()
              }
              else {
                util.wxf.showModal('提示信息', '解锁失败', '确定', '取消');
              }
            })
        }
      }, () => {
        that.error()
      })

  },
  
  //章节范围
  getRange: function () {
    var that = this;

    app.getHeaderInfo(function (headerInfo) {
      api.request.chapterRange({
        NovelId: that.data.novelId
      },
        headerInfo,
        (res) => {
          if (res &&
            !util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.detail)) {
            that.setData({
              rangeInfo: res.detail
            })
          } else {
            that.setData({
              rangeInfo: {}
            })
          }
        })
    })
  },
  //收藏状态
  getMarkStatus: function () {
    var that = this;
    app.getHeaderInfo(function (headerInfo) {
      app.isLogin((loginInfo) => {
        api.request.bookMarkList({
          UN: loginInfo.username,
          novelid: that.data.novelId
        },
          headerInfo,
          function (res) {
            if (!util.common.isEmptyObject(res) && !util.common.isEmptyObject(res.list)) {
              if (res.list.count > 0) {
                that.setData({
                  markStatus: true,
                  markcontent: '已在书架'
                });
                that.setData({
                  shelfimg: that.data.setItem.night == true ? that.data.markStatus ? '/image/nighthasshelf.png' : '/image/nightshelf.png' : that.data.markStatus ? '/image/dayhasshelf.png' : '/image/dayshelf.png',
                })
              }
            }
          }
        );
      }, () => {
        // util.wxf.showToast('身份识别失败，请重新登录', null, 1000)
      });
    });
  },
  //顶部-收藏
  btnMark: function () {
    var that = this;
    console.log(that.data.markStatus);
    if (!that.data.markStatus) {
      this.addMark()
    } else {
      this.delMark()
    }
  },
  addMark: function () {
    var that = this;

    var novel_id = that.data.novelId;
    var chapter_code = that.data.chapterCode;
    if (!that.data.markStatus && novel_id > 0) {
      app.getHeaderInfo(function (headInfo) {
        app.isLogin((loginInfo) => {
          api.request.addBookFav({
            novelid: novel_id,
            chaptercode: chapter_code,
            un: loginInfo.username
          },
            headInfo,
            (res) => {
              if (!util.common.isEmptyObject(res)) {
                that.setData({
                  markStatus: true,
                  markcontent: '已在书架'
                });
                that.setData({
                  shelfimg: that.data.setItem.night == true ? that.data.markStatus ? '/image/nighthasshelf.png' : '/image/nightshelf.png' : that.data.markStatus ? '/image/dayhasshelf.png' : '/image/dayshelf.png',
                })
              }
            },
            function (res) {
              util.wxf.showModal('提示信息', '加入书架失败', '确定', '取消');
            }
          )
        }, () => {
          that.setData({
            'message.visiable': false,
            'message.iconPath': '/image/noright.png',
            'message.duration': 3000,
            'message.content': '未授权'
          });
        })
      })
    }
  },
  delMark: function () {
    var that = this;
    var novel_id = that.data.novelId;
    var chapter_code = that.data.chapterCode;
    if (that.data.markStatus && novel_id > 0) {
      app.getHeaderInfo(function (headInfo) {
        app.isLogin((loginInfo) => {
          api.request.delBookFav({
            novelid: novel_id,
            un: loginInfo.username
          },
            headInfo,
            function (res) {
              if (!util.common.isEmptyObject(res)) {
                that.setData({
                  markStatus: false,
                  markcontent: '加入书架'
                });
                that.setData({
                  shelfimg: that.data.setItem.night == true ? that.data.markStatus ? '/image/nighthasshelf.png' : '/image/nightshelf.png' : that.data.markStatus ? '/image/dayhasshelf.png' : '/image/dayshelf.png',
                })
              }
            },
            function (res) {
              if (!util.common.isEmptyObject(res)) {
                util.wxf.showModal('提示信息', '删除书架失败', '确定', '取消');
              }
            }
          )
        }, () => {
          that.setData({
            'message.visiable': false,
            'message.iconPath': '/image/noright.png',
            'message.duration': 3000,
            'message.content': '未授权'
          });
        })
      })
    }
  },
  //余额不足，去充值
  toPay: function () {
    if (this.data.isPay) {
      util.wxf.redirectTo('../../../user/order/recharge/recharge')
    } else {
      util.wxf.redirectTo('../../../error/error?msg=温馨提醒&desc=小程序暂不提供收费章节阅读&mainAction=&actionType=');
    }
  },
  //顶部-更多-到书籍详情
  toNovelDetail: function () {
    util.wxf.redirectTo('../../detail/detail?novelid=' + this.data.novelId)
  },
  //底部-显示/隐藏
  bottomShow: function (e) {
    var h = this.data.systemInfo.windowHeight / 3
    //if (e.detail.y > h && e.detail.y < h * 2)
    this.setData({
      bottomshow: !this.data.bottomshow,
      site: false
    })
  },
  //底部-目录
  toChapterList: function () {
    util.wxf.redirectTo('../list/list?id=' + this.data.novelId + '&chapterCode=' + this.data.chapterCode)
  },
  toIndex: function () {
    util.wxf.switchTab('../../../index/index')
  },
  toDetail: function () {
    util.wxf.redirectTo('../../detail/detail?novelid=' + this.data.novelId)
  },
  //底部-夜间
  siteNight: function () {
    this.siteing({
      'night': !this.data.setItem.night
    })
    util.wxf.setNavigationBarBackgroundColor(this.data.setItem.night ? '#373737' : '#F08219')
  },
  //底部-设置显示/隐藏
  siteShow: function () {
    this.setData({
      site: true
    })
  },
  taggleSite: function () {
    this.setData({
      site: !this.data.site
    })
    console.log(this.data.site)
  },
  //设置-亮度
  siteLight: function (e) {
    util.wxf.setScreenBrightness(e.detail.value)
    this.siteing({
      'light': e.detail.value,
      'defaultLight': false
    })
  },
  //设置-默认亮度
  siteDefaultLight: function (e) {
    util.wxf.setScreenBrightness(50)
    this.siteing({
      'light': 50,
      'defaultLight': e.detail.value
    })
  },
  //设置-字体大小
  siteContentSize: function (e) {
    this.siteing({
      'contentSize': e.detail.value,
      'defaultcontentSize': false
    })
  },

  addContentSize: function (e) {
    // e.stopPropagation();
    if (Number(this.data.setItem.contentSize) <= 46) {
      this.siteing({
        'contentSize': Number(this.data.setItem.contentSize) + 2,
        'defaultcontentSize': false
      })
    }
  },
  mimusContentSize: function (e) {
    if (Number(this.data.setItem.contentSize) >= 34) {
      this.siteing({
        'contentSize': Number(this.data.setItem.contentSize) - 2,
        'defaultcontentSize': false
      })
    }
  },
  //设置-默认字体大小
  siteDefaultContentSize: function (e) {
    this.siteing({
      'contentSize': 36,
      'defaultcontentSize': e.detail.value
    })
  },
  //设置-自动购买下一章
  siteAutoOrder: function (e) {
    this.siteing({
      'autoOrder': !this.data.setItem.autoOrder
    })
  },
  //设置-正文间距
  siteSpacing: function (e) {
    this.siteing({
      'spacing': e.currentTarget.dataset.spacingvalue
    })
  },
  //设置-内容背景
  siteContentbg: function (e) {
    this.siteing({
      'contentbg': e.currentTarget.dataset.contentbgvalue,
      'night': false
    })
    util.wxf.setNavigationBarBackgroundColor('#F08219')
  },
  //设置-同步
  siteing: function (objkey) {
    for (var key in objkey) {
      this.data.setItem[key] = objkey[key]
    }

    var list = this.data.setItem['autoOrder_novelids']
    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        if (list[i] === this.data.novelId) {
          list.splice(i, 1)
        }
      }
    }

    if (this.data.setItem['autoOrder']) {
      list.push(this.data.novelId)
    }

    this.data.setItem['autoOrder_novelids'] = list
    this.setData({
      setItem: this.data.setItem
    })

    //同步
    util.wxf.setStorageSync('content_settings', this.data.setItem)

    this.setData({
      bookimg: this.data.setItem.night == true ? '/image/nightbook.png' : '/image/daybook.png',
      detailimg: this.data.setItem.night == true ? '/image/nightdetail.png' : '/image/daydetail.png',
      shelfimg: this.data.setItem.night == true ? this.data.markStatus ? '/image/nighthasshelf.png' : '/image/nightshelf.png' : this.data.markStatus ? '/image/dayhasshelf.png' : '/image/dayshelf.png',
    })

  },
  //同步阅读记录
  rentReadList: function () {
    var that = this
    var list = this.data.rentReadList

    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].novel_id === that.data.novelId || i > 28) {
          list.splice(i, 1)
        }
      }
    }

    var arr = {
      "novel_id": that.data.novelId,
      "novel_name": that.data.novelInfo.title,
      "chapter_name": that.data.chapterDetail.chapter_name,
      "chapter_code": that.data.chapterCode,
    }
    list.unshift(arr)
    this.setData({
      rentReadList: list
    })

    util.wxf.setStorageSync('content_rentreadlist', list)
  },
  //同步数据
  getSync: function () {
    var that = this
    var content_settings = util.wxf.getStorageSync('content_settings')
    if (!util.common.isEmptyObject(content_settings)) {
      that.setData({
        setItem: content_settings
      })
      that.setData({
        'setItem.autoOrder': contains(content_settings.autoOrder_novelids, that.data.novelId)
      })
      util.wxf.setNavigationBarBackgroundColor(this.data.setItem.night ? '#373737' : '#F08219')
    }

    var content_rentreadlist = util.wxf.getStorageSync('content_rentreadlist')
    if (!util.common.isEmptyObject(content_rentreadlist)) {
      that.setData({
        rentReadList: content_rentreadlist
      })
    }
    this.setData({
      bookimg: this.data.setItem.night == true ? '/image/nightbook.png' : '/image/daybook.png',
      detailimg: this.data.setItem.night == true ? '/image/nightdetail.png' : '/image/daydetail.png'
    })
  },
  toPre: function () {
    this.setData({
      successclass: 'none',
      progressclass: 'hide',
      stopnum: 1,
      direction: 'pre',
      imageclass: "hide"
    })
    // clearInterval(this.data.setInter);
    // var interList = util.wxf.getStorageSync("interList");
    // for (var i = 0; i < interList.length; i++) {
    //   clearInterval(interList[i]);
    // }
    // util.wxf.removeStorageSync("interList");
    this.getInfo()
  },
  toNext: function () {
    this.setData({
      continueTip: false
    })
    // if (this.data.chapterDetail.isjumpchapter=="yes"&&Number(this.data.chapterCode) % this.data.chapterDetail.jumpchaptercount == 0 && (this.data.chapterCode + 1) - Number(this.data.firstChapterCode) >= this.data.chapterDetail.serieschaptercount && this.data.hasJump == false) {
      
    //   this.requestAdList("novel", () => { });
    // }
    // else {
      chapterNum++;
      if (noAdNum - 1 == 8) {
        noAdNum = 0;
      }
      noAdNum++;
      // clearInterval(this.data.setInter);
      // var interList = util.wxf.getStorageSync("interList");
      // for (var i = 0; i < interList.length; i++) {
      //   clearInterval(interList[i]);
      // }
      // util.wxf.removeStorageSync("interList");
      this.setData({
        direction: 'next',
        successclass: 'none',
        progressclass: 'hide',
        stopnum: 1,
        imageclass: "hide"
      })
      this.getInfo()
    // }
  },
  //
  oTs: function (e) {
    var m = this;

    util.common.log(e)
    m._x = e.touches[0].clientX;
    m._y = e.touches[0].clientY;
  },
  oTe: function (e) {
    var m = this;

    util.common.log(e)
    m._new_x = e.changedTouches[0].clientX;
    m._new_y = e.changedTouches[0].clientY;

    if (m._new_y - m._y > -50 && m._new_y - m._y < 50) {
      if (m._new_x - m._x > 100) {
        m.data.currentGesture = 2
        if (m.data.rangeInfo.min_chaptercode != m.data.chapterCode) {
          this.setData({
            direction: 'pre'
          })
          this.getInfo()
        }
      }

      if (m._new_x - m._x < -100) {
        m.data.currentGesture = 1
        if (m.data.rangeInfo.max_chaptercode != m.data.chapterCode) {
          this.setData({
            direction: 'next'
          })
          this.getInfo()
        }
      }
    }
  },
  oTh: function (e) {
    this.setData({
      toTop: e.detail.scrollTop
    });
  },
  a_title: function () {
    return;
  },
  // 显示全本订购视图
  showOrderChapterView: function () {
    this.setData({
      orderShow: true,
      orderNovelShow: false
    })
  },
  // 显示全本订购视图
  showOrderNovelView: function () {
    this.setData({
      orderShow: false,
      orderNovelShow: true
    })
  },
  getGold: function (success, data) {
    var that = this;
    app.getUserInfo((userInfo) => {
      api.request.getGold({
        UN: app.globalData.loginInfo.username,
        NovelId: data.novel_id ? data.novel_id : 0,
        ChapterCode: data.chapter_code ? data.chapter_code : 0,
        RuleType: data.ruleType,
        parentId: data.parentId ? data.parentId : 0
      }, {},
        (res) => {
          if (!util.common.isEmptyObject(res)) {
            if (res.ret_result.ret_code == 1) {
              util.common.isFunction(success) && success()
            }
          } else {
            if (that.data.ruleType == 7) {
              wx.showToast({
                title: '领取失败',
                icon: 'fail',
                duration: 2000
              })
            }
          }
        },
        function () {
          if (that.data.ruleType == 7) {
            wx.showToast({
              title: '领取失败',
              icon: 'fail',
              duration: 2000
            })
          }
        }
      );
    })
  },
  tohome: function () {
    clearInterval(this.data.setInter);
    util.wxf.switchTab('../../../index/index');
  },
  OpenVip: function () {
    // this.rewardShow();
    util.wxf.switchTab('../../../index/index');
  },
  FreeChapter:function()
  {
    this.chapterTicket();
  },
  OpenBigWheel: function () {
    this.requestAdList("lottery", () => { this.setData({ continueTip: true }) });
  }
})

function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (parseInt(arr[i]) === parseInt(obj)) {
      return true;
    }
  }
  return false;
}

