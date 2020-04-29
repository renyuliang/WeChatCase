// components/init-guide/index.js
import {
  guideDetail
} from '../../models/guideDetail.js';
let guideItem = new guideDetail();
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  externalClasses: ['init-guide'],
  properties: {
    //指南列表
    guideList: {
      type: Object,
      value: ''
    },
    // 已阅组件 显示头部时间
    showDate: {
      type: Boolean,
      value: false
    },
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
      let browserId = ''
      if (getApp().isLogin()) {
        // 登录
        if (e.currentTarget.dataset.browserid) {
          browserId = typeof e.currentTarget.dataset.browserid === 'number' ? e.currentTarget.dataset.browserid.toString() : e.currentTarget.dataset.browserid
          wx.navigateTo({
            url: '/pages/my/myGuideDetail/myGuideDetail?getId=' + getId + '&browserId=' + browserId
          })
        } else {
          wx.navigateTo({
            url: '/pages/my/myGuideDetail/myGuideDetail?getId=' + getId
          })
        }
      } else {
        // 未登录
        wx.navigateTo({
          url: '/pages/my/myGuideDetail/myGuideDetail?getId=' + getId
        })
      }
    }
  }
})