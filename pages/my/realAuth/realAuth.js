import {
  isIDcard
} from '../../../utils/is.js'
import * as storage from '../../../utils/storage.js'
import {
  realAuthModel
} from '../../../models/realAuth.js';
let getRealAuth = new realAuthModel()
// 缓存 页面输入的 key
let storeKey = "auth"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否认证成功
    isAuth: false,
    defaultPhone: '',
    codeFail: '',
    setRealHospital: '',
    // 是否填写完整信息
    canLogin: false,
    choseHospital: [{
      name: '',
      path: '/pages/my/searchHospital/searchHospital'
    }],
    setAuth: {
      setRealName: '',
      setRealCard: '',
      setRealCode: '',
      setRealHospital: '',
      setRealHospitalId: '',
      setRealDepart: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 从搜索医院返回
    if (Object.keys(options).length) {
      // 获取所在医院
      this.setData({
        "choseHospital[0].name": options.hospital
      })
      // 修改缓存中医院的值
      let _hospital = storage.get(storeKey)
      if (_hospital) {
        _hospital.setRealHospital = options.hospital
        _hospital.setRealHospitalId = options.id
        storage.set(storeKey, _hospital)
      } else {
        this.setData({
          "setAuth.setRealHospital": options.hospital,
          "setAuth.setRealHospitalId": options.id
        })
        storage.set(storeKey, this.data.setAuth)
      }
      // 填充数据
      if (options.store) {
        this.setData({
          setAuth: storage.get(storeKey)
        })
      }
    } else {
      if (storage.get(storeKey)) {
        storage.remove(storeKey)
      }
    }
    this.isAllComplete()
    this.getPhone()
    this.isAuthSuccess()
  },

  // 判断是否认证成功
  isAuthSuccess() {
    if (storage.get('authInfo')) {
      let data = storage.get('authInfo')
      this.setData({
        "setAuth.setRealName": data.doctorName,
        "setAuth.setRealCard": data.idCard,
        defaultPhone: data.doctorPhone,
        "setAuth.setRealHospital": data.hospitalName,
        "setAuth.setRealDepart": data.hospitalDepartment,
        isAuth: true
      })
    } else {
      this.setData({
        isAuth: false
      })
    }
  },

  // 获取手机号
  getPhone() {
    getRealAuth.phone().then(res => {
      this.setData({
        defaultPhone: res.data
      })
    })
  },

  blurRealName(e) {
    this.setData({
      "setAuth.setRealName": e.detail.value
    })
    if (!e.detail.value) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
    } else {
      storage.set(storeKey, this.data.setAuth)
    }
    this.isAllComplete()
  },

  blurRealCode(e) {
    this.setData({
      "setAuth.setRealCode": e.detail.value
    })
    if (!e.detail.value.length) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else {
      storage.set(storeKey, this.data.setAuth)
    }
    this.isAllComplete()
  },

  blurRealCard(e) {
    this.setData({
      "setAuth.setRealCard": e.detail.value
    })
    if (!isIDcard(e.detail.value)) {
      wx.showToast({
        title: '身份证号有误',
        icon: 'none'
      })
    } else {
      storage.set(storeKey, this.data.setAuth)
    }
    this.isAllComplete()
  },

  blurRealDepart(e) {
    this.setData({
      "setAuth.setRealDepart": e.detail.value
    })
    if (!e.detail.value) {
      wx.showToast({
        title: '请输入所属科室',
        icon: 'none'
      })
    } else {
      storage.set(storeKey, this.data.setAuth)
    }
    this.isAllComplete()
  },

  isAllComplete() {
    this.setData({
      canLogin: this.data.setAuth.setRealName && this.data.setAuth.setRealCard && this.data.setAuth.setRealCode && this.data.setAuth.setRealHospital && this.data.setAuth.setRealDepart ? true : false
    })
  },

  // 认证
  formSubmit(e) {
    if (!this.data.canLogin) {
      return false
    }
    wx.showLoading({
      title: '认证中...'
    })
    // 请求数据
    getRealAuth.real(
      this.data.setAuth.setRealName,
      this.data.setAuth.setRealCard,
      this.data.defaultPhone,
      this.data.setAuth.setRealCode,
      this.data.setAuth.setRealHospitalId,
      this.data.setAuth.setRealHospital,
      this.data.setAuth.setRealDepart
    ).then(res => {
      wx.hideLoading()
      getApp().codeSuccess(res.stateCode,function(){
        wx.switchTab({
          url: '/pages/my/my/my',
        })
      })
      // 验证码错误或已失效
      // this.setData({
      //   codeFail: '验证码错误或已失效'
      // })
    })
  },
  onUnload:function(){
    // wx.navigateBack({
    //   delta: 2
    // })
  }
})