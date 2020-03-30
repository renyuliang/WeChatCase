import { HTTP } from '../utils/http.js'
import commonJs from '../utils/common.js'

class codeModel extends HTTP {
  // 登录-验证码接口
  list(getPhone) {
    return this.request({
      url: commonJs.baseUrl + '/api/v1/sendRegisterCode',
      data: {
        phone: getPhone
      },
      method: "POST"
    })
  }

  // 认证-验证码接口
  authCode() {
    return this.request({
      url: commonJs.localurl + '/miniapp/doctor/auth/sms',
      header: commonJs.getToken(),
      method: "POST"
    })
  }
}

export { codeModel }