import {
  observable,
  action
} from "mobx-miniprogram"
export const palyerStore = observable({
  // 数据
  playSongList: [],
  playSongIndex: 0,
  id: -1, // 歌曲id
  currentSong: {}, // 歌曲详情
  lyric: [], // 歌词数组
  currentTime: 0, // 记录当前播放时间
  duration: 0, // 记录歌曲持续时间
  isPlaying: true, // 是否正在播放
  currentLyricText: '', // 当前歌词
  currentLyricIndex: -1, // 记录当前歌词的索引
  // 计算属性
  // actions 方法, 用来修改 store 中的数据
  updatePlaySongList: action(function (list) {
    this.playSongList = list;
  }),
  updatePlaySongIndex: action(function (index) {
    this.playSongIndex = index;
  }),
  playMusicWithSongId: action(function () {
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
        if (audioContext.loop) return
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
  })
})