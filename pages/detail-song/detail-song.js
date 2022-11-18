// pages/detail-song/detail-song.js
import {
  createStoreBindings
} from "mobx-miniprogram-bindings";
import {
  recommendStore
} from "../../store/recommendStore.js";
Page({
  data: {
    
  },
  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store: recommendStore,
      fields: ['recommendSongs'],
    });
  },

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