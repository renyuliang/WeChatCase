import {
  HTTP
} from '../utils/http.js';
import commonJs from '../utils/common.js'

class guideDetail extends HTTP {
  // 根据id 查询详情
  detailMsg(guideId) {
    return this.request({
      url: commonJs.localurl + '/miniappHome/findGuidelinesById',
      header: commonJs.getToken(),
      data: {
        guideId: guideId
      }
    })
  }

  // 二维码扫码进入获取id
  addBrowseRecord(shareRecordId, shareType, browseRecordId){
    return this.request({
      url: commonJs.localurl + '/miniappHome/addBrowseRecord',
      header: commonJs.getToken(),
      data: {
        shareId: shareRecordId,
        shareType: shareType,
        browseRecordId: browseRecordId
      }
    })
  }

  // 红包领取情况查询
  giftState(browseRecordId) {
    return this.request({
      url: commonJs.localurl + '/miniappHome/queryGiftStatus',
      header: commonJs.getToken(),
      data: {
        browseRecordId: browseRecordId
      }
    })
  }

  // 查询阅读奖励领取结果（已领取 或 已过期）
  giftMsg(browseRecordId) {
    return this.request({
      url: commonJs.localurl + '/redPackage/getRedPackageResult',
      header: commonJs.getToken(),
      data: {
        browseRecordId: browseRecordId
      }
    })
  }

  // 开始阅读临床指南文档
  startState(browseRecordId){
    return this.request({
      url: commonJs.localurl + '/miniappHome/beginRead',
      header: commonJs.getToken(),
      data: {
        browseRecordId: browseRecordId
      }
    })
  }

  // 结束阅读临床指南文档
  endState(browseRecordId, readTime) {
    return this.request({
      url: commonJs.localurl + '/miniappHome/endRead',
      header: commonJs.getToken(),
      data: {
        browseRecordId: browseRecordId,
        readTime: readTime
      }
    })
  }

  // 发放红包
  sendRedPackage(browseRecordId){
    return this.request({
      url: commonJs.localurl + '/redPackage/sendRedPackage',
      header: commonJs.getToken(),
      data: {
        browseRecordId: browseRecordId
      }
    })
  }
}

export {
  guideDetail
}