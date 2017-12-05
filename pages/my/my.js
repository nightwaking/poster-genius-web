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
    pageIndex:1,
    orderArr: [],
    isLoadAll:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
    this._getAddressInfo();
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

    this._getOrders();
  },

  /**
   * 获取用户地址信息
   */
  _getAddressInfo(){
    address.getAddress((addressInfo) => {
      this._bindAddressInfo(addressInfo);
    });
  },

  /**
   * 绑定地址信息
   */
  _bindAddressInfo: function(addressInfo){
    this.setData({
      addressInfo: addressInfo
    });
  },

  /**
   * 获取订单列表
   */
  _getOrders:function(){
    order.getOrders(this.data.pageIndex, (res)=>{
      var data = res.data;
      if (data.length > 0){
        // 合并两个数组
        this.data.orderArr.push.apply(this.data.orderArr,data);
        this.setData({
          orderArr: this.data.orderArr
        });
      }else{
        this.data.isLoadAll = true;
      }
      
    });
  },

  /**
   * 页面下拉事件，加载订单
   */
  onReachBottom: function(){
    if (!this.data.isLoadAll){
      this.data.pageIndex++;
      this._getOrders();
    }
  }

})