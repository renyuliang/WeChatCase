import {
  HTTP
} from '../utils/http.js';
import commonJs from '../utils/common.js'
import * as md5 from '../utils/md5.js'

function openid () {
  return commonJs.getOpenUnioid().openId
}
function unionid() {
  return commonJs.getOpenUnioid().unionId
}
function randomCode() {
  return commonJs.getOpenUnioid().randomCode
}

class loginModel extends HTTP {
  // 获取unioid
  unioid(code) {
    return this.request({
      url: commonJs.localurl + '/miniapp/unioid',
      data: {
        code: code
      }
    })
  }

  // 解密 获取默认手机号
  defaultPhone(value) {
    return this.request({
      url: commonJs.localurl + '/miniapp/wx/phone',
      data: {
        encryptedData: value.encryptedData,
        iv: value.iv,
        randomCode: randomCode()
      },
      method: "POST"
    })
  }

  // 登录
  login() {
    return this.request({
      url: commonJs.baseUrl + '/api/v1/userWechatMiniLogin',
      data: {
        unionId: unionid(),
        signature: md5.md5(unionid() +'yxkkfg@#11!')
      },
      method: "POST"
    })
  }

  // 注册--需要验证码
  registerCode(phone, code) {
    return this.request({
      url: commonJs.baseUrl + '/api/v1/miniUserRegisterWithVerificationCode',
      data: {
        unionId: unionid(),
        openId: openid(),
        signature: md5.md5(unionid() + openid() + phone + 'yxkkfg@#11!'),
        phone: phone,
        verificationCode: code
      },
      method: "POST"
    })
  }

  // 注册--不要验证码
  registerPhone(phone) {
    return this.request({
      url: commonJs.baseUrl + '/api/v1/miniUserRegisterWithOutVerificationCode',
      data: {
        unionId: unionid(),
        openId: openid(),
        signature: md5.md5(unionid() + openid() + phone + 'yxkkfg@#11!'),
        phone: phone
      },
      method: "POST"
    })
  }

  // 注册修改用户基本信息
  updateInfo(data) {
    return this.request({
      url: commonJs.localurl + '/miniapp/doctor/baseInfo',
      header: commonJs.getToken(),
      method: "POST",
      data: {...data}
    })
  }
}

export {
  loginModel
}