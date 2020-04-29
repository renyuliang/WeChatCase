// pages/my/myGuideDetail/myGuideDetail.js
import {
  guideDetail
} from '../../../models/guideDetail.js';
import {
  changeDate,
  changeDateHour
} from '../../../utils/is.js';
import * as storage from '../../../utils/storage.js';

let guideItem = new guideDetail();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 获取传入的id
    getId: '',
    browserId: '',
    detailMsg: {}, // 详情内容
    pdfUrl: '', // pdf地址
    pdfName: '', // pdf名称
    publishState: '', // 判断pdf是否存在
    giftState: '', // 是否有红包
    giftStateResult: false, // 红包领取状态 过期 已领取
    giftResult: {}, // 红包领取 data值,
    giftBollean: false, // 红包是否领取成功
    showView: false,
    getReward: false, // 弹窗红包
    btnLoading: false,
    getRewardInfo: {
      time: '' // 红包过期时间
    },
    readRecordId: '', //指南阅读记录id
    showShare: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    storage.remove('time')
    setTimeout(() => {
      if (options.scene) {
        // 二维码分享
        if (storage.get('token')) {
          if (getApp().saveBasicInfo(1)) {
            setTimeout(() => {
              guideItem.addBrowseRecord(decodeURIComponent(options.scene), '1', '', '').then(res => {
                if (res.data) {
                  this.getMsg(res.data.guideId, res.data.browseRecordId)
                }
              })
            }, 300)
          }
        } else {
          wx.reLaunch({
            url: '/pages/accredit/accredit?isAccredit=false',
          })
        }
      } else if (options.shareType === '2') {
        // 医生自己分享,链接进入
        if (storage.get('token')) {
          if (getApp().saveBasicInfo(1)) {
            setTimeout(() => {
              wx.showLoading({
                title: '加载中...'
              })
              let initbrowserid = options.browseRecordId ? options.browseRecordId : ''
              guideItem.addBrowseRecord('', '2', initbrowserid, options.guideId).then(res => {
                wx.hideLoading()
                if (res.data) {
                  guideItem.detailMsg(res.data.guideId).then(result => {
                    this.sameData(result.data)
                    this.setData({
                      browserId: res.data.browseRecordId,
                      getId: res.data.guideId,
                      showView: true
                    })
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '数据异常，请联系管理人员',
                    showCancel: false,
                    success(res) {
                      wx.reLaunch({
                        url: '/pages/index/index'
                      })
                    }
                  })
                }
              })
            }, 300)
          }
        } else {
          guideItem.detailMsg(options.guideId).then(result => {
            this.sameData(result.data)
            this.setData({
              getId: options.guideId,
              showView: true
            })
          })
        }
      } else {
        //正常流程进入
        this.setData({
          getId: options.getId
        })
        if (getApp().isLogin()) {
          // 登录
          if (options.browserId) {
            this.setData({
              browserId: options.browserId
            })
            this.getMsg(options.getId, options.browserId)
          } else {
            guideItem.detailMsg(options.getId).then(result => {
              this.sameData(result.data)
              this.setData({
                showView: true
              })
            })
          }
        } else {
          // 非登录
          guideItem.detailMsg(options.getId).then(result => {
            this.sameData(result.data)
            this.setData({
              showView: true
            })
          })
        }
      }
    }, 300)
  },
  // 数据显示 相同的内容
  sameData(res) {
    // 详情
    let dataMsg = res;
    dataMsg.publishDate = dataMsg.publishDate ? changeDate(dataMsg.publishDate) : '--'
    dataMsg.fileMaker = dataMsg.fileMaker ? dataMsg.fileMaker : '未知'
    dataMsg.fileSource = dataMsg.fileSource ? dataMsg.fileSource : '--'
    if (dataMsg.fileTag) {
      let tags = ''
      if (!dataMsg.fileTag.includes('/')) {
        dataMsg.fileTag = dataMsg.fileTag + '/'
      }
      tags = dataMsg.fileTag.split(/\//g);
      let newarr = tags.filter(val => {
        if (val.length <= 6) {
          return val
        }
      })
      dataMsg.fileTag = newarr.length > 6 ? newarr.slice(0, 6) : newarr
      dataMsg.fileTag = dataMsg.fileTag.length ? dataMsg.fileTag.join('、') : '--'
    } else {
      dataMsg.fileTag = '--'
    }
    dataMsg.pdfUrl = dataMsg.fileUrl ? dataMsg.fileUrl : ''
    this.setData({
      detailMsg: dataMsg,
      pdfUrl: dataMsg.fileUrl,
      pdfName: dataMsg.fileName,
      publishState: dataMsg.publishState,
      showShare: dataMsg.isDelete == 1 && dataMsg.publishState == 1 ? true : false
    })
  },


  getMsg(getid, browserid) {
    let _this = this;
    wx.showLoading({
      title: '加载中...'
    })
    let detailMsg = guideItem.detailMsg(getid)
    let giftState = guideItem.giftState(browserid)
    Promise.all([detailMsg, giftState]).then(res => {
      wx.hideLoading()
      if (res[0].stateCode === '000000' && res[1].stateCode === '000000') {
        _this.sameData(res[0].data)
        _this.setData({
          getId: getid,
          browserId: browserid,
          giftState: res[1].data.giftStatus,
          'getRewardInfo.time': changeDateHour(res[1].data.expireTime),
          showView: true
        })
        _this.searchRedbackState(res[1].data.giftStatus, browserid)
      } else {
        wx.showModal({
          title: '提示',
          content: '数据异常，请联系管理人员',
          showCancel: false,
          success(res) {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        })
      }
    })
  },

  // 查询红包领取情况
  searchRedbackState(result, browserId) {
    // 判断红包领取情况 “”-无红包 0-有红包 1-待领取 2-已领取 3-已过期’
    if (result == 2 || result == 3) {
      guideItem.giftMsg(browserId).then(resPack => {
        if (resPack) {
          let str = result == 2 ? '阅读奖励已领取' : '阅读奖励已过期'
          if (resPack.stateCode === '000000') {
            this.setData({
              giftStateResult: true,
              giftResult: str + "：￥" + resPack.data.money + " | " + resPack.data.reTime
            })
          } else {
            this.setData({
              giftStateResult: true,
              giftResult: str
            })
          }
        }
      })
    }
  },

  // 查看pdf
  bindPDF() {
    wx.navigateTo({
      url: '/pages/my/myGuidePDF/myGuidePDF?pdfUrl=' + this.data.pdfUrl + '&fileName=' + this.data.pdfName + '&publishState=' + this.data.publishState,
      success: (res) => {
        if (getApp().isLogin()) {
          let objTime = {}
          objTime['start'] = new Date().getTime()
          storage.set('time', objTime)
          // 有浏览记录id才可能有红包
          if (this.data.browserId){
            // 设置返回详情页 红包是否自动弹窗
            storage.set('redBack', true)
          }
          // 开始阅读
          guideItem.startState(this.data.browserId, this.data.getId).then(res => {
            this.setData({
              readRecordId: res.data
            })
          })
          this.setData({
            giftBollean: true
          })
        }
      }
    })
  },

  // 打开红包弹窗
  getAward() {
    wx.showLoading({
      title: ''
    })
    setTimeout(()=>{
      wx.hideLoading()
      this.setData({
        getReward: true
      })
    },500)
  },

  // 关闭红包
  exitWard() {
    this.setData({
      getReward: false
    })
  },

  // 领取奖励
  awardMoney() {
    this.setData({
      btnLoading: true
    })
    guideItem.sendRedPackage(this.data.browserId).then(res => {
      this.setData({
        btnLoading: false
      })
      if (res.stateCode === '000000') {
        this.setData({
          getReward: false,
          giftState: 2 // 红包状态为已领取
        })
        wx.navigateTo({
          url: '/pages/my/awardMoney/awardMoney?money=' + res.data
        })
      } else if (res.stateCode === '100000') {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },

  onShow: function() {
    let that = this
    //如果点击pdf返回
    setTimeout(() => {
      if (storage.get('time')) {
        let getTime = (storage.get('time').end - storage.get('time').start)
        if (!getTime) {
          return false
        }
        let endData = {
          readRecordId: that.data.readRecordId,
          guideId: that.data.getId,
          browseRecordId: that.data.browserId,
          readTime: getTime
        }
        guideItem.endState(endData).then(res => {
          storage.remove('time')
          that.initReadBack(that, that.data.browserId)
        })
      } else {
        that.initReadBack(that, that.data.browserId)
      }
    }, 200)
  },

  // 自动弹出红包
  initReadBack(that, browserId){
    if (storage.get('redBack')) {
      storage.remove('redBack')
      // 查红包状态
      guideItem.giftState(browserId).then(result => {
        if (result.data) {
          that.setData({
            giftState: result.data.giftStatus,
            'getRewardInfo.time': changeDateHour(result.data.expireTime)
          })
          // 变为待领取状态
          if (result.data.giftStatus == 1) {
            that.getAward()
            return
          }
          that.searchRedbackState(result.data.giftStatus, browserId)
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let path = ''
    if (getApp().isLogin()) {
      path = '/pages/my/myGuideDetail/myGuideDetail?browseRecordId=' + this.data.browserId + '&guideId=' + this.data.getId + '&shareType=2'
    } else {
      path = '/pages/my/myGuideDetail/myGuideDetail?guideId=' + this.data.getId + '&shareType=2'
    }
    return {
      imageUrl: '/static/images/share_article.png',
      path: path
    }
  }
})