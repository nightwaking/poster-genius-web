// my.js
import {My} from '../my/my-model.js';
import {Address} from '../../util/address.js'
import {Order} from '../order/order-model.js'

var my = new My();
var order = new Order();
var address = new Address();

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
    this._loadData();
  },

  /**
   * 获取用户信息
   */
  _loadData:function(){
    my.getUserInfo((data)=>{
      this.setData({
        userInfo: data
      });
    });
  }

})