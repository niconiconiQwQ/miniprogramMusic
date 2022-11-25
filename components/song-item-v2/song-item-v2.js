import {
  c_collect,
  c_like
} from '../../database/index'
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
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
        itemList: ['收藏', '喜欢'],
        success: (res) => {
          this.handleOperationResult(res.tapIndex)
        }
      })
    },
    handleOperationResult(index) {
      let res = null;
      switch (index) {
        case 0: // 收藏
          res = c_collect.add(this.properties.itemData)
          break;
        case 1: // 喜欢
          res = c_like.add(this.properties.itemData)
          break;
      }
      const msg = index === 0 ? '收藏' : '喜欢';
      wx.showToast({
        title: `${msg}成功`,
      })
    },
  }
})