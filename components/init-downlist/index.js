// components/init-downlist/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    // 打开下拉
    showDialog: {
      type: Boolean,
      value: false
    },
    // 内容高度
    showHeight: {
      type: Number,
      value: 0
    },
    // 距离顶部高度
    maskTop: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal: function() {
      var that = this;
      var animation = wx.createAnimation({
        duration: 300, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease', //动画的效果 默认值是linear
      })
      this.animation = animation
      setTimeout(() => {
        that.fadeIn(); //调用显示动画
      }, 100)
    },

    // 隐藏遮罩层
    hideModal: function() {
      this.fadeDown();
    },

    //动画集
    fadeIn: function() {
      this.animation.translateY(0).step()
      this.setData({
        animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
      })
    },

    fadeDown: function() {
      this.animation.translateY(-(this.properties.showHeight)).step()
      this.setData({
        animationData: this.animation.export(),
      })
    },

    // 蒙层点击关闭
    tipHideModal(e) {
      if (e.currentTarget.dataset.self !== 'self') {
        this.hideModal()
        this.triggerEvent('tipHideModal', {}, {})
      }
    }
  }
})