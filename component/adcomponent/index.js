// component/adcomponent/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    adunitid:
    {
      type: Object,
      value: {
        type: '',
        id: ""
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindhide:function(){
      this.setData({
        show:false
      })
      console.log("bindhide");
    }
  }
})
