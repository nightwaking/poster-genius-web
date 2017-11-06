import { Base } from '../../util/base.js';

class Cart extends Base{
  constructor(){
    super();
    this._storageKeyName = 'cart';
  }

  /**
   * 添加商品
   * 若之前商品未被添加到购物车中，直接添加一条记录
   * 若商品存在购物车中，在相应记录 + counts
   * @param item 商品信息
   * @param counts 添加的数量
   */
  add(item, counts){
    var cartData = this.getCartDataFormLocal();
    var isHasInfo = this._isHasThatOne(item.id, cartData);
    if (isHasInfo.index == -1){
      item.counts = counts;
      //　选中状态
      item.selectStatus = true;
      cartData.push(item);
    }else{
      cartData[isHasInfo.index].counts += counts;
    }
    wx.setStorageSync(this._storageKeyName, cartData);
  }

  /**
   * 获取缓存中的数据
   */
  getCartDataFormLocal(flag){
    var res = wx.getStorageSync(this._storageKeyName);
    if (!res){
      res = []
    }
    
    // 过滤未选择的商品
    if (flag){
      var newRes = [];
      for (let i = 0; i < res.length; i++){
        if (res[i].selectStatus){
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }
    return res;
  }

  /**
   * 是否为第一次添加商品
   * @param id 商品id
   * @param arr 缓存数据
   * return 返回商品的数据，以及索引
   */
  _isHasThatOne(id, arr){
    var item;
    var result = {index: -1};
    for (let i = 0; i < arr.length; i++){
      item = arr[i];
      if (id == item.id){
        result = {
          index: i,
          data: item
        };
        break;
      }
    }
    return result;
  }

  /**
   * 获取购物车中商品总数量
   * @param flag 是否考虑商品的选择状态
   * @return counts 商品总数量
   */
  getCartTotalCounts(flag){
    var data = this.getCartDataFormLocal();
    var counts = 0;

    for (let i = 0; i < data.length; i++){
      if (flag){
        if (data[i].selectStatus){
          counts += data[i].counts;
        }
      }else{
        counts += data[i].counts;
      }
     }
    return counts;
  }

  /**
   * 修改商品数量
   * params
   * id 商品id
   * counts 数目
   */
  _changeCounts(id, counts){
    var cartData = this.getCartDataFormLocal();
    // 判断商品是否存在
    var hasInfo = this._isHasThatOne(id, cartData);
    if (hasInfo.index != -1){
      if (hasInfo.data.counts >= 1){
        // 增加本件商品的数量
        cartData[hasInfo.index].counts += counts;
      }
    }
    // 更新缓存数据
    wx.setStorageSync(this._storageKeyName, cartData);
  }

  /**
   * 增加商品数量
   */
  addCounts(id){
    this._changeCounts(id, 1);
  }

  /**
   * 减少商品数量
   */
  cutCounts(id){
    this._changeCounts(id, -1);
  }

  /**
   * 删除缓存中数据
   * ids 为数组
   */
  delete(ids){
    if (!(ids instanceof Array)){
      ids = [ids];
    }
    var cartData = this.getCartDataFormLocal();
    for (let i = 0; i < ids.length; i++){
      var hasInfo = this._isHasThatOne(ids[i], cartData);
      if (hasInfo != -1){
        cartData.splice(hasInfo.index, 1);
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData);
  }

  execSetStorageSync(data){
    wx.setStorageSync(this._storageKeyName, data);
  }
}

export {Cart};