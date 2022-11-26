import {
  storeBindingsBehavior
} from 'mobx-miniprogram-bindings';
import {
  menuStore
} from "../../store/menuStore"
import {
  c_menu
} from "../../database/index"
Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store: menuStore, // 指定要绑定的store
    fields: {
      menuList: 'menuList',
    },
    actions: {
      fetchMenuList: 'fetchMenuList',
    }
  },
  properties: {
    itemData: {
      type: Object,
      value: {},
    }
  },
  methods: {
    // 移除歌单
    async onDeleteTap() {
      // 1. 获取点击歌单的_id
      const _id = this.properties.itemData._id;
      // 删除数据
      const res = await c_menu.remove(_id);
      if (res) {
        wx.showToast({
          title: '删除歌单成功',
        })
        // 重新获取所有歌单数据
        this.fetchMenuList();
      }
    },
  }
})