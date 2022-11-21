// pages/main-music/main-music.js
import {
  getBanner,
  getSongMenuList
} from "../../services/music"
import {
  querySelect
} from "../../utils/query_select.js"
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
  recommendStore
} from "../../store/recommendStore.js";
import {
  rankStore
} from "../../store/rankStore"
import {
  palyerStore
} from "../../store/playerStore"
import throttle from "../../utils/throttle";
const querySelectThrottle = throttle(querySelect);
Page({
  data: {
    searchVal: '',
    bannerList: [],
    bannerHeight: 150,
    hotPlayList: [],
    screenWidth: 375,
    recMenuList: []
  },
  onLoad(options) {
    // 绑定推荐歌单仓库
    this.storeBindings = createStoreBindings(this, {
      store: recommendStore,
      fields: ['recommendSongs'],
      actions: ['fetchRecommendSongs']
    });
    // 绑定排行榜仓库
    this.storeBindings2 = createStoreBindings(this, {
      store: rankStore,
      fields: ['newRank', 'originRank', 'upRank'],
      actions: ['fetchRanks']
    });
    // 绑定全局歌单列表
    this.storeBindings3 = createStoreBindings(this, {
      store: palyerStore,
      fields: ['playSongList', 'playSongIndex'],
      actions: ['updatePlaySongList', "updatePlaySongIndex"]
    });
    this.fetchBanners(); // 获取轮播图
    this.fetchRecommendSongs(); // store action 获取推荐歌单
    this.fetchHotplaylist(); // 获取热门歌单
    this.fetchRecMenuList(); // 获取推荐歌单
    this.fetchRanks(); // 获取排行榜
  },
  // ===================== 界面的事件监听
  onSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },
  async onBannerImageLoad(event) {
    // 下面操作为创建一个选择器，通过选择器获取某元素/组件
    const res = await querySelectThrottle('.banner-image');
    this.setData({
      bannerHeight: res[0].height
    })
  },
  // 点击更多，导航到更多推荐歌单
  onRecommendMoreClick() {
    wx.navigateTo({
      url: '/pages/detail-song/detail-song',
    })
  },
  // 点击推荐歌曲某一个首歌，
  onSongItemTap(e) {
    this.updatePlaySongList(this.data.recommendSongs);
    this.updatePlaySongIndex(e.currentTarget.dataset.index)
  },
  // ================网络请求的方法
  // 获取轮播图
  async fetchBanners() {
    const res = await getBanner();
    this.setData({
      bannerList: res.banners
    })
  },
  // 获取热门歌单数据
  async fetchHotplaylist() {
    await getSongMenuList().then(res => {
      this.setData({
        hotPlayList: res.playlists
      })
    })
  },
  // 获取推荐歌单(这里就用华语)
  async fetchRecMenuList() {
    getSongMenuList('华语').then(res => {
      this.setData({
        recMenuList: res.playlists
      })
    })
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings();
    this.storeBindings2.destroyStoreBindings();
    this.storeBindings3.destroyStoreBindings();
  },

})