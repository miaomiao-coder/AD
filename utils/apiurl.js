const HOST = "https://if.weibabook.com";
// const HOST = "http://mtest.llongbook.com";
// const HOST = "http://localhost:10172";

module.exports = {
  VERSIONCHECK: HOST + "/User/VersionCheck.aspx",
  SESSION: HOST + "/WxApp/User/Auth/GetSession.aspx",
  SESSIONCHECK: HOST + "/WxApp/User/Auth/SessionCheck.aspx",
  LOGIN: HOST + "/WxApp/User/Auth/Login.aspx",
  // 获取用户信息
  GET_USER: HOST + "/WxApp/User/Auth/GetUser.aspx",
  //获取跳转小程序
  GET_NEXTWXAPP: HOST + "/WxApp/Next.aspx",
  //奖品列表
  GET_LOTTEREYLIST: HOST + "/WxApp/Lottery/Turntable/PrizeList.aspx",
  //获取中奖id
  GET_LOTTERYID: HOST + "/WxApp/Lottery/Turntable/GetWinAwardId.aspx",
  //领取奖励
  ADD_LOTTER: HOST + "/WxApp/Lottery/Turntable/Exchange.aspx",
  //获取中奖记录
  GET_LOTTERYLOG: HOST + "/WxApp/Lottery/Turntable/WinAwardList.aspx",

  //获取跳转小程序
  GET_NEXTWXAPP: HOST + "/WxApp/Next.aspx",

  RECOMMEND_LIST: HOST + "/Product/Recommend/List.aspx",

  NOVEL_LIST: HOST + "/Product/List.aspx",
  NOVEL_DETAIL: HOST + "/Product/Detail.aspx",
  NOVEL_CLASS: HOST + "/Product/Class/List.aspx",

  CHAPTER_CONTENT: HOST + "/WxApp/Product/Chapter/Content.aspx",
  CHAPTER_RANGE: HOST + "/Product/Chapter/Range.aspx",
  CHAPTER_LIST: HOST + "/Product/Chapter/List.aspx",
  //章节换购
  CHANGE_CHAPTER: HOST + "/User/Order/ChapterExchange.aspx",
  ORDER_CHAPTER: HOST + "/User/Order/Chapter.aspx",
  ORDER_NOVEL: HOST + "/User/Order/Novel.aspx",
  ORDER_FEELIST: HOST + "/User/Order/FeeList.aspx",
  ORDER_FEECONFIGLIST: HOST + "/User/Order/FeeConfigList.aspx",
  ORDER_GENERATE: HOST + "/User/Order/WxApp/Index.aspx",

  NOVEL_ADDMARK: HOST + "/User/BookFav/Add.aspx",
  NOVEL_MARKLIST: HOST + "/User/BookFav/List.aspx",
  NOVEL_HOTSEARCH: HOST + "/Product/hotsearch/list.aspx",
  NOVEL_DELMARK: HOST + "/User/BookFav/Delete.aspx",
  NOVEL_DELMARKList: HOST + "/User/BookFav/DeleteList.aspx",
  USER_FEE: HOST + "/User/I/GetFee.aspx",
  AD_LIST: HOST + "/Product/Ad/List.aspx",
  READ_RECORD_LIST: HOST + "/Product/Chapter/ReadRecordList.aspx",

  //获取用户余额
  GET_USERFEE: HOST + "/User/I/GetFee.aspx",
  //获取用户
  GetUserByName: HOST + "/User/I/GetUser.aspx",
  //猜你喜欢列表
  GetMayLikeList: HOST + "/Product/LikeList.aspx",
  // 换一换推荐位书
  ReplaceRecList: HOST + "/Product/Recommend/RandomList.aspx"


}