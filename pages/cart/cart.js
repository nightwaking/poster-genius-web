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
    var cal = this._calcTotalAccountAndCounts(cartData);
    
    this.setData({
      'selectedCounts': cal.selectedCounts,
      'cartData': cartData,
      'selectedTypeCount': cal.selectTypeCounts,
      'account': cal.account
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
      if (data[i].selectStatus){
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
  },

  /**
  * 单选按钮
  */
  toggleSelect:function(event){
    var id = cart.getDataSet(event, 'id');
    var status = cart.getDataSet(event, 'status');
    var index = this._getProductIndexById(id);
    this.data.cartData[index].selectStatus = !status;
    this._restCartData();
  },
  
  /**
   * 多选按钮
   */
  toggleSelectAll:function(event){

  },

  /**
   * 根据id获取商品index下标
   */
  _getProductIndexById: function(id){
    var data = this.data.cartData;
    var len = data.length;
    for (let i = 0 ; i < len; i++){
      if (data[i].id == id){
        return i;
      }
    }
  },

  /**
   * 计算选中商品的总金额
   * 改变选中状态
   */
  _restCartData:function(){
    var newData = this._calcTotalAccountAndCounts(this.data.cartData);
    this.setData({
      'account': newData.account,
      'selectedCounts': newData.selectedCount,
      'selectedTypeCount': newData.selectedTypeCounts,
      'cartData': this.data.cartData
    });
  }
})