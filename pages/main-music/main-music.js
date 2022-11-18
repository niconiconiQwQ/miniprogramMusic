// pages/main-music/main-music.js
import {
  getBanner,
  getSongMenuList
} from "../../services/music"
import {
  querySelect
} from "../../utils/query_select.js"
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
  recommendStore
} from "../../store/recommendStore.js";
import throttle from "../../utils/throttle";
const querySelectThrottle = throttle(querySelect);
Page({
  data: {
    searchVal: '',
    bannerList: [],
    bannerHeight: 150,
    hotPlayList: [],
    screenWidth: 375,
    recMenuList: []
  },
  // 界面的事件监听
  onSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },
  async onBannerImageLoad(event) {
    // 下面操作为创建一个选择器，通过选择器获取某元素/组件
    const res = await querySelectThrottle('.banner-image');
    this.setData({
      bannerHeight: res[0].height
    })
  },
  // 导航到更多推荐歌单
  onRecommendMoreClick() {
    wx.navigateTo({
      url: '/pages/detail-song/detail-song',
    })
  },
  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store: recommendStore,
      fields: ['recommendSongs'],
      actions: ['fetchRecommendSongs']
    });
    this.fetchBanners(); // 获取轮播图
    this.fetchRecommendSongs(); // store action 获取推荐歌单
    this.fetchHotplaylist(); // 获取热门歌单
    this.fetchRecMenuList(); // 获取推荐歌单
  },
  // ================网络请求的方法
  // 获取轮播图
  async fetchBanners() {
    const res = await getBanner();
    this.setData({
      bannerList: res.banners
    })
  },
  // 获取热门歌单数据
  async fetchHotplaylist() {
    await getSongMenuList().then(res => {
      this.setData({
        hotPlayList: res.playlists
      })
    })
  },
  // 获取推荐歌单(这里就用华语)
  async fetchRecMenuList() {
    getSongMenuList('华语').then(res => {
      this.setData({
        recMenuList: res.playlists
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})