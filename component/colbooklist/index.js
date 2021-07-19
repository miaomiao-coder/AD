// component/colbooklist/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    colbooklist: {
      type: Array,
      value: [{
        novelid: 1,
        title: '都市极品医神',
        cover: ''
      }]
    },
    hasfouritem: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail: function (obj) {
      var novelId = obj.currentTarget.dataset.novelid;
      console.log(novelId);
      wx.navigateTo({
        url: '/pages/book/detail/detail?novelid=' + novelId
      });
    }
  }
})