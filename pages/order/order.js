// order.js
import { Cart } from '../cart/cart-model.js';

var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var productsArr;
    this.data.account = options.account; 
    // 选中的商品信息
    productsArr = cart.getCartDataFormLocal(true);
    this.setData({
      'productsArr': productsArr,
      'account': options.account,
      orderStatus: 0
    });
  }

})