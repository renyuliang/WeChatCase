import {
  realAuthModel
} from '../../../models/realAuth.js';
let getRealAuth = new realAuthModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchInput: '',
    showList: false,
    loading: false,
    // 医院列表
    searchList: [],
    scrollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  // 清空搜索
  deleteSearch(e) {
    this.setData({
      showList: false,
    })
    this.getData(e.detail.searchInput)
  },

  // 搜索
  confirmSearch(e) {
    this.setData({
      loading: true,
      showList: true,
      searchInput: e.detail.searchInput
    })
    this.getData(e.detail.searchInput)
  },
  
  // 请求数据
  getData(val) {
    getRealAuth.hospital({
      hospitalName: val,
      pageNo: 1,
      pageSize: 20,
    }).then(res => {
      let that = this
      if (this.data.showList) {
        wx.createSelectorQuery().in(this).selectAll('.tips').boundingClientRect(function(rect) {
          that.setData({
            scrollHeight: wx.getSystemInfoSync().windowHeight - rect[0].top - 48
          })
        }).exec()
        this.setData({
          loading: false,
          searchList: res.data.data
        })
      }
    }).catch(err => {
      this.setData({
        loading: false
      })
    })
  },

  returnHospital(e) {
    let hospital = e.currentTarget.dataset.hospital
    let id = e.currentTarget.dataset.id
    // 返回上一页
    wx.redirectTo({
      url: '../realAuth/realAuth?hospital=' + hospital + '&id=' + id,
    })
  }
})