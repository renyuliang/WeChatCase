// pages/msg/msg.js
import * as storage from '../../utils/storage.js';
import * as regular from '../../utils/is.js'
import {
  guideModel
} from '../../models/guide.js';
let getGuide = new guideModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList:[],
    isLogin: true,
    showTip: true,
    noData: false,
    noDataList: false,
    requireRepeat: true, // 防止滚动太快，加载太多
    showloadingBottom: false,
    total: 0, //总条数
    pageNum: 1,
    backHeight: 0, // 背景高度
    scrollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //消息提示
    this.setData({
      showTip: !storage.get('msgTip'),
      backHeight: getApp().globalData.statusBarHeight + 44,
      scrollHeight: wx.getSystemInfoSync().screenHeight - (getApp().globalData.statusBarHeight + 44 + 45)
    })
  },
  onShow:function(){
    this.getLoginState()
  },
  // 关闭提示
  closeTip(){
    storage.set('msgTip',true)
    this.setData({
      showTip: false
    })
  },
  // 加载数据
  getData(pageNum) {
    this.setData({
      showloadingBottom: true,
      requireRepeat: false,
      noData: false,
      noDataList: false
    })
    getGuide.msgGuide(pageNum).then(res => {
      this.setData({
        showloadingBottom: false,
        requireRepeat: true
      })
      if (res.data && res.data.list) {
        res.data.list.forEach(item => {
          item.getTime = regular.changeMsgDate(parseInt(item.receiveTime))
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
            item._fileTag = newarr.length > 3 ? newarr.slice(0, 3) : newarr
          }
          item.giftStuta = item.state;  //红包的状态
          item.initRead = item.readId;  // 是否已读
        })
        this.setData({
          msgList: this.data.msgList.concat(res.data.list),
          total: res.data.total
        })
        setTimeout(()=>{
          this.setData({
            noDataList: this.data.msgList.length ? false:true
          })
        },100)
      }
    })
  },
  // 加载更多
  tapRollBottom: function () {
    if (this.data.msgList.length >= this.data.total) {
      this.setData({
        noData: true
      })
    } else {
      if (this.data.requireRepeat) {
        this.setData({
          pageNum: this.data.pageNum + 1
        })
        this.getData(this.data.pageNum)
      }
    }
  },
  // 登录
  msgLogin(){
    wx.navigateTo({
      url: '/pages/accredit/accredit?isAccredit=false'
    })
  },
  // 判断是否登录
  getLoginState() {
    // 获取用户授权信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          //还没有授权，去授权
          this.setData({
            msgList: [],
            isLogin: false,
            noData: false,
            noDataList: false
          })
          storage.remove('token')
        } else {
          this.setData({
            isLogin: getApp().isLogin() ? true : false
          })
          if (getApp().isLogin()) {
            this.getData(this.data.pageNum)
          }
        }
      }
    })
  },
  onHide() {
    this.setData({
      msgList: [],
      pageNum: 1,
      noData: false,
      noDataList: false,
      requireRepeat: true,
      isLogin: true
    })
  },
})