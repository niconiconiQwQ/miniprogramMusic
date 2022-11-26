// 这里封装 对数据库的 增删改查
export const db = wx.cloud.database();
class myCollection {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  };
  // 封装增删改查
  add(data) {
    return this.collection.add({
      data,
    })
  }
  remove(condition, isDoc = true) {
    if (isDoc) {
      return this.collection.doc(condition).remove();
    } else {
      return this.collection.where(condition).remove();
    }
  }
  update(condition, data, isDoc = true) {
    if (isDoc) {
      return this.collection.doc(condition).update({
        data
      });
    } else {
      return this.collection.where(condition).update({
        data
      });
    }
  }
  query(condition, offset = 0, size = 20, isDoc = false) {
    if (isDoc) {
      return this.collection.where(condition).get()
    } else {
      return this.collection.where(condition).skip(offset).limit(size).get()
    }
  }
}
export const c_collect = new myCollection('c_collect');
export const c_like = new myCollection('c_like');
export const c_history = new myCollection('c_history');
export const c_menu = new myCollection('c_menu');