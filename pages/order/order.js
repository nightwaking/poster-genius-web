// order.js
import { Cart } from '../cart/cart-model.js';
import { Address } from '../../util/address.js';
import { Order } from 'order-model.js';

var cart = new Cart();
var address = new Address();
var order = new Order();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null
  },

  /**
   * 更新商品详情
   */
  onShow:function(){
    if (this.data.id){
      this._fromOrder(this.data.id);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var from = options.from;
    if (from == 'cart'){
      this._fromCart(options.account);
    }else{
      this._fromOrder(options.id);
    }
  },

  /**
   * 购物车中加载数据
   */
  _fromCart:function(account){
    var productsArr;
    this.data.account = account;
    // 选中的商品信息
    productsArr = cart.getCartDataFormLocal(true);
    this.setData({
      'productsArr': productsArr,
      'account': account,
      'orderStatus': 0
    });

    //　显示用户地址信息
    address.getAddress((res) => {
      this._bindAddressInfo(res);
    });
  },

  /**
   * 从数据库中加载数据
   */
  _fromOrder: function(id){
    if (id) {
      var that = this;
      console.log(id);
      // 加载数据库中的订单信息
      order.getOrderInfoById(id, (data) => {
        console.log(data.snap_items);
        that.setData({
          orderStatus: data.status,
          productsArr: data.snap_items,
          account: data.total_price,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no
          },
        });

        // 快照地址
        var addressInfo = data.snap_address;
        // 拼和地址信息
        addressInfo.totalDetail = address.setAddressInfo(addressInfo);
        that._bindAddressInfo(addressInfo);
      });
    }
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
   * 下单和付款
   */
  pay:function(){
    if(!this.data.addressInfo){
      this.showTips('下单提示', '请填写您的收货地址');
      return;
    }
    // 判断订单状态
    if (this.data.orderStatus == 0){
      // 第一次生成订单再发起支付
      this._firstTimePay();
    }else{
      this._oneMoresTimePay();
    }
  },

  /**
   * 第一次支付
   */
  _firstTimePay: function(){
    var orderInfo = [],
        productInfo = this.data.productsArr,
        order = new Order();
    for (let i = 0; i < productInfo.length; i++){
      orderInfo.push({
        product_id: productInfo[i].id,
        count: productInfo[i].counts
      });
    }

    var that = this;
    // 生成订单
    order.doOrder(orderInfo, (data) => {
      // 订单生成成功
      console.log(data);
      if(data.pass){
        var id = data.order_id;
        that.data.id = id;
        that.data.fromCartFlag = false;
        // 执行支付方法
        that._execPay(id);
      }else{
        // 下单失败
        that._orderFail(data);
      }
    });
  },

  /**
   * 支付
   */
   _execPay:function(id){
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode != 0){
        // 将以下单的物品从购物车中删除
        that.deleteProducts();
        var falg = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + falg + '&from=order'
        });
      }
    });
   },

   /**
    * 把下单后的商品删除
    */
   deleteProducts: function(){
     var ids = [],
         arr = this.data.productsArr;
     for (let i = 0; i < arr.length; i++){
       ids.push(arr[i].id);
     }
     cart.delete(ids);
   },

   /**
    * 下单失败 缺货的结果信息
    */
   _orderFail: function(data){
      var nameArr = [],
        name = '',
        str = '',
        pArr = data.pStatusArray;
      for (let i = 0; i < pArr.length; i++){
        if (!pArr[i].haveStock){
          name = pArr[i].name;
          if (name.length > 15){
            name = name.substr(0, 12) + '...';
          }
          nameArr.push(name);
          if (nameArr.length >= 2){
            break;
          }
        }
      }
      str += nameArr.join('.');
      if (nameArr.length > 2){
        str += '等';
      }
      str += '缺货';
      wx.showModal({
        title: '下单失败',
        content: str,
        showCancel: false,
        success: function(res){

        }
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