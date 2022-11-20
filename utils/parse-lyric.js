export function parseLyric(lyricStr) {
  const lyricInfos = [];
  const lyricLines = lyricStr.split('\n');
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  for (const line of lyricLines) {
    const res = timeReg.exec(line);
    if (!res) continue;
    const minute = res[1] * 60 * 1000; // 分钟转毫秒
    const second = res[2] * 1000; // 秒转毫秒
    const msecond = res[3].length === 2 ? res[3] * 10 : res[3] * 1;
    const time = minute + second + msecond;
    const text = line.replace(timeReg, '');
    const lyricInfo = {
      text,
      time,
    };
    lyricInfos.push(lyricInfo);
  }
  return lyricInfos;
}