// pages/index/index.js
import * as regular from '../../utils/is.js'
import * as storage from '../../utils/storage.js'
import {
  indexModel
} from '../../models/index.js';
let getIndex = new indexModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerHeight: 0, // 背景高度
    statusBarHeight: 0, // banner距离顶部距离
    statusBarHeightStore: 0, // banner距离顶部距离 临时变量
    headerScrollHeight: 0, // 滚动后头部重新定位
    scrollHeight: 0, // 滚动条高度
    guideHeight: 0, // 定位高度
    tipsFixedHeight: 0, // 固定位置距离顶部距离
    setHeightPadding: '', // 设置列表的padding
    pageNum: 1, // 列表默认页码
    total: 0, // 列表总条数
    // showloadingBottom: false,
    bannerList: [],
    publishList: [], // 公共指南列表
    indicatorDots: false,
    scroll: false, // 滚动条滚动记录
    tipsFixed: false, // 是否定位
    loginSearch: false,
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBanner()
    this.getScroll()
    this.setData({
      statusBarHeightStore: (getApp().globalData.statusBarHeight + 23) * 2,
      statusBarHeight: (getApp().globalData.statusBarHeight + 23) * 2,
      headerHeight: (getApp().globalData.statusBarHeight + 133) * 2,
      headerScrollHeight: (getApp().globalData.statusBarHeight + 47),
    })
  },

  onShow: function() {
    this.getDataCommon()
    this.setData({
      isLogin: getApp().isLogin() ? true : false
    })
  },

  // 获取banner图
  getBanner() {
    getIndex.banner().then(res => {
      this.setData({
        bannerList: res.data,
        indicatorDots: res.data.length > 1 ? true : false
      })
    })
  },

  // 滚动距离
  bindscroll(e) {
    let that = this
    if (e.detail.scrollTop > 1) {
      this.setData({
        scroll: true,
        statusBarHeight: this.data.headerScrollHeight * 2,
        tipsFixedHeight: this.data.statusBarHeight
      })
    } else {
      this.setData({
        scroll: false,
        statusBarHeight: this.data.statusBarHeightStore,
        tipsFixedHeight: this.data.statusBarHeight
      })
    }
    if (e.detail.scrollTop >= this.data.guideHeight - 8) {
      this.setData({
        tipsFixed: true
      })
    } else {
      this.setData({
        tipsFixed: false
      })
    }
  },

  // 公用指南列表
  getDataCommon() {
    this.setData({
      showloadingBottom: true
    })
    getIndex.guideListCommon().then(res => {
      setTimeout(()=>{
        this.setData({
          publishList: this.formaterData(res.data.list),
          showloadingBottom: false,
          loginSearch: true
        })
      }, 200)
    })
  },

  // 格式化数据
  formaterData(arr) {
    arr.forEach((item, index) => {
      if (item.publishDate) {
        item.showDate = regular.changeDate(parseInt(item.publishDate))
      }
      if (item.fileTag) {
        let tags = ''
        if (!item.fileTag.includes('/')) {
          item.fileTag = item.fileTag+'/'
        }
        tags = item.fileTag.split(/\//g);
        let newarr = tags.filter(val => {
          if (val.length <= 6) {
            return val
          }
        })
        item._fileTag = newarr.length > 3 ? newarr.slice(0, 3) : newarr
      }
    })
    return arr
  },

  // 获取滚动条高度
  getScroll() {
    let that = this
    let headname = 0
    wx.createSelectorQuery().in(this).selectAll('.headName').boundingClientRect(function(rect) {
      headname = rect[0].height
    }).exec()
    wx.createSelectorQuery().in(this).selectAll('.swiper-box,.indexTips').boundingClientRect(function(rect) {
      that.setData({
        scrollHeight: wx.getSystemInfoSync().windowHeight - rect[0].top - (that.data.statusBarHeight / 2) + 8,
        guideHeight: rect[1].top - headname,
        setHeightPadding: rect[1].height
      })
    }).exec()
  },

  // 更多指南
  moreGuide() {
    wx.navigateTo({
      url: '/pages/my/myGuideSearch/myGuideSearch',
    })
  },

  // 登录查看
  loginGuide() {
    wx.navigateTo({
      url: '/pages/accredit/accredit?isAccredit=false'
    })
  },

  onHide(){
    this.setData({
      publishList: [],
      noData: false,
      loginSearch: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      imageUrl: '/static/images/share_software.png',
      path: '/pages/index/index'
    }
  }
})