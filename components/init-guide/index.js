// components/init-guide/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    guideList: {
      type: Object,
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
    navigateTo(e) {
      let getId = e.currentTarget.dataset.getid
      let browserId = e.currentTarget.dataset.browserid
      browserId = typeof browserId === 'number' ? browserId.toString() : browserId
      wx.navigateTo({
        url: '/pages/my/myGuideDetail/myGuideDetail?getId=' + getId + '&browserId=' + browserId,
      })
    }
  }
})
