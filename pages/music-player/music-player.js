// pages/music-player/music-player.js
import {
  getSongDetail,
  getSongLyric
} from "../../services/player"
import {
  throttle
} from "underscore"
import {
  parseLyric
} from "../../utils/parse-lyric"
import {
  palyerStore
} from "../../store/playerStore"
import {
  createStoreBindings
} from "mobx-miniprogram-bindings"
const app = getApp();
const audioContext = wx.createInnerAudioContext();
Page({
  data: {
    pageTitles: ['歌曲', '歌词'],
    currentPage: 0, // 记录当前第几页
    id: -1, // 歌曲id
    currentSong: {}, // 歌曲详情
    lyric: [], // 歌词数组
    currentLyricText: '', // 当前歌词
    currentLyricIndex: -1, // 记录当前歌词的索引
    currentTime: 0, // 记录当前播放时间
      duration: 0, // 记录歌曲持续时间
    isPlaying: true, // 是否正在播放
    statusBarHeight: 44, // 状态栏高度
    contentHeight: 0, // 内容高度,
    sliderVal: 0, // 记录滑块的值
    isSliderChanging: false, // 记录是否正在拖动滑块
    lyricScrollTop: 0, // 歌词滚动的距离,
    isFirstPlay: true, // 是否是第一次播放,
    playModeIndex: 0 // 自己规定 0 表示顺序  1表示单曲 2表示随机
  },
  onLoad(options) {
    // 绑定palyerStore仓库
    this.storeBindings = createStoreBindings(this, {
      store: palyerStore,
      fields: ['playSongList', 'playSongIndex'],
      actions: ['updatePlaySongIndex']
    })
    // 获取设备信息
    this.setData({
      contentHeight: app.globalData.contentHeight
    })
    // 获取id
    const id = options.id
    // 根据id播放歌曲
    this.setupPlaySong(id)
  },
  // 记录当前时间 并 修改 sliderval
  updateProgress() {
    const sliderVal = this.data.currentTime / this.data.duration * 100
    this.setData({
      sliderVal,
      currentTime: audioContext.currentTime * 1000,
    })
  },
  //================= 事件监听
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
  // 点击滚动条事件
  onSliderChange(e) {
    // 1. 获取滑块位置对应的值;算出当前时间
    const currentTime = this.data.duration * (e.detail.value / 100);
    this.setData({
      currentTime,
      silderVal: e.detail.value,
      isSliderChanging: false,
    })
    audioContext.seek(currentTime / 1000);
  },
  // 滑动滚动条事件
  onSliderChanging: throttle(function (e) {
    // 1. 获取滑动到的位置的val,并计算出相应的时间
    const currentTime = e.detail.value / 100 * this.data.duration;
    // 2. 设置阀门，让滑动状态置为true；滑动过程只改变页面上时间，不改变歌曲进度
    this.setData({
      isSliderChanging: true,
      currentTime,
    })
  }, 100),
  // 点击播放或暂停
  onPlayOrPauseTap() {
    if (!audioContext.paused) {
      audioContext.pause();
      this.setData({
        isPlaying: false
      })
    } else {
      audioContext.play();
      this.setData({
        isPlaying: true
      })
    }
  },
  // 点击上一首歌
  onPrevBtnTap() {
    this.changeNewSong(false)
  },
  // 点击下一首歌
  onNextBtnTap() {
    this.changeNewSong(true)
  },
  // 切换歌曲
  changeNewSong(isNext = true) {
    // 1. 获取之前的数据
    let index = this.data.playSongIndex;
    const length = this.data.playSongList.length;
    // 2. 根据之前的数据计算最新索引
    // 2.1 根据不同播放模式计算索引
    switch (this.data.playModeIndex) {
      case 1:
      // 单曲循环 点击下一首还是会切换的
      case 0:
        // 顺序播放
        index = isNext ? index + 1 : index - 1;
        // 边界判断
        if (index === length) index = 0;
        if (index === -1) index = length - 1;
        break;
      case 2:
        // 随机播放
        index = Math.floor(Math.random() * length)
        break;
    }
    const newSong = this.data.playSongList[index];
    this.setupPlaySong(newSong.id)
    // 保存最新的索引值
    this.updatePlaySongIndex(index)
  },
  // 改变播放模式
  onModeBtnTap() {
    let modeIndex = this.data.playModeIndex;
    modeIndex++;
    if (modeIndex == 3) modeIndex = 0;
    // 如果模式是1单曲循环，则设置loop
    if(modeIndex == 1) {
      audioContext.loop = true;
    }else{
      audioContext.loop = false;
    }
    this.setData({
      playModeIndex: modeIndex
    })
  },

  //================播放歌曲的逻辑
  setupPlaySong(id) {
    // 播放下一首歌之前，清空上一首歌的信息，避免页面残影；
    this.setData({
      currentSong: {},
      sliderVal: 0,
      currentTime: 0,
      duration: 0,
      currentLyricText: '',
      isPlaying: true,
      id, //  更新id
    })
    // 2. 网络请求
    // 2.1 根据id获取歌曲详情数据
    getSongDetail(id).then(res => {
      this.setData({
        currentSong: res.songs[0],
        duration: res.songs[0].dt
      })
    })
    // 2.2 获取歌词信息
    getSongLyric(id).then(res => {
      const lyricInfo = parseLyric(res.lrc.lyric)
      this.setData({
        lyric: lyricInfo
      })
    })
    // 3. 播放当前歌曲
    audioContext.stop(); // 播之前先停掉之前的歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    audioContext.autoplay = true;
    // 4. 监听播放进度
    const throttleUpdateProgress = throttle(this.updateProgress, 800, {
      leading: false,
      trailing: false
    })
    // 设置监听阀门，监听一次audioContext即可，没必要每次播放都去监听
    if (this.data.isFirstPlay) {
      audioContext.onTimeUpdate(() => {
        // 1. 如果当前没有滑动才去设置时间;
        if (!this.data.isSliderChanging) {
          // 设置滑动条和更新当前时间
          throttleUpdateProgress();
        }
        // 2. 匹配歌词; 如果没有请求回来，就return出去
        if (!this.data.lyric.length) return;
        // 这里让 index 默认为最后一个索引，解决最后一句歌词匹配不到的问题
        let index = this.data.lyric.length - 1;
        for (let i = 0; i < this.data.lyric.length; i++) {
          if (audioContext.currentTime * 1000 < this.data.lyric[i].time) {
            index = i - 1;
            break;
          }
        }
        // 设置歌词滚动的索引和文本 ；如果还是原来的索引就不要去设置歌词了
        if (this.data.currentLyricIndex === index) return;
        this.setData({
          currentLyricText: this.data.lyric[index].text,
          currentLyricIndex: index,
          lyricScrollTop: 35 * index,
        })
      });
      // 监听自动播放完
      audioContext.onEnded(() => {
        // 如果是单曲循环不需要切换下一首歌曲
        if(audioContext.loop) return
        this.changeNewSong(true);
      });
      // 处理bug; 跳进度条时，会丢失响应，需手动play
      audioContext.onWaiting(() => {
        audioContext.pause();
      })
      audioContext.onCanplay(() => {
        audioContext.play();
      })
    }
  },
  onunload() {
    this.storeBindings.destroyStoreBindings();
  }
})