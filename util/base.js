import {Config} from 'config.js';
import {Token} from 'token.js';
/**
 * 请求基类
 */
class Base{
  constructor(){
    this.baseRequestUrl = 'http://www.liweilinxc.com:8280/applet-web/';
  }

  /**
   * 定义request方法,封装http请求
   * noRefetch　防止调用多次request, true时不做多次处理
   */
  request(params, noRefetch){
    var that = this;
    var url = this.baseRequestUrl + params.url;
    // 传入的params.type为空，设置为GET
    if(!params.type){
      params.type = 'GET'
    }
    wx.request({
      // 请求api的地址
      url: url,
      // post请求的body参数
      data: params.data,
      method: params.type,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success:function(res){
        // if (params.sCallBack){
        //   // 回调函数
        //   params.sCallBack(res);
        // }
        // 返回状态码
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar == '2'){
          params.sCallback && params.sCallback(res.data);
          //　请求成功，服务器内部错误
        }else{
          // 令牌不存在时
          if (code == '401'){
            // token.getTokenFromServer
            // base.request
            if (!noRefetch){
              that._refetch(params);
            }
          }
          if (noRefetch){
            params.eCallback && params.eCallback(res.data);
          }          
        }
      },
      // 请求不成功
      fail:function(err){

      }
    })
  }

  _refetch(params){
    var token = new Token();
    token.getTokenFromServer((token) =>{
      // 箭头 => 函数可以保证this的指向不发生改变
      this.request(params, true);
    })
  }

  /**
   * 获取元素上绑定的值
   */
  getDataSet(event, key){
    return event.currentTarget.dataset[key];
  };
}

export {Base};