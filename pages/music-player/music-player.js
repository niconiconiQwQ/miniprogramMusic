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
    statusBarHeight: 44, // 状态栏高度
    contentHeight: 0, // 内容高度,
    currentTime: 0, // 记录当前播放时间
    duration: 0, // 记录歌曲持续时间
    sliderVal: 0, // 记录滑块的值
    isSliderChanging: false, // 记录是否正在拖动滑块
    isPlaying: true, // 是否正在播放
  },
  onLoad(options) {
    // 获取设备信息
    this.setData({
      contentHeight: app.globalData.contentHeight
    })
    // 获取id
    const id = options.id
    this.setData({
      id,
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
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    audioContext.autoplay = true;
    // 4. 监听播放进度
    const throttleUpdateProgress = throttle(this.updateProgress, 800, {
      leading: false,
      trailing: false
    })
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
      // 如果还是原来的索引就不要去设置歌词了
      if (this.data.currentLyricIndex === index) return;
      this.setData({
        currentLyricText: this.data.lyric[index].text,
        currentLyricIndex: index,
      })
    });
    // 处理bug; 跳进度条时，会丢失响应，需手动play
    audioContext.onWaiting(() => {
      audioContext.pause();
    })
    audioContext.onCanplay(() => {
      audioContext.play();
    })
  },
  updateProgress() {
    // 记录当前时间 并 修改 sliderval
    const sliderVal = this.data.currentTime / this.data.duration * 100
    this.setData({
      sliderVal,
      currentTime: audioContext.currentTime * 1000,
    })
  },
  //================= 事件监听
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
  onSliderChanging(e) {
    // 1. 获取滑动到的位置的val,并计算出相应的时间
    const currentTime = e.detail.value / 100 * this.data.duration;
    // 2. 设置阀门，让滑动状态置为true；滑动过程只改变页面上时间，不改变歌曲进度
    this.setData({
      isSliderChanging: true,
      currentTime,
    })
  },
  // 点击
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
  }
})