import {
  c_menu
} from "../../database/index"
import {
  menuStore
} from '../../store/menuStore';
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
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
    }],
    isShowDialog: false,
    menuName: ''
  },
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: menuStore,
      fields: ['menuList'],
      actions: ['fetchMenuList']
    });
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
    this.setData({
      isLogin: true,
      userInfo: profile.userInfo
    })
  },
  // 点击 收藏或喜欢或历史记录
  onTabTap(e) {
    const type = e.currentTarget.dataset.type;
    const title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: `/pages/detail-song/detail-song?type=profile&tabname=${type}&title=${title}`
    })
  },
  // 点击 加号
  onPlusTap() {
    this.setData({
      isShowDialog: true,
    })
  },
  // 点击确认歌单
  async onConfirmTap() {
    // 获取歌单名称
    const menuName = this.data.menuName;
    // 模拟歌单数据
    const menuRecord = {
      name: menuName,
      songList: [],
    }
    // 将数据添加到数据库
    const res = await c_menu.add(menuRecord);
    if (res) {
      this.setData({
        menuName: ''
      })
      wx.showToast({
        title: '添加成功',
      });
      // 再次获取一下数据库
      this.fetchMenuList();
    }
  },
  onInputChange() {
    // 这里不用做什么
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
})