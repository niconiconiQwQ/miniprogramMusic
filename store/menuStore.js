import {
  c_menu
} from '../database/index'
import {
  observable,
  action
} from 'mobx-miniprogram'
export const menuStore = observable({
  // 我的所有歌单数据
  menuList: [],
  // 获取歌单数据
  fetchMenuList: action(async function () {
    const res = await c_menu.query({});
    this.menuList = res.data;
  }),
})
// 该文件给引入时，自动调用该函数
menuStore.fetchMenuList();