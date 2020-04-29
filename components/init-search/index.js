// components/init-search/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  externalClasses: ['init-search'],
  properties: {
    placeholder: {
      type: String,
      value: '搜索医院名称'
    },
    focus: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchInput: '',
    showDelete: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showInput(e) {
      this.setData({
        showDelete: e.detail.value.length ? true : false,
        searchInput: e.detail.value
      })
    },
    // 清空搜索
    deleteSearch() {
      this.setData({
        showDelete: false,
        searchInput: ''
      })
      this.triggerEvent('deleteSearch',{
        searchInput: this.data.searchInput
      },{})
    },
    // 搜索
    confirmSearch(e) {
      let val = e.detail.value
      // if (val) {
        this.triggerEvent('confirmSearch', {
          searchInput: val
        }, {})
      // }
    },
    // 聚焦
    focusInput() {
      this.triggerEvent('focusInput', {}, {})
    }
  }
})
