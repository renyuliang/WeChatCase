// pages/my/myGuideDetail/myGuideDetail.js
import {
  guideDetail
} from '../../../models/guideDetail.js';
import {
  changeDate
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
    giftState: 0, // 是否有红包
    giftStateResult: false, // 红包领取状态 过期 已领取
    giftResult: {}, // 红包领取 data值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    storage.remove('time')
    if (options.scene) {
      // 二维码分享
      console.log('代表')
      guideItem.addBrowseRecord(decodeURIComponent(options.scene), '1', '').then(res => {
        if (res.data) {
          let arrId = res.data.split(',')
          this.getMsg(arrId[0], arrId[1])
        }
      })
    } else if (options.shareType === '2') {
      // 医生自己分享
      console.log('医生')
      guideItem.addBrowseRecord('', '2', options.browseRecordId).then(res => {
        guideItem.detailMsg(res.data).then(res => {
          // 详情
          let dataMsg = res.data;
          dataMsg.publishDate = dataMsg.publishDate ? changeDate(dataMsg.publishDate) : '--'
          dataMsg.fileMaker = dataMsg.fileMaker ? dataMsg.fileMaker : '未知'
          dataMsg.fileSource = dataMsg.fileSource ? dataMsg.fileSource : '--'
          dataMsg.fileTag = dataMsg.fileTag ? dataMsg.fileTag : '--'
          this.setData({
            detailMsg: dataMsg,
            pdfUrl: dataMsg.fileUrl,
            pdfName: dataMsg.fileName
          })
        })
      })
    } else {
      console.log('默认')
      this.setData({
        getId: options.getId,
        browserId: options.browserId
      })
      this.getMsg(options.getId, options.browserId)
    }
  },
  getMsg(getid, browserid) {
    let detailMsg = guideItem.detailMsg(getid)
    let giftState = guideItem.giftState(browserid)
    Promise.all([detailMsg, giftState]).then(res => {
      // 详情
      let dataMsg = res[0].data;
      dataMsg.publishDate = dataMsg.publishDate ? changeDate(dataMsg.publishDate) : '--'
      dataMsg.fileMaker = dataMsg.fileMaker ? dataMsg.fileMaker : '未知'
      dataMsg.fileSource = dataMsg.fileSource ? dataMsg.fileSource : '--'
      dataMsg.fileTag = dataMsg.fileTag ? dataMsg.fileTag : '--'
      //红包状态  “”-无红包 0-有红包 1-待领取 2-已领取 3-已过期
      this.setData({
        detailMsg: dataMsg,
        pdfUrl: dataMsg.fileUrl,
        giftState: res[1].data,
        pdfName: dataMsg.fileName
      })
      // 判断红包领取情况
      if (res[1].data === '2' || res[1].data === '3') {
        return guideItem.giftMsg(browserid)
      }
    }).then(resPack => {
      if (resPack) {
        if (resPack.data.code === 1) {
          this.setData({
            giftStateResult: true,
            giftResult: resPack.data.describe + "：￥" + resPack.data.money + " | " + resPack.data.reTime
          })
        } else {
          wx.showToast({
            title: resPack.data.errMessage,
            icon: 'none'
          })
        }
      }
    })
  },

  bindPDF() {
    storage.remove('time')
    wx.navigateTo({
      url: '/pages/my/myGuidePDF/myGuidePDF?pdfUrl=' + this.data.pdfUrl + '&fileName=' + this.data.pdfName,
      success: (res) => {
        let objTime = {}
        objTime['start'] = new Date().getTime()
        storage.set('time', objTime)
        // 开始阅读
        guideItem.startState(this.data.browserId).then({})
      }
    })
  },

  // 领取奖励
  getAward() {
    guideItem.sendRedPackage(this.data.browserId).then(res=>{
      wx.sendBizRedPacket({
        timeStamp: res.data.timeStamp, // 支付签名时间戳，
        nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
        package: res.data.redPackage, //扩展字段，由商户传入
        signType: res.data.signType, // 签名方式，
        paySign: res.data.paySign, // 支付签名
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {}
      })
    })
  },

  onShow: function() {
    if (storage.get('time')) {
      let getTime = (storage.get('time').end - storage.get('time').start)
      guideItem.endState(this.data.browserId, getTime).then(res=>{
        return guideItem.giftState(this.data.browserId)
      }).then(result=>{
        this.setData({
          giftState: result.data
        })
        storage.remove('time')
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      imageUrl: '/static/images/share_article.png',
      path: '/pages/my/myGuideDetail/myGuideDetail?browseRecordId=' + this.data.browserId + '&shareType=2'
    }
  }
})