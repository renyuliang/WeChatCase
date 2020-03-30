import * as storage from './storage.js'

// 本地调试接口
// const localurl = 'http://192.168.0.208:8003'; // 开发
const localurl = 'https://testservice.medpot.cn'; // 测试

// 正式接口地址公用部分
// const baseUrl = 'http://192.168.0.206:9001'; // 开发
const baseUrl = 'https://testuser.medcrab.com/' // 测试


// 公用头部
export function getToken() {
  let keyValue = {};
  keyValue[storage.get('token').key] = storage.get('token').value
  keyValue['content-type'] = 'application/x-www-form-urlencoded'
  return keyValue
}

// 获取用户的openid,unioid,randomCode
export function getOpenUnioid() {
  return {
    openId: storage.get('OpenUnioid').openId,
    unionId: storage.get('OpenUnioid').unionId,
    randomCode: storage.get('OpenUnioid').randomCode
  }
}

export default {
  localurl: localurl,
  baseUrl: baseUrl,
  getToken,
  getOpenUnioid
}