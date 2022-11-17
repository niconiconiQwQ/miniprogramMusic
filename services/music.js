import {
  myRequest
} from "./index"
export function getBanner(type = 0) {
  return myRequest.get({
    url: '/banner',
    data: {
      type
    }
  })
}
export function getplaylistDetail(id){
  return myRequest.get({
    url: '/playlist/detail',
    data:{
      id
    }
  })
}