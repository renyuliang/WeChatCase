import {
  HTTP
} from '../utils/http.js';
import commonJs from '../utils/common.js'

class indexModel extends HTTP {
  // banner图
  banner() {
    return this.request({
      url: commonJs.localurl + '/miniappHome/getBannerInfo',
      header: commonJs.getToken()
    })
  }

  // // 我的指南列表 -- 登录
  // guideList(pageNum) {
  //   return this.request({
  //     url: commonJs.localurl + '/miniappHome/getGuidelines',
  //     header: commonJs.getToken(),
  //     data: {
  //       pageNum: pageNum,
  //       pageSize: 10
  //     }
  //   })
  // }

  // 我的指南列表 -- 未登录
  guideListCommon(pageNum) {
    return this.request({
      url: commonJs.localurl + '/search/getPublicGuidelines',
      // header: commonJs.getToken(),
      // data: {
      //   pageNum: pageNum,
      //   pageSize: 10
      // }
    })
  }
}

export {
  indexModel
}