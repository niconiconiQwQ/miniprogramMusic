// pages/detail-menu/detail-menu.js
import {
  getSongMenuTag,
  getSongMenuList
} from "../../services/music"
Page({
  data: {
    playLists: []
  },
  onLoad(options) {
    this.fetchMenuTag()
  },
  onReady() {

  },
  async fetchMenuTag() {
    // 1. 获取tags
    const res = await getSongMenuTag();
    const tags = res.tags;
    const allPromises = [];
    // 2. 根据tags去获取歌单 
    for (const tag of tags) {
      allPromises.push(getSongMenuList(tag.name));
    }
    const allRes = await Promise.all(allPromises);
    this.setData({
      playLists:allRes
    })
  },
  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})