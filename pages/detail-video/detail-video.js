// pages/detail-video/detail-video.js
import {
  getMVUrl,
  getMVDetail,
  getRelatedMV
} from "../../services/video"
Page({
  data: {
    id: 0,
    mvUrl: '',
    mvDetail: {},
    mvRelated: []
  },
  onLoad(options) {
    // 1. 获取id
    const id = options.id;
    this.setData({
      id,
    });
    // 2. 请求数据
    this.fetchMVUrl();
    this.fetchMVDetail();
    this.fetchRelatedMV();
  },
  async fetchMVUrl() {
    const res = await getMVUrl(this.data.id);
    this.setData({
      mvUrl: res.data.url
    })
  },
  async fetchMVDetail() {
    const res = await getMVDetail(this.data.id);
    this.setData({
      mvDetail: res.data
    })
  },
  async fetchRelatedMV() {
    const res = await getRelatedMV(this.data.id);
    this.setData({
      mvRelated: res.data
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
  onShow() {

  },

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