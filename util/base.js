import {Config} from 'config.js';
/**
 * 请求基类
 */
class Base{
  constructor(){
    this.baseRequestUrl = Config.restUrl;
  }

  /**
   * 定义request方法,封装http请求
   */
  request(params){
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
        params.sCallBack && params.sCallBack(res.data);
      },
      fail:function(err){

      }
    })
  }
}

export {Base};