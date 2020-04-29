// pages/my/myGuideSearch/myGuideSearch.js
import * as regular from '../../../utils/is.js'
import {
  guideSearch
} from '../../../models/guideSearch.js';
let getGuide = new guideSearch()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showloadingBottom: false,
    requireRepeat: true, // 防止滚动太快，加载太多
    noData: false,
    guideNoData: false, // 暂无指南
    searchData: {
      pageNum: 1, // 当前页码
      fileName: '', // 指南名称
      department: '', // 科室
      diseases: '', // 疾病
      fileCategory: '', // 指南类别
      publishYear: '', // 年限
      publishYearEnd: '' // 年限 -- 更早
    },
    total: 0, // 总条数
    guideList: [],
    fixHeight: 0, // 顶部搜索固定高度
    scrollHeight: 0, // 滚动条高度
    showDialog: false,
    showDialogGuideStyle: false, // 打开指南类别
    showDialogGuideYear: false, // 打开指南年限
    showDialogGuideSick: false, // 打开科室疾病
    showHeight: 0, // 弹窗内容高度
    searchForm: {
      depart: '科室疾病',
      year: '发表年限',
      style: '指南类别'
    },
    guideStyle: [{
      name: '全部类别',
      value: ''
    }], // 指南
    guideYear: [], // 年份
    storeGuideDepart: [{
      name: '全部科室',
      value: ''
    }],
    guideDepart: [], // 科室
    storeDepartName: '', // 记录科室名称
    guideSick: [], // 疾病
    storeGuideSick: [], // 储存疾病
    guideStyleSelectIndex: 0, // 默认选择第一项
    guideYearSelectIndex: 0,
    guideDepartSelectIndex: 0,
    guideSickSelectIndex: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData(1)
    this.getScroll()
    this.getDepartSick()
    this.setYear()
    this.getGuideType()
    this.initdownlist = this.selectComponent('#initdownlist')
  },
  // 清空搜索
  deleteSearch(e) {
    this.setData({
      'searchData.department': '',
      'searchData.diseases': '',
      'searchData.fileCategory': '',
      'searchData.publishYear': '',
      'searchData.publishYearEnd': ''
    })
    this.searchSame(e)
  },
  // 搜索
  confirmSearch(e) {
    this.searchSame(e)
  },
  // 聚焦
  focusInput(){
    if (this.data.showDialog) {
      this.setData({
        showDialog: false,
        showDialogGuideSick: false,
        showDialogGuideYear: false,
        showDialogGuideStyle: false
      })
      this.initdownlist.hideModal()
    }
  },
  // 搜索和清空搜索 操作逻辑一样
  searchSame(e) {
    this.setData({
      guideStyleSelectIndex: 0,
      guideYearSelectIndex: 0,
      guideDepartSelectIndex: 0,
      guideSickSelectIndex: '',
      guideList: [],
      showDialog: false,
      showDialogGuideSick: false,
      showDialogGuideYear: false,
      showDialogGuideStyle: false,
      'searchForm.depart': '科室疾病',
      'searchForm.year': '发表年限',
      'searchForm.style': '指南类别',
      'searchData.pageNum': 1,
      'searchData.fileName': e.detail.searchInput
    })
    this.getData(1, e.detail.searchInput)
    this.getDepartSick(e.detail.searchInput)
  },
  // 加载数据
  getData(pageNum, fileName, department, diseases, fileCategory, publishYear, publishYearEnd, scroll = '') {
    this.setData({
      showloadingBottom: true,
      requireRepeat: false,
      noData: false,
      guideNoData: false
    })
    setTimeout(() => {
      getGuide.list(pageNum, fileName, department, diseases, fileCategory, publishYear, publishYearEnd).then(res => {
        this.setData({
          showloadingBottom: false,
          requireRepeat: true
        })
        if (res.data.list) {
          res.data.list.forEach(item => {
            if (item.publishDate) {
              item.showDate = regular.changeDate(item.publishDate);
            }
            if (item.fileTag) {
              let tags = ''
              if (!item.fileTag.includes('/')) {
                item.fileTag = item.fileTag + '/'
              }
              tags = item.fileTag.split(/\//g);
              let newarr = tags.filter(val => {
                if (val.length <= 6) {
                  return val
                }
              })
              item._fileTag = newarr.length > 3 ? newarr.slice(0, 3) : newarr
            }
          })
          this.setData({
            guideList: this.data.guideList.concat(res.data.list),
            total: res.data.total
          })
          console.log(this.data.guideList)
          setTimeout(()=>{
            this.setData({
              guideNoData: this.data.guideList.length <= 0 ? true : false
            })
          },100)
        }
      })
    }, 300)
  },
  tapRollBottom() {
    if (this.data.guideList.length) {
      if (this.data.guideList.length >= this.data.total) {
        // 显示暂无数据
        this.setData({
          noData: true
        })
      } else {
        if (this.data.requireRepeat) {
          this.setData({
            'searchData.pageNum': this.data.searchData.pageNum + 1
          })
          this.getData(this.data.searchData.pageNum, this.data.searchData.fileName, this.data.searchData.department, this.data.searchData.diseases, this.data.searchData.fileCategory, this.data.searchData.publishYear, this.data.searchData.publishYearEnd)
        }
      }
    }
  },
  // 获取滚动条高度
  getScroll() {
    let that = this
    wx.createSelectorQuery().in(this).selectAll('.moreGuide').boundingClientRect(function(rect) {
      that.setData({
        fixHeight: rect[0].height + 3,
        scrollHeight: wx.getSystemInfoSync().windowHeight - (rect[0].height + 3)
      })
      console.log(rect[0].height)
    }).exec()
  },
  // 设置科室疾病
  getDepartSick(name) {
    this.setData({
      guideDepart: this.data.storeGuideDepart,
      guideSick: [],
      storeGuideSick: []
    })
    getGuide.getGuideDepart(name).then(res => {
      let parent = []
      let child = []
      res.data.forEach(item => {
        if (item.totalNum > 0) {
          // 第一级 科室
          let obj = {}
          obj.id = item.id
          if (item.name.length>6){
            obj.name=regular.cutout(item.name,7)
          }else{
            obj.name = item.name
          }
          parent.push(obj)
          // 第二级 疾病
          item.children.forEach(itemChild => {
            if (itemChild.totalNum > 0 ) {
              let objChild = {}
              objChild.pid = itemChild.pid
              objChild.name = itemChild.name
              child.push(objChild)
            }
          })
        }
      })
      this.setData({
        guideDepart: this.data.storeGuideDepart.concat(parent),
        guideSick: [],
        storeGuideSick: child
      })
    })
  },
  // 科室疾病选择
  choseSick() {
    this.setData({
      showDialogGuideSick: true
    })
    this.getConHeight('.depart')
  },
  // 选择科室
  hideModalDepart(e) {
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    this.setData({
      guideDepartSelectIndex: index,
      guideSickSelectIndex: '',
      guideSick: []
    })
    if (index == 0) {
      this.setData({
        guideList: [],
        showDialog: false,
        showDialogGuideSick: false,
        storeDepartName: '',
        guideSick: [],
        'searchForm.depart': regular.cutout(e.currentTarget.dataset.name, 3),
        'searchData.pageNum': 1,
        'searchData.department': '',
        'searchData.diseases': ''
      })
      this.initdownlist.hideModal()
      this.getData(1, this.data.searchData.fileName, this.data.searchData.department, this.data.searchData.diseases, this.data.searchData.fileCategory, this.data.searchData.publishYear, this.data.searchData.publishYearEnd)
    } else {
      // 切换疾病
      let newSick = [
        {
          pid:'',
          name: '全部疾病'
        }
      ]
      this.data.storeGuideSick.forEach(item => {
        if (id == item.pid) {
          let obj = {}
          obj.pid = item.pid
          obj.name = item.name
          newSick.push(obj)
          // 设置科室名称
          this.setData({
            storeDepartName: e.currentTarget.dataset.name
          })
        }
      })
      this.setData({
        guideSick: newSick
      })
      // 疾病列表为空时
      if (this.data.guideSick.length == 1) {
        this.setData({
          guideList: [],
          showDialog: false,
          showDialogGuideSick: false,
          storeDepartName: e.currentTarget.dataset.name,
          guideSick: [],
          'searchForm.depart': regular.cutout(e.currentTarget.dataset.name, 3),
          'searchData.pageNum': 1,
          'searchData.department': e.currentTarget.dataset.name,
          'searchData.diseases': ''
        })
        this.initdownlist.hideModal()
        this.getData(1, this.data.searchData.fileName, this.data.searchData.department, this.data.searchData.diseases, this.data.searchData.fileCategory, this.data.searchData.publishYear, this.data.searchData.publishYearEnd)
      }
    }
  },
  // 选择疾病
  hideModalSick(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      showDialog: false,
      showDialogGuideSick: false,
      guideSickSelectIndex: index,
      'searchData.pageNum': 1,
      'searchData.department': this.data.storeDepartName,
      guideList: []
    })
    if (index === 0) {
      this.setData({
        'searchForm.depart': regular.cutout(this.data.storeDepartName, 3),
        'searchData.diseases': ''
      })
    } else {
      this.setData({
        'searchForm.depart': regular.cutout(e.currentTarget.dataset.name, 3),
        'searchData.diseases': e.currentTarget.dataset.name
      })
    }
    this.initdownlist.hideModal()
    this.getData(1, this.data.searchData.fileName, this.data.searchData.department, this.data.searchData.diseases, this.data.searchData.fileCategory, this.data.searchData.publishYear, this.data.searchData.publishYearEnd)
  },
  // 设置年份
  setYear() {
    let arr = ['不限']
    for (let i = new Date().getFullYear(); i >= (new Date().getFullYear() - 5); i--) {
      arr.push(i)
    }
    arr.push('更早')
    this.setData({
      guideYear: arr
    })
  },
  // 年限选择
  choseYear() {
    this.setData({
      showDialogGuideYear: true
    })
    this.getConHeight('.guideYear')
  },
  // 关闭年限
  hideModalYear(e) {
    let index = e.currentTarget.dataset.index
    // 判断年份为不限、更早
    this.setData({
      showDialog: false,
      showDialogGuideYear: false,
      guideList: [],
      guideYearSelectIndex: index,
      'searchForm.year': this.data.guideYear[index],
      'searchData.pageNum': 1,
      'searchData.publishYear': index == 0 ? '' : this.data.guideYear[index] == '更早' ? '' : e.currentTarget.dataset.year,
      'searchData.publishYearEnd': this.data.guideYear[index] == '更早' ? (new Date().getFullYear()) - 6 : ''
    })
    this.initdownlist.hideModal()
    this.getData(1, this.data.searchData.fileName, this.data.searchData.department, this.data.searchData.diseases, this.data.searchData.fileCategory, this.data.searchData.publishYear, this.data.searchData.publishYearEnd)
  },
  // 设置指南列表
  getGuideType() {
    getGuide.getGuideType().then(res => {
      let arr = []
      res.data.forEach(item => {
        let obj = {}
        obj.name = item.name
        obj.value = item.value
        arr.push(obj)
      })
      this.setData({
        guideStyle: this.data.guideStyle.concat(arr)
      })
    })
  },
  // 指南选择
  choseStyle() {
    this.setData({
      showDialogGuideStyle: true
    })
    this.getConHeight('.guideStyle')
  },
  // 关闭指南选择
  hideModalStyle(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      showDialog: false,
      showDialogGuideStyle: false,
      guideStyleSelectIndex: index,
      guideList: [],
      'searchForm.style': this.data.guideStyle[index].name,
      'searchData.pageNum': 1,
      'searchData.fileCategory': e.currentTarget.dataset.value
    })
    this.initdownlist.hideModal()
    this.getData(1, this.data.searchData.fileName, this.data.searchData.department, this.data.searchData.diseases, this.data.searchData.fileCategory, this.data.searchData.publishYear, this.data.searchData.publishYearEnd)
  },
  // 关闭指南蒙层
  tipHideModal() {
    this.setData({
      showDialog: false,
      showDialogGuideStyle: false,
      showDialogGuideYear: false,
      showDialogGuideSick: false
    })
  },
  // 获取内容高度
  getConHeight(className) {
    let that = this
    this.setData({
      showDialog: !this.data.showDialog
    })
    if (that.data.showDialog) {
      wx.createSelectorQuery().in(this).selectAll(className).boundingClientRect(function(rect) {
        that.setData({
          showHeight: rect[0].height
        })
      }).exec()
      // 打开动画
      that.initdownlist.showModal()
    } else {
      this.setData({
        showDialogGuideStyle: false,
        showDialogGuideYear: false,
        showDialogGuideSick: false
      })
      // 关闭 
      that.initdownlist.hideModal()
    }
  }
})