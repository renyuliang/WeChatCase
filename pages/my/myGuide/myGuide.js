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
    pageNum: 1, // 当前页码
    total: 0, // 总条数
    showloadingBottom: false,
    noData: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    this.setData({
      guideList: []
    })
    this.getData(1)
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
      if (res.data && res.data.list) {
        console.log(res.data.list)
        res.data.list.forEach(item => {
          if (item.readTime) {
            item.readTime = regular.changeDate(item.readTime, 'guide');
          }
          if (item.fileTag) {
            let tags = ''
            if (!item.fileTag.includes('/')) {
              item.fileTag = item.fileTag + '/'
            }
            tags = item.fileTag.split(/\//g);
            let newarr = tags.filter(val => {
              if (val.length <= 6) {
                return val
              }
            })
            item._fileTag = newarr.length > 3 ? newarr.slice(0, 3) : newarr;
          }
          item.initRead = 'read'
        })
        this.setData({
          guideList: this.data.guideList.concat(res.data.list),
          total: res.data.total
        })
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