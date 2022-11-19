import {
  observable,
  action
} from 'mobx-miniprogram';
import {
  getplaylistDetail
} from "../services/music"
const rinkIdMap = {
  newRank: 3779629,
  originRank: 2884035,
  upRank: 19723756
}
export const rankStore = observable({
  // 数据字段
  // 计算属性
  newRank: {},
  originRank:{},
  upRank: {},
  // actions 方法, 用来修改 store 中的数据
  fetchRanks: action(function () {
    for (const key in  rinkIdMap) {
      const id = rinkIdMap[key];
      getplaylistDetail(id).then(res => {
        this[key] = res.playlist
      })
    }
  })
})