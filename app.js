// app.js
App({
  globalData: {
    screenWidth: 375,
    screenHeight: 667,
    statusBarHeight: 44,
  },
  onLaunch() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.screenWidth = res.screenWidth;
        this.globalData.screenHeight = res.screenHeight;
        this.globalData.statusBarHeight = res.statusBarHeight;
      }
    })
  },
})