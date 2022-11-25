Page({
  data: {
    isLogin: false,
    userInfo: {},
    tabs: [{
      name: '我的收藏',
      type: 'collect'
    }, {
      name: '我的喜欢',
      type: 'like'
    }, {
      name: '历史记录',
      type: 'history'
    }]
  },
  onLoad() {
    // 判断用户是否登录(注：也可以放到app.js文件中);
    const openid = wx.getStorageSync('openid');
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      isLogin: !!openid, // 这里巧用了类型转换;如果有openid就是 true
    })
    if (this.data.isLogin) {
      this.setData({
        userInfo,
      })
    }
  },
  //===============================事件监听
  async onUserInfoTap() {
    // 1. 获取用户的头像和昵称
    const profile = await wx.getUserProfile({
      desc: '授权用于完善用户信息',
    });
    // 2. 获取用户的openid
    const loginRes = await wx.cloud.callFunction({
      name: 'music-login',
    });
    const openid = loginRes.result.openid;
    // 3. 保存到本地
    wx.setStorageSync('openid', openid);
    wx.setStorageSync('userInfo', profile.userInfo);
    // 更新数据
    console.log(loginRes.result);
    console.log(profile.userInfo);
    this.setData({
      isLogin: true,
      userInfo: profile.userInfo
    })
  },
  // 
  onTabTap(e) {
    const type = e.currentTarget.dataset.type;
    const title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: `/pages/detail-song/detail-song?type=profile&tabname=${type}&title=${title}`
    })
  }
})