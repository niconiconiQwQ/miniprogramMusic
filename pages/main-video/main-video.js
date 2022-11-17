// pages/main-video/main-video.js
import {
  getTopMV
} from "../../services/video"
Page({
  data: {
    videoList: [],
    offset: 0,
    hasMore: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchTopMv();
  },
  // 发送网络请求的方法
  async fetchTopMv() {
    // 1. 获取数据
    const res = await getTopMV(this.data.offset);
    console.log(res)
    // 2. 将新的数据追加到原来数据的后面
    const newVideoList = [...this.data.videoList, ...res.data];
    // 3. 设置全新的数据
    this.setData({
      videoList: newVideoList,
      offset: this.data.videoList.length, // 用视频的数量，来更新这个偏移量
      hasMore: res.hasMore
    })
  },
  // 监听上拉和下拉功能
  onReachBottom() {
    // 1. 判断是否有更多数据
    if (!this.data.hasMore) return;
    // 2. 如果有更多的数据，再请求新的数据
    this.fetchTopMv();
  },
  async onPullDownRefresh() {
    // 1. 清空之前的数据
    this.setData({
      videoList: [],
      offset: 0,
      hasMore: true
    })
    // 2. 重新请求新的数据
    await this.fetchTopMv();
    // 3. 停止下拉刷新
    wx.stopPullDownRefresh();
  },
  // ================== 界面事件监听 ==============
})