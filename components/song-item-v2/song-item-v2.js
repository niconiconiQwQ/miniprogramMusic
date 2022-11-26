import {
  c_collect,
  c_like,
  c_menu,
  db
} from '../../database/index'
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    menuList: {
      type: Array,
      value: []
    },
    index: {
      type: Number,
      value: -1,
    }
  },

  data: {

  },
  methods: {
    // ==============事件监听
    // 点击某一项歌曲
    onSongItemTap() {
      const id = this.properties.itemData.id;
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`,
      })
    },
    // 监听点击更多操作
    onMoreIconTap() {
      // 弹窗；弹出actionsheet
      wx.showActionSheet({
        itemList: ['收藏', '喜欢', '添加到歌单'],
        success: (res) => {
          this.handleOperationResult(res.tapIndex)
        }
      })
    },
    // 弹出框处理函数
    handleOperationResult(index) {
      let res = null;
      switch (index) {
        case 0: // 收藏
          res = c_collect.add(this.properties.itemData)
          break;
        case 1: // 喜欢
          res = c_like.add(this.properties.itemData)
          break;
        case 2: // 添加到歌单
          const menuName = this.properties.menuList.map(item => item.name)
          wx.showActionSheet({
            itemList: menuName,
            success: (res) => {
              const menuIndex = res.tapIndex;
              this.handleMenuIndex(menuIndex);
            }
          })
          return;
      }
      const msg = index === 0 ? '收藏' : '喜欢';
      wx.showToast({
        title: `${msg}成功`,
      })
    },
    // 添加到某歌单的处理
    async handleMenuIndex(menuIndex) {
      // 先找到要添加的那个歌单
      const menuItem = this.properties.menuList[menuIndex];
      // 向 menuItem  歌单中 的 songList属性 添加 一条记录
      const data = this.properties.itemData;
      const cmd = db.command;
      const res = await c_menu.update(menuItem._id, {
        songList: cmd.push(data),
      })
      if (res) {
        wx.showToast({
          title: '添加成功',
        })
      }
    },
  }
})