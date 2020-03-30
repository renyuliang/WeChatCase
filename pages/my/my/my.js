// pages/my/my.js
import * as storage from '../../../utils/storage.js'
import {
  realAuthModel
} from '../../../models/realAuth.js';
let getRealAuth = new realAuthModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 我的 模块跳转
    centerList: [{
        name: '我的指南',
        icon: 'iconuser_icon_article',
        path: '/pages/my/myGuide/myGuide'
      },
      {
        name: '实名认证',
        icon: 'iconuser_icon_certification',
        path: '/pages/my/realAuth/realAuth'
      },
      {
        name: '用户协议',
        icon: 'iconuser_icon_agreement',
        path: '/pages/my/userAgreement/userAgreement'
      }
    ],
    userInfo: '',
    isAuth: true // 是否认证
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().getUserInfo().then(res => {
      this.setData({
        userInfo: res
      })
    })
  },

  onShow:function () {
    this.isAuth()
  },

  // 是否实名认证
  isAuth() {
    storage.remove('authInfo')
    getRealAuth.authSuccess().then(res => {
      this.setData({
        isAuth: res.data ? true : false
      })
      if (res.data) {
        storage.set('authInfo', res.data)
      }
    })
  }
})