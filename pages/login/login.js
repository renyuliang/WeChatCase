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
    getPhone: ''
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
    if (!isPhone(e.detail.value)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    }
  },

  initInputPhone(e) {
    this.setData({
      isPhone: isPhone(e.detail.value) ? true : false,
      getPhone: isPhone(e.detail.value) ? e.detail.value : ''
    })
    this.isCanLogin()
  },

  initBlurCode(e) {
    if (!e.detail.value.length) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }
  },

  initInputCode(e){
    this.setData({
      isCode: e.detail.value.length === 4 ? true : false
    })
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
      if (result.stateCode === '000000') {
        return getLogin.login()
      }
    }).then(res => {
      if (res.stateCode === '000000') {
        // 获取token
        getApp().storeToken(res.data.tokenMarkName, res.data.tokenValue)
        getApp().initAddress()
      }
    })
  }
})