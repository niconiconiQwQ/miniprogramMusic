import {
  observable,
  action
} from 'mobx-miniprogram'
import {
  getplaylistDetail
} from "../services/music"
// getplaylistDetail(3778678)
export const recommendStore = observable({
  // 数据字段
  recommendSongs: [],
  // 计算属性
  // get sun() {
  //   return this.numA + this.numB
  // },
  // actions 方法, 用来修改 store 中的数据
  fetchRecommendSongs: action(function () {
    getplaylistDetail(3778678).then(res => {
      this.recommendSongs = res.playlist.tracks;
    })
  })
})