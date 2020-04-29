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
        name: '已阅指南',
        icon: 'iconuser_icon_article',
        path: ''
      },
      {
        name: '实名认证',
        icon: 'iconuser_icon_certification',
        path: ''
      },
      {
        name: '用户协议',
        icon: 'iconuser_icon_agreement',
        path: '/pages/my/userAgreement/userAgreement'
      }
    ],
    userInfo: '',
    isAuth: true, // 是否认证
    isLogin: false // 是否登录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  onShow: function() {
    this.getLoginState()
    this.isAuth()
  },

  // 是否实名认证
  isAuth() {
    storage.remove('authInfo')
    if (getApp().isLogin()) {
      getRealAuth.authSuccess().then(res => {
        this.setData({
          isAuth: res.data ? true : false
        })
        if (res.data) {
          storage.set('authInfo', res.data)
        }
      })
      // 获取用户头像
      getApp().getUserInfo().then(res => {
        this.setData({
          userInfo: res.userInfo
        })
      })
    }
  },

  // 登录
  toLogin() {
    wx.navigateTo({
      url: '/pages/accredit/accredit?isAccredit=false'
    })
  },

  // 判断是否登录
  getLoginState() {
    // 获取用户授权信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          //还没有授权，去授权
          this.setData({
            'centerList[0].path': '/pages/accredit/accredit?isAccredit=false',
            'centerList[1].path': '/pages/accredit/accredit?isAccredit=false',
            isLogin: false
          })
          storage.remove('token')
        } else {
          this.setData({
            'centerList[0].path': getApp().isLogin() ? '/pages/my/myGuide/myGuide' : '/pages/accredit/accredit?isAccredit=false',
            'centerList[1].path': getApp().isLogin() ? '/pages/my/realAuth/realAuth' : '/pages/accredit/accredit?isAccredit=false',
            isLogin: getApp().isLogin() ? true : false
          })
        }
      }
    })
  }
})