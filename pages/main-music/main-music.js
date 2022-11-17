// pages/main-music/main-music.js
import {
  getBanner,
  getplaylistDetail
} from "../../services/music"
import {
  querySelect
} from "../../utils/query_select.js"
import throttle from "../../utils/throttle";
const querySelectThrottle = throttle(querySelect);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchVal: '',
    bannerList: [],
    bannerHeight: 150,
    recommendSongs: []
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
    console.log('')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchBanners();
    this.fetchRecommendSongs();
  },
  // ================网络请求的方法
  // 获取轮播图
  async fetchBanners() {
    const res = await getBanner();
    this.setData({
      bannerList: res.banners
    })
  },
  // 获取推荐歌单
  async fetchRecommendSongs() {
    let res = await getplaylistDetail(3778678);
    this.setData({
      recommendSongs: res.playlist.tracks.splice(0, 6)
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