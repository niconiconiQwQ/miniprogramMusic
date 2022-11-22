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
// import { throttle } from "underscore"
export const audioContext = wx.createInnerAudioContext();
export const palyerStore = observable({
  // ================ 数据
  playSongList: [], // 歌曲列表
  playSongIndex: 0, // 当前歌曲在列表中的索引
  id: -1, // 歌曲id
  currentSong: {}, // 歌曲详情
  lyric: [], // 歌词数组
  currentTime: 0, // 记录当前播放时间
  duration: 0, // 记录歌曲持续时间
  // isPlaying: true, // 是否正在播放
  currentLyricText: '', // 当前歌词
  currentLyricIndex: -1, // 记录当前歌词的索引
  isFirstPlay: true, // 是否是首次播放
  lyricScrollTop:0,  // 歌词滚动的距离
  // actions 方法, 用来修改 store 中的数据
  // 更新歌单列表
  updatePlaySongList: action(function (list) {
    this.playSongList = list;
  }),
  // 更新当前播放歌词索引
  updatePlaySongIndex: action(function (index) {
    this.playSongIndex = index;
  }),
  // 更新歌曲id
  updateId: action(function (id) {
    this.id = id;
  }),
  //  更新/获取歌曲信息
  updateSongDetail: action(function (id) {
    getSongDetail(id).then(res => {
      this.currentSong = res.songs[0];
      this.duration = res.songs[0].dt
    })
  }),
  // 更新 / 获取歌词信息
  updateLyric: action(function (id) {
    getSongLyric(id).then(res => {
      const lyricInfo = parseLyric(res.lrc.lyric)
      this.lyric = lyricInfo
    })
  }),
  playMusicWithSongId: action(function (id) {
    this.id = id;
    //播放下一首歌之前，清空上一首歌的信息，避免页面残影；
    // this.setData({
    //   currentSong: {},
    //   sliderVal: 0,
      // currentTime: 0,
    //   duration: 0,
    //   currentLyricText: '',
    //   isPlaying: true,
    // })
    // 3. 播放当前歌曲
      audioContext.stop(); // 播之前先停掉之前的歌曲
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.autoplay = true;
      // 4. 监听播放进度
      // 设置监听阀门，监听一次audioContext即可，没必要每次播放都去监听
      if (this.isFirstPlay) {
        this.isFirstPlay = false;
        audioContext.onTimeUpdate(() => {
          // 更新当前播放时间
          this.currentTime = audioContext.currentTime * 1000;
          // 2. 匹配歌词; 如果没有请求回来，就return出去
          if (!this.lyric.length) return;
          // 这里让 index 默认为最后一个索引，解决最后一句歌词匹配不到的问题
          let index = this.lyric.length - 1;
          // 匹配歌词索引
          for (let i = 0; i < this.lyric.length; i++) {
            if (audioContext.currentTime * 1000 < this.lyric[i].time) {
              index = i - 1;
              break;
            }
          }
          // 设置歌词滚动的索引和文本 ；如果还是原来的索引就不要去设置歌词了;-1是有时歌词索引会为-1
          if (this.currentLyricIndex === index || index === -1) return;
          this.currentLyricText = this.lyric[index].text;
          this.currentLyricIndex = index;
          this.lyricScrollTop = 35 * index;
        });
        // 监听自动播放完
        audioContext.onEnded(() => {
          // 如果是单曲循环不需要切换下一首歌曲
          if (audioContext.loop) return
          // 切换歌曲：todo
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