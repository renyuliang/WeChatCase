import * as storage from './storage.js'
class HTTP {
  request({
    url,
    data = {},
    method = "GET",
    header
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method, header)
    })
  }
  _request(url, resolve, reject, data = {}, method = "GET", header) {
    // 请求头 
    if (!header) {
      header = {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        // 判断状态码
        const code = res.statusCode.toString()
        // 如果状态码 开头是2
        if (code.startsWith('2')) {
          resolve(res.data)
          if (res.data.stateCode !== '000000') {
            if (res.data.stateCode === '700004') {
              return false
            }
            if (res.data.message) {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
          }
        } else {
          reject()
          // 服务器报错
          wx.showToast({
            title: '请求地址异常',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        reject()
        wx.showToast({
          title: '服务器异常',
          icon: 'none'
        })
      }
    })
  }
}

export {
  HTTP
}