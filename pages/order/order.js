// order.js
import { Cart } from '../cart/cart-model.js';
import { Address } from '../../util/address.js';
// import { Order } from 'order-model.js';

var cart = new Cart();
var address = new Address();
// var order = new Order();

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
  },

  /**
   * 编辑地址信息
   */
  editAddress: function (event){
    var that = this;
    wx.chooseAddress({
      success:function(res){
        var addressInfo ={
          'name': res.userName,
          'mobile': res.telNumber,
          'totalDetail': address.setAddressInfo(res)
        }

        that._bindAddressInfo(addressInfo);

        address.sumbitAddress(res, (flag) => {
          if (!flag){
            that.showTips('操作提示', '地址更新失败！');
          }
        });
      }
    });
  },

  /**
   * 绑定地址信息
   */
  _bindAddressInfo: function (addressInfo){
    this.setData({
      'addressInfo': addressInfo
    });
  },

  /**
   * 提示窗口
   */
  showTips: function(title, content, flag){
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res){
        if (flag){
          wx.switchTab({
            url: '/pages/my/my',
          });
        }
      }
    })
  }

})