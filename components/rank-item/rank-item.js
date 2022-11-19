// components/rank-item/rank-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    type:{
      type:String,
      value:''
    }
  },
  data: {

  },

  methods: {
    onRankItemTab() {
      wx.navigateTo({
        url: `/pages/detail-song/detail-song?type=${this.properties.type}`,
        success:  (res)=> {
          // 挑战成功后，传递数据过去
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            data: this.properties.itemData
          })
        }
      })
    }
  }
})