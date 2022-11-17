export function querySelect(select) {
  return new Promise(resolve => {
    const query = wx.createSelectorQuery();
    query.select(select).boundingClientRect().exec(res => {
      return resolve(res)
    })
  })
}