import * as storage from './utils/storage.js'
// 调用登录接口
import {
  loginModel
} from './models/login.js';
let getLogin = new loginModel()
App({
  globalData: {
    defaultNavigateUrl: '/pages/index/index', //默认首页路径
    nowNavigateUrl: '', //其他带参数路径路径
    statusBarHeight: 0 // 状态栏高度
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function(options) {
    if (Object.keys(options.query).length) {
      if (options.query.scene) {
        //代表进入
        this.globalData.nowNavigateUrl = '/' + options.path + '?scene=' + options.query.scene
      } else if (options.query.shareType === '2') {
        //医生进入
        this.globalData.nowNavigateUrl = '/' + options.path + '?browseRecordId=' + options.query.browseRecordId + '&shareType=' + options.query.shareType
      }
    } else {
      //正常小程序进入
      this.globalData.nowNavigateUrl = this.globalData.defaultNavigateUrl
    }
    // storage.clear()
  },

  onShow: function(options) {
    // 获取小程序 进入场景值
    storage.set('wechatscene', options.scene)
    // 获取状态栏高度
    wx.getSystemInfo({
      success: (res => {
        this.globalData.statusBarHeight = res.statusBarHeight
      })
    })
  },

  getSetting() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，调用登录，获取code
          this.userLogin()
        } else {
          //还没有授权，去授权
          wx.navigateTo({
            url: '/pages/accredit/accredit?isAccredit=false'
          })
          storage.remove('token')
        }
      }
    })
  },

  //保存用户的 token
  storeToken(key, value) {
    let obj = {
      'key': key,
      'value': value
    }
    storage.set('token', obj)
    // 保存token成功后，获取授权后的数据到数据库
    this.getUserInfo().then(user => {
      getLogin.updateInfo(user.userInfo).then(res => {
        if (res.stateCode === '000000') {
          this.saveBasicInfo(1)
        }
      })
    })
  },

  // 判断是否登录
  isLogin() {
    return storage.get('token') ? true : false
  },

  // 登录成功后保存基本信息
  saveBasicInfo: function(num) {
    return num == 1 ? true : false
  },

  // 获取用户信息
  getUserInfo: function() {
    return new Promise((resolve, reject) => {
      // 获取用户信息
      // 默认已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
      wx.getUserInfo({
        success: (info) => {
          resolve(info)
        }
      })
    })
  },

  // 用户登录
  userLogin(url) {
    const that = this;
    wx.login({
      success: res => {
        // code 换 unioid
        this.getUserInfo().then(user => {
          getLogin.unioid(res.code, user.iv, user.rawData, user.encryptedData, user.signature).then(getCode => {
            let obj = {
              openId: getCode.data.openid,
              unionId: getCode.data.unionid,
              randomCode: getCode.data.randomCode
            }
            storage.set('OpenUnioid', obj)
            setTimeout(() => {
              getLogin.login().then(resLogin => {
                wx.hideLoading()
                if (resLogin.stateCode === '000000') {
                  // 获取token
                  that.storeToken(resLogin.data.tokenMarkName, resLogin.data.tokenValue);
                  if (url) {
                    this.initAddress()
                  }
                } else {
                  // 用户不存在，下一步操作
                  wx.navigateTo({
                    url: '/pages/accredit/accredit?isAccredit=true'
                  })
                }
              })
            }, 300)
          })
        })
      }
    })
  },
  // 是否从首页进入，否者进去指定页面
  initAddress() {
    // 登录成功，跳转页面
    console.log(this.globalData.nowNavigateUrl, this.globalData.defaultNavigateUrl)
    if (this.globalData.nowNavigateUrl === this.globalData.defaultNavigateUrl) {
      wx.switchTab({
        url: storage.get('backPath') ? '/' + storage.get('backPath') : this.globalData.defaultNavigateUrl
      })
      storage.remove('backPath')
    } else {
      wx.reLaunch({
        url: storage.get('backPath') ? '/' + storage.get('backPath') : this.globalData.nowNavigateUrl
      })
      storage.remove('backPath')
    }
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {
    console.log(msg)
  }
})