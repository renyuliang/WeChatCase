// pages/my/myGuidePDF/myGuidePDF.js
import * as storage from '../../../utils/storage.js';
import commonJs from '../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pdf: '',
    showPDF: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let inifpdf = options.pdfUrl.indexOf('.pdf') !== -1 ? options.pdfUrl : options.pdfUrl+'/1'
    this.setData({
      pdf: commonJs.pdfurl + '/pdf-viewer/pdf-preview.html?file=' + inifpdf + '&title=' + options.fileName,
      showPDF: options.publishState === '1' ? true : false
    })
  },

  // 记录卸载时间
  onUnload: function() {
    if (getApp().isLogin()) {
      let obj = storage.get('time')
      obj['end'] = new Date().getTime()
      storage.set('time', obj)
    }
    console.log('卸载')
  }
})