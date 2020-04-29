import * as storage from './storage.js'

// 开发环境
// const localurl = 'http://192.168.0.209:8003'; // 测试数据调试接口
// const baseurl = 'http://192.168.0.209:9001' // 测试接口地址公用部分
// const pdfurl = 'https://testapp47.medcrab.com' // 测试pdf预览地址

// 测试环境
// const localurl = 'https://testservice.medpot.cn'; // 测试数据调试接口
// const baseurl = 'https://testuser.medcrab.com' // 测试接口地址公用部分
// const pdfurl = 'https://testapp47.medcrab.com' // 测试pdf预览地址

// 预发布环境
// const localurl = 'https://preservice.medpot.cn'; // 测试数据调试接口
// const baseurl = 'https://preuser.medcrab.com' // 测试接口地址公用部分
// const pdfurl = 'https://preappservice.medcrab.com' // 测试pdf预览地址

// 正式环境 版本号 (每次提交审核追加新的版本号)
const localurl = 'https://service.medpot.cn/v1.0.1'; // 正式数据调试接口
const baseurl = 'https://user.medcrab.com/v1.0.1';  // 正式接口地址公用部分
const pdfurl = 'https://appservice.medcrab.com'; // 正式pdf预览地址

// 正式环境
// const localurl = 'https://service.medpot.cn'; // 正式数据调试接口
// const baseurl = 'https://user.medcrab.com';  // 正式接口地址公用部分
// const pdfurl = 'https://appservice.medcrab.com'; // 正式pdf预览地址


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
  baseurl: baseurl,
  pdfurl: pdfurl,
  getToken,
  getOpenUnioid
}