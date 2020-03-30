// pages/my/myGuide/myGuide.js
import * as regular from '../../../utils/is.js'
import {
  guideModel
} from '../../../models/guide.js';
let getGuide = new guideModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guideList: [],
    tips: '',
    pageNum: 1, // 当前页码
    total: 0, // 总条数
    showloadingBottom: false,
    noData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData(this.data.pageNum)
  },
  // 加载数据
  getData(pageNum) {
    this.setData({
      showloadingBottom: true
    })
    getGuide.myGuide(pageNum).then(res => {
      this.setData({
        showloadingBottom: false
      })
      if (res.data) {
        if (res.data.list) {
          res.data.list.forEach(item => {
            if (item.publishDate) {
              item.publishDate = regular.changeDate(item.publishDate, 'guide')
            }
          })
          this.setData({
            guideList: this.data.guideList.concat(res.data.list),
            tips: '累计已查阅指南 ' + res.data.total + ' 份',
            total: res.data.total
          })
        }
      }
    })
  },
  // 加载更多
  onReachBottom:function(){
    if (this.data.guideList.length >= this.data.total) {
      // 显示暂无数据
      this.setData({
        noData: true
      })
    } else {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getData(this.data.pageNum)
    }
  }
})