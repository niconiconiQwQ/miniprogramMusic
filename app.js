// app.js
App({
  globalData: {
    screenWidth: 375,
    screenHeight: 667,
    statusBarHeight: 44,
    contentHeight: 500,
  },
  onLaunch() {
    // 获取设备信息
    wx.getSystemInfo({
        success: (res) => {
          this.globalData.screenWidth = res.screenWidth;
          this.globalData.screenHeight = res.screenHeight;
          this.globalData.statusBarHeight = res.statusBarHeight;
          this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44;
        }
      }),
      // 云开发进行初始化
      wx.cloud.init({
        env: 'cloud1-3gdazm984a860482',
      })
  },
})