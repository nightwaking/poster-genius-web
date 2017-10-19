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
  getCartDataFormLocal(){
    var res = wx.getStorageSync(this._storageKeyName);
    if (!res){
      res = []
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
}

export {Cart};