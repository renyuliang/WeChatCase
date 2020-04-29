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
    },
    loading: false
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
      this.setData({
        "setAuth.setRealName": storage.get(storeKey).setRealName,
        "setAuth.setRealCard": storage.get(storeKey).setRealCard,
        "setAuth.setRealCode": storage.get(storeKey).setRealCode,
        "setAuth.setRealHospital": options.hospital,
        "setAuth.setRealHospitalId": options.id,
        "setAuth.setRealDepart": storage.get(storeKey).setRealDepart
      })
      storage.set(storeKey, this.data.setAuth)
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
    this.setData({
      loading: true
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
      this.setData({
        loading: false
      })
      if (res.stateCode === '000000') {
        wx.showToast({
          title: '认证成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/my/my/my',
          })
        }, 1000)
      }
    }).catch(()=>{
      this.setData({
        loading: false
      })
    })
  },
  onUnload(){
    if (!this.data.isAuth) {
      wx.navigateBack({
        delta:2
      })
    }
  }
})