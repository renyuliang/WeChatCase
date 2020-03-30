// pages/my/myGuidePDF/myGuidePDF.js
import * as storage from '../../../utils/storage.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pdf:'',
    showPDF: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.fileName,
    })
    this.setData({
      pdf: options.pdfUrl ? options.pdfUrl + '/1' : '',
      showPDF: options.pdfUrl ? true : false
    })
  },

  // 记录卸载时间
  onUnload:function() {
    let obj = storage.get('time')
    obj['end'] = new Date().getTime()
    storage.set('time', obj)
  }
})