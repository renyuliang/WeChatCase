// js业务处理
import {
  HTTP
} from '../utils/http.js'

class getList extends HTTP {

  // GET
  list() {
    return this.request({
      url: 'https://unidemo.dcloud.net.cn/api/news?column=id%2Cpost_id%2Ctitle%2Cauthor_name%2Ccover%2Cpublished_at',
    })
  }

  // POST
  getPhone(params) {
    return this.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      data: params,
    })
  }
}

export {
  getList
}