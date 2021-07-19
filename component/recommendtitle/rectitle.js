// component/recommendtitle/rectitle.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '今日热书'
    },
    moreTitle: {
      type: String,
      value: '更多'
    },
    moreImgPath: {
      type: String,
      value: '../../image/right_arrow.png'
    },
    rectype: {
      type: String,
      value: ''
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
    moreOperate: function(obj) {
      var rec_classid = obj.currentTarget.dataset.rectype;
      if(rec_classid){
        this.triggerEvent('moretap', rec_classid);
      }
    }
  }
})