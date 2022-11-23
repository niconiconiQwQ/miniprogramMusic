import {
  observable,
  action
} from "mobx-miniprogram"
import {
  getSongDetail,
  getSongLyric
} from "../services/player"
import {
  parseLyric
} from "../utils/parse-lyric"
import {
  throttle
} from "underscore"
export const audioContext = wx.createInnerAudioContext();
export const palyerStore = observable({
  playSongList: [], // 歌曲列表
  playSongIndex: 0, // 当前歌曲在列表中的索引
  id: -1, // 歌曲id
  currentSong: {}, // 歌曲详情
  lyric: [], // 歌词数组
  currentTime: 0, // 记录当前播放时间
  duration: 0, // 记录歌曲持续时间
  isPlaying: false, // 是否正在播放
  currentLyricText: '', // 当前歌词
  currentLyricIndex: -1, // 记录当前歌词的索引
  isFirstPlay: true, // 是否是首次播放
  lyricScrollTop: 0, // 歌词滚动的距离
  isSliderChanging: false, // 是否正在滑动
  sliderVal: 0, // 滑动的距离
  playModeIndex: 0, // 自己规定 0 表示顺序  1表示单曲 2表示随机
  // =====================actions 方法, 用来修改 store 中的数据
  // 更新歌单列表
  updatePlaySongList: action(function (list) {
    this.playSongList = list;
  }),
  //  请求更新/获取歌曲信息
  updateSongDetail: action(function (id) {
    getSongDetail(id).then(res => {
      this.currentSong = res.songs[0];
      this.duration = res.songs[0].dt
    })
  }),
  // 请求 更新 / 获取歌词信息
  updateLyric: action(function (id) {
    getSongLyric(id).then(res => {
      const lyricInfo = parseLyric(res.lrc.lyric)
      this.lyric = lyricInfo
    })
  }),
  // 清空信息
  updateCleanInfo: action(function () {
    this.currentSong = {};
    this.duration = 0;
    this.currentLyricText = '';
    this.isPlaying = true;
    this.currentTime = 0;
    this.sliderVal = 0;
  }),
  // 计算当前歌词索引和文本
  updateLyricTextIndex: action(function (currentTime) {
    // 匹配歌词; 如果没有请求回来，就return出去
    if (!this.lyric.length) return;
    // 这里让 index 默认为最后一个索引，解决最后一句歌词匹配不到的问题
    let index = this.lyric.length - 1;
    // 匹配歌词索引行为
    for (let i = 0; i < this.lyric.length; i++) {
      if (currentTime < this.lyric[i].time) {
        index = i - 1;
        break;
      }
    }
    // 设置歌词滚动的索引和文本 ；如果还是原来的索引就不要去设置歌词了;-1是有时歌词索引会为-1
    if (this.currentLyricIndex === index || index === -1) return;
    this.currentLyricText = this.lyric[index].text;
    this.currentLyricIndex = index;
    this.lyricScrollTop = 35 * index;
  }),
  // 更新歌曲的索引，从其他地方点击个歌曲时，要记录次索引
  updatePlaySongIndex:action(function(index){
    this.playSongIndex = index;
  }),
  // 更新滑块的滚动
  updateProgress: action(throttle(function (currentTime) {
    // 计算出 sliderval的值 0-100
    const sliderVal = currentTime / this.duration * 100;
    this.sliderVal = sliderVal;
  }, 800, {
    leading: false,
    trailing: false
  })),
  // 更新滚动条是否在滑动状态
  updateSliderStatus: action(function (status) {
    this.isSliderChanging = status;
  }),
  // 更新播放状态(如点击了播放暂停)
  playMusicStatus: action(function () {
    if (!audioContext.paused) {
      audioContext.pause();
      this.isPlaying = false;
    } else {
      audioContext.play();
      this.isPlaying = true;
    }
  }),
  // 改变播放的模式
  changePlayMode: action(function () {
    let modeIndex = this.playModeIndex;
    modeIndex++;
    if (modeIndex == 3) modeIndex = 0;
    // 如果模式是1单曲循环，则设置loop
    if (modeIndex == 1) {
      audioContext.loop = true;
    } else {
      audioContext.loop = false;
    }
    this.playModeIndex = modeIndex;
  }),
  // 播放新的歌曲(切换歌曲)
  playNewMusic: action(function (isNext = true) {
    // 1. 获取之前的数据
    let index = this.playSongIndex;
    const length = this.playSongList.length;
    // 2. 根据之前的数据计算最新索引
    // 2.1 根据不同播放模式计算索引
    switch (this.playModeIndex) {
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
    const newSong = this.playSongList[index];
    // 保存最新的索引值
    this.playSongIndex = index;
    // 去做播放歌曲的逻辑
    this.playMusicWithSongId(newSong.id)
  }),
  // 这里是播放歌曲的逻辑
  playMusicWithSongId: action(function (id) {
    this.id = id;
    // 2 播放下一首歌之前，清空上一首歌的信息，避免页面残影；
    this.updateCleanInfo()
    // 2.1 根据id获取歌曲详情数据
    this.updateSongDetail(id);
    // 2.2 获取歌词信息
    this.updateLyric(id);
    // 3. 播放当前歌曲
    audioContext.stop(); // 播之前先停掉之前的歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    audioContext.autoplay = true;
    // 4. 监听播放进度
    // 设置监听阀门，监听一次audioContext即可，没必要每次播放都去监听
    if (this.isFirstPlay) {
      this.isFirstPlay = false;
      // 监听歌曲时间的更新
      audioContext.onTimeUpdate(() => {
        // 更新当前播放时间
        this.currentTime = audioContext.currentTime * 1000;
        // 更新当前歌词台词以及索引
        this.updateLyricTextIndex(this.currentTime);
        // todo 设置滑块自动滚动
        if (!this.isSliderChanging) {
          // 随时间设置滑动条和更新当前时间
          this.updateProgress(audioContext.currentTime * 1000);
        }
      });
      // 监听自动播放完
      audioContext.onEnded(() => {
        // 如果是单曲循环不需要切换下一首歌曲
        if (audioContext.loop) return
        // 切换歌曲：todo
        this.playNewMusic();
      });
      // 处理bug; 跳进度条时，会丢失响应，需手动play
      audioContext.onWaiting(() => {
        audioContext.pause();
      })
      audioContext.onCanplay(() => {
        audioContext.play();
      })
    }
  })
})