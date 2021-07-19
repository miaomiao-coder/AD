// component/rowclasslist/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classlist: {
      type: Array,
      value: [{
        classId: 1,
        className: '未分类',
        isNeedImg: true,
        imgPath: '../../image/class_fire.png',
        bgColor: '#F4ECEA'
      }]
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
    toClassNovelList: function (obj) {
      var classId = obj.currentTarget.dataset.classid;
      var className = obj.currentTarget.dataset.classname;
      if (classId && className) {
        wx.navigateTo({
          url: '/pages/morenovel/index?recid=' + classId + '&classname=' + className
        })
      }
    }
  }
})