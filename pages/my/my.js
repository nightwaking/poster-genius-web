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

  onShow: function(){
    var newOrderFlag = order.hasNewOrder();
    if (newOrderFlag){
      this.refresh();
    }    
  },

  /**
   * 订单生成后重新加载数据
   */
  refresh: function(){
    var that = this;
    this.data.orderArr = [];
    this._getOrders(() =>{
      that.data.isLoadedAll = false;
      that.data.pageIndex = 1;
      order.execSetStorageSync(false);
    });
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
  _getOrders:function(callback){
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
      callback && callback();
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
  },

  showOrderDetailInfo: function(event){
    var id = order.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id,
    })
  },

  /**
   * 在我的页面进行支付
   */
  rePay: function(event){
    var id = order.getDataSet(event, 'id');
    // 订单列表中的下标
    var index = order.getDataSet(event, 'index');
    this._execPay(id, index);
  },

  /**
   * 执行支付
   */
  _execPay: function(id, index){
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode > 0){
        var flag = statusCode == 2;
        // 更新订单状态
        if (flag){
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr: that.data.orderArr
          });
        }

        // 跳转到成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my',
        });
      }else{
        that.showTips('支付失败', '商品库存不足');
      }
    })
  },

  showTips: function(title, content){
    wx.showModal({
      title:title,
      content: content,
      showCancel: false,
      success: function(res){

      }
    })
  }
})