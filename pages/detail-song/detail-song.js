// pages/detail-song/detail-song.js
import {
  getplaylistDetail
} from "../../services/music"
import {
  palyerStore
} from "../../store/playerStore"
import {
  createStoreBindings
} from "mobx-miniprogram-bindings"
Page({
  data: {
    songInfo: {},
    type: '',
  },
  onLoad(options) {
        // 绑定palyerStore仓库
        this.storeBindings = createStoreBindings(this, {
          store: palyerStore,
          fields: ['playSongList'],
          actions: ['updatePlaySongList']
        })
    this.setData({
      type: options.type
    })
    // 判断是从哪个类型跳转过来的(menu/rank)，再做分支
    if (options.type === 'menu') {
      // 从menu跳过来，要发请求获取歌的数据
      const id = options.id;
      this.fetchMenuSongInfo(id);
    } else if (options.type === "rank") {
      // 从rank跳过的，歌的数据是传递过来的
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on('acceptDataFromOpenerPage', (data) => {
        this.setData({
          // 设置数据
          songInfo: data.data
        });
        // 动态设置标题
        wx.setNavigationBarTitle({
          title: data.data.name,
        })
      })
    }
  },
  // ========网络请求
  fetchMenuSongInfo(id) {
    getplaylistDetail(id).then(res => {
      this.setData({
        songInfo: res.playlist
      })
    })
  },
  // ============ 事件
      onSongItemTap() {
        this.updatePlaySongList(this.data.songInfo.tracks);
      },
  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
})