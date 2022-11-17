import {
  myRequest
} from "./index"
// 一些mv
export function getTopMV(offset = 0, limit = 20) {
  return myRequest.get({
    url: '/top/mv',
    data: {
      limit,
      offset,
    }
  })
}
// 某mv的url
export function getMVUrl(id) {
  return myRequest.get({
    url: `/mv/url?id=${id}`
  })
}
// mv详情
export function getMVDetail(mvid) {
  return myRequest.get({
    url: "/mv/detail",
    data: {
      mvid
    }
  })
}
// mv相关视频
export function getRelatedMV(id) {
  return myRequest.get({
    url: `/related/allvideo?id=${id}`
  })
}