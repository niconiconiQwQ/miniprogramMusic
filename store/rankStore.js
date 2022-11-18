import {
  observable,
  action
} from 'mobx-miniprogram';
import {
  getplaylistDetail
} from "../services/music"
const rinksId = [3779629, 2884035, 19723756];
export const rankStore = observable({
  // 数据字段
  // 计算属性
  newRank: [],
  originRank: [],
  upRank: [],
  // actions 方法, 用来修改 store 中的数据
  fetchRanks: action(function () {
    for (const id of rinksId) {
      getplaylistDetail(id).then(res => {
        console.log(res);
      })
    }
  })
})