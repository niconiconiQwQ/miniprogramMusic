// pages/music-player/music-player.js
import {
  throttle
} from "underscore" // 引入节流
import {
  palyerStore,
  audioContext
} from "../../store/playerStore"
import {
  createStoreBindings
} from "mobx-miniprogram-bindings"
const app = getApp(); // 获取App
Page({
  data: {
    // ==============页面相关
    pageTitles: ['歌曲', '歌词'], // 导航标题
    currentPage: 0, // 记录当前第几页
    contentHeight: 0, // 内容高度,
    statusBarHeight: 44, // 状态栏高度
  },
  onLoad(options) {
    // 绑定palyerStore仓库
    this.storeBindings = createStoreBindings(this, {
      store: palyerStore,
      fields: ['playSongList', 'playSongIndex', 'currentSong', 'duration', 'lyric', 'currentLyricIndex', 'currentLyricText', 'currentTime', 'lyricScrollTop', 'sliderVal', 'isPlaying', 'playModeIndex'],
      actions: ['playMusicWithSongId', 'updateSliderStatus', 'playMusicStatus', 'changePlayMode', 'playNewMusic']
    })
    // 获取设备信息； 得到内容高度
    this.setData({
      contentHeight: app.globalData.contentHeight
    });
    const id = options.id; // 获取id
    // 在 onLoad 阶段，根据id调用一次播放歌曲
    // 如果没有id传来，说明是点击音乐工具栏进来的，不需要重新播放歌曲
    if (options.id) {
      this.playMusicWithSongId(id);
    }
  },
  //============================== 事件监听
  // 点击返回
  onNavBack() {
    wx.navigateBack();
  },
  // 轮播图滑动事件
  swiperChange(event) {
    this.setData({
      currentPage: event.detail.current
    })
  },
  // 点击轮播图标题导航事件
  onTitleTap(event) {
    this.setData({
      currentPage: event.currentTarget.dataset.index
    })
  },
  //========================  音乐播放相关的页面事件
  // 点击点击 滚动条事件
  onSliderChange(e) {
    // 1. 获取滑块位置对应的值; 算出当前时间
    const currentTime = this.data.duration * (e.detail.value / 100);
    this.setData({
      silderVal: e.detail.value,
    })
    // 记录滑块是否在滚动的状态
    this.updateSliderStatus(false);
    audioContext.seek(currentTime / 1000);
  },
  // 滑块拖动事件
  onSliderChanging: throttle(function (e) {
    // 1. 获取滑动到的位置的val, 并计算出相应的时间
    const currentTime = e.detail.value / 100 * this.data.duration;
    // 这里 滑动过程只改变页面上时间， 不改变真实歌曲进度
    this.setData({
      currentTime,
    })
    // 2. 设置阀门，让滑动状态置为true；
    this.updateSliderStatus(true);
  }, 200),
  //=================控制歌曲的播放相关逻辑抽取到了playerstore中
  // 点击播放或暂停
  onPlayOrPauseTap() {
    this.playMusicStatus();
  },
  // 点击上一首歌
  onPrevBtnTap() {
    this.playNewMusic(false);
  },
  // 点击下一首歌
  onNextBtnTap() {
    this.playNewMusic(true);
  },
  // 改变播放模式
  onModeBtnTap() {
    this.changePlayMode();
  },
  onunload() {
    this.storeBindings.destroyStoreBindings();
  }
})