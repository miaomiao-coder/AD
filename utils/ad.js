const util = require("./util");

let adIdList = [{
  type: 1,
  name: "首页",
  insertVedioId: "adunit-d33337fb92b59b44",
  rewardVedioId: ["adunit-165fc1d3e12ec1d7"],
  templeIdList: [{
    type: 1, value: [{ id: "adunit-d81a939382cf55e6" }]
  }]
},
{
  type: 2,
  name: "领取",
  templeIdList: [{
    type: 1, value: [{ id: "adunit-d153870c3210804b" }]
  }]
}]
var AdClass = {
  InterstitialAd: function (interstitial, type, success) {
    console.log("interstitial", adIdList.find(x => x.type == type).insertVedioId);
    if (wx.createInterstitialAd) {
      interstitial = wx.createInterstitialAd({
        adUnitId: adIdList.find(x => x.type == type).insertVedioId
      })
      interstitial.onLoad(() => { console.log('插屏 广告加载成功') })
      interstitial.onError((err) => { console.log('插屏 广告错误', err) })
      interstitial.onClose(() => { console.log('插屏 广告关闭') })
      util.common.isFunction(success) && success(interstitial);
    }
  },
  RewardedVideoAd: function (rewardedVideoAd, type, success, close, index = 0) {
    console.log("rewardedVideoAd" + index, adIdList.find(x => x.type == type).rewardVedioId[index]);
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: adIdList.find(x => x.type == type).rewardVedioId[index] })
      rewardedVideoAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      rewardedVideoAd.onError((err) => {
        console.log('onError event emit', err)
      })
      rewardedVideoAd.onClose((res) => {
        console.log("激励广告结束", res);
        if (res.isEnded) {
          console.log("正常播放结束");
          // 正常播放结束，下发奖励
          util.common.isFunction(close) && close();
        } else {
          console.log("中途退出");
          // util.wxf.showModal('提示信息', '观看完整广告，获取8章无视频清凉阅读体验');
          // 播放中途退出，进行提示
        }
      })
      util.common.isFunction(success) && success(rewardedVideoAd);
    }

  },
  InitCustomAd: function (interstitial, type, success) {
    if (wx.createCustomAd) {
      interstitial = wx.createCustomAd({
        adUnitId: adIdList.find(x => x.type == type).littleId,
        adIntervals: 30,
        style: {
          left: 10,
          top: 400,
          fixed: true
        }
      })
      console.log(adIdList.find(x => x.type == type).littleId);
      interstitial.onLoad(() => { console.log('模板 广告加载成功') })
      interstitial.onError((err) => { console.log('模板 广告错误', err) })
      interstitial.onClose(() => { console.log('模板 广告关闭') })
      interstitial.onHide();
      util.common.isFunction(success) && success(interstitial);
    }
  },
  ShowAd: function (interstitial, adType = 0, fail) {
    console.log("interstitial", interstitial);
    if (interstitial) {
      interstitial.show().catch((err) => {
        console.error("广告 显示错误", err)
        if (adType == 0 || adType == 1) {
          interstitial.load()
            .then(() => interstitial.show())
            .catch(err => {
              console.log('广告 广告显示失败', err)
              util.common.isFunction(fail) && fail();
            })
        }
      })
    }
  },
  GetTempleAdList(success, type, num = 1, subtype = 1) {
    let idList = adIdList.find(x => x.type == type).templeIdList.find(x => x.type == subtype).value;
    console.log(idList);
    if (idList && idList.length > 0) {
      util.common.isFunction(success) && success(util.common.getRandomArrayElements(idList, num));
    }
  },
  GetLimiteIdList(success, type, num = 1) {
    let id = adIdList.find(x => x.type == type).littleId;
    if (id) {
      util.common.isFunction(success) && success(id, num);
    }
  }
}
module.exports = {
  adclass: AdClass
}