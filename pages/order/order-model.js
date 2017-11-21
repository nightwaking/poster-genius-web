import { Base } from '../../util/base.js'

class Order extends Base{
    constructor(){
      super();
      this._storageKeyName = 'newOrder';
    }

    /**
     * 生成订单
     */
    doOrder(param, callback){
      var that = this;
      var allParams = {
        url: 'order',
        type: 'post',
        data:{
          products: param
        },
        sCallback: function(data){
          // 下单成功设置订单状态
          that.execSetStorageSync(true);
          callback && callback(data);
        },
        eCallback: function(){

        }
      };
      this.request(allParams);
    }

    /**
     * 支付
     */
    execPay(orderNumber, callback){
      var allParams = {
        url: 'pay/pre_order',
        type: 'post',
        data:{
          id: orderNumber
        },
        sCallback:function(data){
          var timeStamp = data.timeStamp;
          // 包含服务器中返回的数据，开始支付
          if (timeStamp){
            wx.requestPayment({
              'timeStamp': timeStamp.toString(),
              'nonceStr': data.nonceStr,
              'package': data.signType,
              'signType': data.signType,
              'paySign': data.paySign,
              success:function(){
                callback && callback(2);
              },
              // 由于微信返回原因
              fail:function(){
                callback && callback(1);
              }
            });
          }else{
            // 由于服务器端的原因
            callback && callback(0);
          }
        }
      };
      this.request(allParams);
    }

    /**
     * 更新缓存
     */
    execSetStorageSync(data){
      wx.setStorageSync(this._storageKeyName, data)
    }

    /**
     * 获取订单详情
     */
    getOrderInfoById(id, callback){
      var that = this;
      var allParams = {
        url: 'order/' + id,
        sCallback: function(data){
          callback && callback(data);
        },
        eCallback: function(){

        }
      };
      this.request(allParams);
    }
}

export {Order};