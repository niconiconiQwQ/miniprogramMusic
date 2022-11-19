// components/nav-bar/nav-bar.js
const app = getApp();
Component({
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