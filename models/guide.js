import {
  HTTP
} from '../utils/http.js';
import commonJs from '../utils/common.js'

class guideModel extends HTTP {
  // 我的指南列表
  myGuide(pageNum) {
    return this.request({
      url: commonJs.localurl + '/miniapp/doctor/clinicalGuide',
      header: commonJs.getToken(),
      data: {
        pageNo:pageNum,
        pageSize: 10
      }
    })
  }
}

export {
  guideModel
}