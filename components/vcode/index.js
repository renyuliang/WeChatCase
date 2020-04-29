import { codeModel } from '../../models/vcode.js'
let getCode = new codeModel()
Component({
  // externalClasses: ['init-code'],
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  properties: {
    phone: {
      type: Number,
      value: ''
    },
    codeFrom: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 防止重复点击
    getAgain: true,
    codeText: '获取验证码',
    disabled: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getCode() {
      setTimeout(()=>{
        if (this.properties.phone) {
          if (this.data.getAgain) {
            let second = 60
            this.setData({
              getAgain: false,
              disabled: true
            })
            var time = setInterval(() => {
              second--;
              this.setData({
                codeText: "已发送" + second
              })
              if (second <= 0) {
                this.setData({
                  codeText: "获取验证码",
                  getAgain: true,
                  disabled: false
                })
                clearInterval(time)
              }
            }, 1000)
            if (this.properties.codeFrom === 'login') {
              // 发送请求
              getCode.list(this.properties.phone).then(res => { })
            } else {
              getCode.authCode().then(res => { })
            }
          }
        } else {
          wx.showToast({
            title: '请输入正确的手机号',
            icon: 'none'
          })
        }
      },300)
    },
  }
})