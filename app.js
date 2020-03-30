import * as storage from './utils/storage.js'
// 调用登录接口
import {
  loginModel
} from './models/login.js';
let getLogin = new loginModel()
App({
  globalData: {

  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {
    let vm = this;
    // 保存登录成功后的taoken  登录成功后，调试这个，现在是假的

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，调用登录，获取code
          vm.userLogin(function () {
            // 需要先授权（注册）
            wx.redirectTo({
              url: '/pages/accredit/accredit?isAccredit=true'
            })
          })
        } else {
          //还没有授权，去授权
          wx.redirectTo({
            url: '/pages/accredit/accredit?isAccredit=false'
          })
        }
      }
    })
  },

  //保存用户的 token
  storeToken(key, value) {
    storage.remove('token')
    let obj = {
      'key': key,
      'value': value
    }
    storage.set('token', obj)
  },

  // 获取用户信息
  getUserInfo: function() {
    return new Promise((resolve, reject) => {
      // 获取用户信息
      // 默认已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
      wx.getUserInfo({
        success: (info) => {
          resolve(info.userInfo)
        }
      })
    })
  },
  
  // 请求状态为000000时的判断
  codeSuccess(res,fun){
    if (res === '000000') {
      fun()
    }
  },

  // 用户登录
  userLogin(initfun) {
    wx.login({
      success: res => {
        // code 换 unioid
        getLogin.unioid(res.code).then(getCode => {
          let obj = {
            openId: getCode.data.openid,
            unionId: getCode.data.unionid,
            randomCode: getCode.data.randomCode
          }
          storage.remove('OpenUnioid')
          storage.set('OpenUnioid', obj)
          return getLogin.login()
        }).then(resLogin => {
          wx.hideLoading()
          if (resLogin.stateCode === '000000') {
            // 获取token
            getApp().storeToken(resLogin.data.tokenMarkName, resLogin.data.tokenValue)
            // 登录成功，跳转页面
            wx.switchTab({
              url: '/pages/index/index'
            })
            this.getUserInfo().then(user => {
              return getLogin.updateInfo(user)
            })
          } else {
            // 用户不存在，下一步操作
            initfun()
          }
        })
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {
    console.log(msg)
  }

})