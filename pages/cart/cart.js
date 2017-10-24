// cart.js
import { Cart } from 'cart-model.js';

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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var cartData = cart.getCartDataFormLocal();
    var countsInfo = cart.getCartTotalCounts(true);

    this.setData({
      'selectedCounts': countsInfo,
      'cartData': cartData,

    });
  },

  /**
   * 选中商品总金额
   */
  _calcTotalAccountAndCounts:function(data){
    var len = data.length;
    // 需要计算的选中商品总价格
    var account = 0;
    //　选中商品总数
    var selectedCounts = 0;
    // 选中商品种类总数
    var selectedTypeCounts = 0;
    // 避免浮点数运算误差
    let multiple = 100;
    for (let i = 0; i < len; i++){
      if (data[i].selectedStatus){
        account += data[i].counts * multiple * Number(data[i].price) * multiple;
        selectedCounts += data[i].counts;
        selectedTypeCounts ++;
      }
    }

    return {
      'selectedCounts': selectedCounts,
      'selectTypeCounts': selectedTypeCounts,
      'account': account / (multiple * multiple)
    }
  }
})