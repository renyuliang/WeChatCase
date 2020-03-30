// pages/codeLogin/codeLogin.js
import {
  isPhone
} from '../../utils/is.js'
import {
  loginModel
} from '../../models/login.js';
let getLogin = new loginModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否填写完成信息
    canLogin: false,
    isPhone: false,
    isCode: false,
    getPhone: '',
    // 是否可以发送验证码
    sendCode: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.isCanLogin()
  },

  // 隐藏直接到首页的button
  onShow() {
    wx.hideHomeButton()
  },

  initBlurPhone(e) {
    let phone = e.detail.value
    this.setData({
      isPhone: isPhone(phone) ? true : false
    })
    if (!isPhone(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    } else {
      this.setData({
        sendCode: true,
        getPhone: phone
      })
    }
    this.isCanLogin()
  },

  initBlurCode(e) {
    let code = e.detail.value
    this.setData({
      isCode: code.length ? true : false
    })
    if (!code.length) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }
    this.isCanLogin()
  },

  isCanLogin() {
    this.setData({
      canLogin: this.data.isPhone && this.data.isCode ? true : false
    })
  },

  formSubmit(e) {
    if (!this.data.canLogin) {
      return false
    }
    // 请求注册
    getLogin.registerCode(e.detail.value.phone, e.detail.value.code).then(result => {
      return getLogin.login()
    }).then(res => {
      getApp().codeSuccess(res.stateCode, function () {
        // 获取token
        getApp().storeToken(res.data.tokenMarkName, res.data.tokenValue)
        wx.switchTab({
          url: '/pages/index/index'
        })
      })
    })
  }
})