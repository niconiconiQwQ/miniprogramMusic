// components/nav-bar/nav-bar.js
const app = getApp();
Component({
  options: {
    multipleSlots: true, // 允许配置多个插槽
  },
  properties: {},
  data: {
    statusBarHeight: 0,
    title: '默认标题'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes: {
    attached() {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight
      })
    }
  }
})