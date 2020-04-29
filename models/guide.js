import {
  HTTP
} from '../utils/http.js';
import commonJs from '../utils/common.js'

class guideModel extends HTTP {
  // 我的已阅读指南
  myGuide(pageNum) {
    return this.request({
      url: commonJs.localurl + '/miniapp/doctor/readRecord',
      header: commonJs.getToken(),
      data: {
        pageNum:pageNum,
        pageSize: 10
      }
    })
  }
  //消息指南
  msgGuide(pageNum) {
    return this.request({
      url: commonJs.localurl + '/miniappHome/getGuidelines',
      header: commonJs.getToken(),
      data: {
        pageNum: pageNum,
        pageSize: 10
      }
    })
  }
}

export {
  guideModel
}