// component/rowbooklist/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ismargin:
    { 
      type: Boolean,
      value: false
    },
    recommend: {
      type: Boolean,
      value: false
    },
    booklist: {
      type: Array,
      value: []
    },
    adidList:{
      type: Array,
      value: []
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
    bindNovelDetail: function (e) {  
      var bid = e.currentTarget.dataset.bid; //图书id
      wx.navigateTo({
          url: '/pages/book/detail/detail?novelid=' + bid
      });
  },
  }
})
