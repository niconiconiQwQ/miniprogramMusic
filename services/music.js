import {
  myRequest
} from "./index"
// 轮播图
export function getBanner(type = 0) {
  return myRequest.get({
    url: '/banner',
    data: {
      type
    }
  })
}
// 歌单详情
export function getplaylistDetail(id) {
  return myRequest.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}
// 请求6条歌单列表
export function getSongMenuList(cat = '全部', limit = 6, offset = 0) {
  return myRequest.get({
    url: '/top/playlist',
    data: {
      cat,
      limit,
      offset
    }
  })
}
export function getSongMenuTag() {
  return myRequest.get({
    url: '/playlist/hot'
  })
}