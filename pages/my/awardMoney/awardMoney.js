// pages/my/awardMoney/awardMoney.js
import * as storage from '../../../utils/storage.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: options.money
    })
  },

  // 记录卸载时间
  onUnload: function () {
    // 设置详情页 红包是否自动弹窗
    storage.set('redBack', true)
  }
})