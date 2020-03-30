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
    scrollHeight: 0,
    pageNum: 1, // 列表默认页码
    total: 0, // 列表总条数
    showloadingBottom: false,
    noData: false, // 暂无数据
    bannerList: [],
    indexList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBanner()
    this.getGuideList(this.data.pageNum)
  },

  // 获取banner图
  getBanner() {
    getIndex.banner().then(res => {
      this.setData({
        bannerList: res.data
      })
    })
  },

  // 获取收到的指南列表
  getGuideList(pageNum) {
    if (storage.get('token')) {
      this.setData({
        showloadingBottom: true
      })
      getIndex.guideList(pageNum).then(res => {
        if (res.data) {
          res.data.list.forEach(item => {
            if (item.publishDate) {
              item.publishDate = regular.changeDate(item.publishDate, 'guide')
            }
          })
          this.setData({
            indexList: this.data.indexList.concat(res.data.list),
            showloadingBottom: false,
            total: res.data.total
          })
          this.getScroll()
        }
      })
    }
  },

  // 滚动条底部事件
  tapRollBottom() {
    if (this.data.indexList.length >= this.data.total) {
      // 显示暂无数据
      this.setData({
        noData: true
      })
    } else {
      this.setData({
        pageNum: this.data.pageNum+1
      })
      this.getGuideList(this.data.pageNum)
    }
  },

  // 获取滚动条高度
  getScroll() {
    let that = this
    if (this.data.indexList.length) {
      wx.createSelectorQuery().in(this).selectAll('.setHeight').boundingClientRect(function(rect) {
        that.setData({
          scrollHeight: wx.getSystemInfoSync().windowHeight - rect[0].top
        })
      }).exec()
    }
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