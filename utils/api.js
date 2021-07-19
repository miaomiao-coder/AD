var apiurl = require('./apiurl.js');
var util = require('./util.js');

var request = {
  headerInfo: {
    v: 'gzwxapp.1.0.3',
    clientId: '0',
    channelId: '',
    tel: '',
    ua: '',
    imsi: '',
    imei: ''
  },
  fail: function() {
    //接口请求失败.
  },
  complete: function() {
    //接口请求完成.
  },
  versionCheck: function(data, header, success, error) {
    util.wxf.request(apiurl.VERSIONCHECK, data, header,
      success, error, this.fail, this.complete)
  },
  getLotteryLog: function(data, header, success, error) {
    util.wxf.request(apiurl.GET_LOTTERYOG, data, header,
      success, error, this.fail, this.complete)
  },
  getLotteryList: function(data, header, success, error) {
    util.wxf.request(apiurl.GET_LOTTEREYLIST, data, header,
      success, error, this.fail, this.complete)
  },
  getLotteryId: function(data, header, success, error) {
    util.wxf.request(apiurl.GET_LOTTERYID, data, header,
      success, error, this.fail, this.complete)
  },
  addLottery: function(data, header, success, error) {
    util.wxf.request(apiurl.ADD_LOTTER, data, header,
      success, error, this.fail, this.complete)
  },
  getLogList: function(data, header, success, error) {
    util.wxf.request(apiurl.GET_LOTTERYLOG, data, header,
      success, error, this.fail, this.complete)
  },
  getFee: function(data, header, success, error) {
    util.wxf.request(apiurl.GET_USERFEE, data, header,
      success, error, this.fail, this.complete)
  },
  recommendList: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.RECOMMEND_LIST, data, header,
      success, error, this.fail, this.complete)
    }
  },
  novelDetail: function(data, header, success, error, complete) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.NOVEL_DETAIL, data, header,
      success, error, this.fail, !util.common.isFunction(complete) ? this.complete : complete)
    }
  },
  chapterList: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.CHAPTER_LIST, data, header,
      success, error, this.fail, this.complete)
    }
  },
  chapterContent: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.CHAPTER_CONTENT, data, header,
      success, error, this.fail, this.complete)
    }
  },
  chapterRange: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.CHAPTER_RANGE, data, header,
      success, error, this.fail, this.complete)
    }
  },
  changeChapter: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.CHANGE_CHAPTER, data, header,
      success, error, this.fail, this.complete)
    }
  },
  orderChapter: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.ORDER_CHAPTER, data, header,
      success, error, this.fail, this.complete)
    }
  },
  orderNovel: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.ORDER_NOVEL, data, header,
      success, error, this.fail, this.complete)
    }
  },
  novelList: function(data, header, success, error, fail, complete) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.NOVEL_LIST, data, header,
      success, error, !util.common.isFunction(fail) ? this.fail : fail, !util.common.isFunction(complete) ? this.complete : complete)
    }
  },
  addBookFav: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.NOVEL_ADDMARK, data, header,
      success, error, this.fail, this.complete)
    }
  },
  getNovelClass: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.NOVEL_CLASS, data, header,
      success, error, this.fail, this.complete)
    }
  },
  bookMarkList: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.NOVEL_MARKLIST, data, header,
      success, error, this.fail, this.complete)
    }
  },
  hotSearchList: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.NOVEL_HOTSEARCH, data, header,
      success, error, this.fail, this.complete)
    }
  },
  delBookFav: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.NOVEL_DELMARK, data, header,
      success, error, this.fail, this.complete)
    }
  },
  delBookFavList: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.NOVEL_DELMARKList, data, header,
      success, error, this.fail, this.complete)
    }
  },
  userFee: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.USER_FEE, data, header,
      success, error, this.fail, this.complete)
    }
  },
  feeList: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.ORDER_FEELIST, data, header,
      success, error, this.fail, this.complete)
    }
  },
  feeConfigList: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.ORDER_FEECONFIGLIST, data, header,
      success, error, this.fail, this.complete)
    }
  },
  generate: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.ORDER_GENERATE, data, header,
      success, error, this.fail, this.complete)
    }
  },
  adList: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.AD_LIST, data, header,
      success, error, this.fail, this.complete)
    }
  },
  readRecordList: function(data, header, success, error) {
    var formvalue=util.wxf.getStorageSync('prevvalue');
    if(formvalue&&formvalue=="test")
    {
    util.wxf.request(apiurl.READ_RECORD_LIST, data, header,
      success, error, this.fail, this.complete)
    }
  },
  goldRuleSet: function(data, header, success, error) {
    util.wxf.request(apiurl.GOLD_RULESET, data, header,
      success, error, this.fail, this.complete)
  },
  userGoldList: function(data, header, success, error) {
    util.wxf.request(apiurl.USER_GOLDLIST, data, header,
      success, error, this.fail, this.complete)
  },
  userFriendsList: function(data, header, success, error) {
    util.wxf.request(apiurl.USER_FRIENDSLIST, data, header,
      success, error, this.fail, this.complete)
  },
  
  mayLikeList: function (data, header, success, error) {
    util.wxf.request(apiurl.GetMayLikeList, data, header,
      success, error, this.fail, this.complete)
  },
  replaceRecList: function (data, header, success, error) {
    util.wxf.request(apiurl.ReplaceRecList, data, header,
      success, error, this.fail, this.complete);
  },

  
}

module.exports = {
  request: request
}