import {
  HTTP
} from '../utils/http.js';
import commonJs from '../utils/common.js'

class guideSearch extends HTTP {
  // 列表
  list(pageNum, fileName = '', department = '', diseases = '', fileCategory = '', publishYear = '', publishYearEnd = '') {
    return this.request({
      url: commonJs.localurl + '/search/getGuidelinesList',
      header: commonJs.getToken(),
      data: {
        pageNum: pageNum,
        pageSize: 10,
        fileName: fileName,
        department: department,
        diseases: diseases,
        fileCategory: fileCategory,
        publishYear: publishYear,
        publishYearEnd: publishYearEnd
      }
    })
  }

  // 指南类别
  getGuideType() {
    return this.request({
      url: commonJs.localurl + '/search/getGuideType',
      header: commonJs.getToken()
    })
  }

  // 科室疾病
  getGuideDepart(fileName=''){
    return this.request({
      url: commonJs.localurl + '/search/getDepartList',
      header: commonJs.getToken(),
      data: {
        fileName: fileName
      }
    })
  }
}

export {
  guideSearch
}