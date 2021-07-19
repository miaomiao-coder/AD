// custom-tab-bar/index.js
var util = require('../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myProperty: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    list: [ {
      pagePath: "/pages/index/index",
      text: "大转盘"
    },
    {
      pagePath: "/pages/canvas/index",
      text: "画布特效"
    }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e){
      const data = e.currentTarget.dataset
      var url = data.url;
      this.setData({
        selected: data.index
      })
      wx.switchTab({url})
    },
  }
})
