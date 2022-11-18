// components/menu-area/menu-area.js
const app = getApp();
Component({
  properties: {
    title: {
      type: String,
      value: '默认歌单'
    },
    menuList: {
      type: Array,
      value: []
    }
  },
  data: {
    screenWidth: 375,
  },
  methods: {
    onMoreClick() {
      wx.navigateTo({
        url: '/pages/detail-menu/detail-menu',
      })
    }
  },
  lifetimes: {
    created() {
      this.setData({
        screenWidth: app.globalData.screenWidth
      })
    },
  }
})