import {
  HTTP
} from '../utils/http.js';
import commonJs from '../utils/common.js'

class realAuthModel extends HTTP {
  // 用户认证成功的信息
  authSuccess() {
    return this.request({
      url: commonJs.localurl + '/miniapp/doctor/auth/info',
      header: commonJs.getToken()
    })
  }

  // 医院查询
  hospital(data) {
    return this.request({
      url: commonJs.localurl + '/miniapp/doctor/auth/hospital',
      data: data,
      header: commonJs.getToken()
    })
  }

  // 获取用户认证手机
  phone() {
    return this.request({
      url: commonJs.localurl + '/miniapp/doctor/auth/phone',
      header: commonJs.getToken()
    })
  }

  // 实名认证
  real(name, idCard, phone, code, id, hospitalName,depart) {
    return this.request({
      url: commonJs.localurl + '/miniapp/doctor/auth',
      data: {
        doctorName: name,
        idCard: idCard,
        doctorPhone: phone,
        checkCode: code,
        hospitalId: id,
        hospitalName: hospitalName,
        hospitalDepartment: depart
      },
      header: commonJs.getToken(),
      method: "POST"
    })
  }
}

export {
  realAuthModel
}