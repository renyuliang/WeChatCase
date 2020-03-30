// pages/accredit/accredit.js
import {
  loginModel
} from '../../models/login.js';
let getLogin = new loginModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAccredit: false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      isAccredit: JSON.parse(options.isAccredit)
    })
  },
  bindGetUserInfo: function(e) {
    const vm = this;
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '授权中...',
      })
      getApp().userLogin(function(){
        vm.setData({
          isAccredit: true
        })
      })
    }
  },

  bindgetphonenumber(e) {
    if (e.detail.iv) {
      getLogin.defaultPhone(e.detail).then(res=>{
        return getLogin.registerPhone(res.data)
      }).then(resgister=>{
        return getLogin.login()
      }).then(success=>{
        getApp().codeSuccess(success.stateCode, function () {
          // 获取token
          getApp().storeToken(success.data.tokenMarkName, success.data.tokenValue)
          wx.switchTab({
            url: '/pages/index/index'
          })
        })
      })
    }
  },
  // 隐藏直接到首页的button
  onShow() {
    wx.hideHomeButton()
  }
})