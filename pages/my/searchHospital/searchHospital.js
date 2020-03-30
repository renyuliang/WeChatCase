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
    showDelete: false,
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

  onUnload: function () {
    // console.log(234)
  },

  showInput(e) {
    this.setData({
      showDelete: e.detail.value.length ? true : false,
      searchInput: e.detail.value
    })
  },
  // 清空搜索
  deleteSearch() {
    this.setData({
      showDelete: false,
      showList: false,
      searchInput: ''
    })
    this.getData(this.data.searchInput)
  },
  // 搜索
  confirmSearch(e) {
    let val = e.detail.value
    if (val) {
      this.setData({
        loading: true,
        showList: true,
      })
      this.getData(val)
    }
  },
  // 请求数据
  getData(val) {
    getRealAuth.hospital({
      hospitalName: val,
      pageNo: 1,
      pageSize: 20,
    }).then(res => {
      let that = this
      wx.createSelectorQuery().in(this).selectAll('.tips').boundingClientRect(function (rect) {
        that.setData({
          scrollHeight: wx.getSystemInfoSync().windowHeight - rect[0].top -48
        })
      }).exec()
      this.setData({
        loading: false,
        searchList: res.data.data
      })
    }).catch(err=>{
      this.setData({
        loading: false
      })
    })
  },

  returnHospital(e) {
    let hospital = e.currentTarget.dataset.hospital
    let id = e.currentTarget.dataset.id
    // 返回上一页
    wx.navigateTo({
      url: '../realAuth/realAuth?store=true&hospital=' + hospital + '&id=' + id,
    })
  }
})