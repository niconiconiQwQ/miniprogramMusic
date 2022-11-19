// pages/music-player/music-player.js
import {
  getSongDetail,
  getSongLyric
} from "../../services/player"
Page({
  data: {
    id: -1,
    currentSong: {},
    lyric: '',
    statusBarHeight: 44,
  },
  onLoad(options) {
    // 获取id
    const id = options.id
    this.setData({
      id,
    })
    // 2. 根据id获取歌曲详情数据
    getSongDetail(id).then(res => {
      this.setData({
        currentSong: res.songs[0],
      })
    })
    // 3. 获取歌词信息
    getSongLyric(id).then(res => {
      this.setData({
        lyric: res.lrc.lyric
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