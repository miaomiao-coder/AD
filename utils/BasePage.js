var util = require('util.js');
var app = getApp();

var BasePage = function (options) {
  var _page = Page;
  var _options = options;
  var _onload = _options.onLoad;
  _options.onLoad = function (opts) {
    var that = this;

    // demo: onLoad事件方法的options绑定参数
    // opts = util.common.jsonExtend({}, [opts, {
    //   id: 1234
    // }], true);


    // 调用页面的onLoad事件处理程序
 

    app.TellOpts(opts.from,() => {
      app.TellVersionCheck(() => {
        if (_onload) {
          console.log("onload");
          _onload.call(that, opts);
        }
      });
    })
  };
  _page(options);
}

module.exports = BasePage;