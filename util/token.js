import { Config } from 'config.js';

class Token{
  constructor(){
    this.tokenUrl = Config.restUrl + 'token/user';
    this.verifyUrl = Config.restUrl + 'token/verify'
  }

  /**
   * 检验令牌是否有效
   */
  verify(){
    var token = wx.getStorageSync('token');
    // token不存在从服务器中获取
    if (!token){
      this.getTokenFromSever();
    // 已存在验证是否有效
    }else{
      this._verifyFromServer(token);
    }
  }

  /**
   * 获取token令牌
   */
  getTokenFromServer(callBack){
    var that = this;
    wx.login({
      // 登录成功
      success: function(res){
        wx.request({
          url: that.tokenUrl,
          method: 'POST',
          data:{
            code: res.code
          },
          // request返回成功
          success: function (res){
            wx.setStorageSync('token', res.data.token);
            callBack && callBack(res.data.token);
          }
        })
      }
    });
  }

  /**
   * 校验令牌
   */
  _verifyFromServer(token){
    var that = this;
    wx.request({
      url: that.verifyUrl,
      method: 'POST',
      data:{
        token: token
      },
      success:function(res){
        var valid = res.data.isValidate;
        if (!valid){
          that.getTokenFromServer();
        }
      }
    })
  }
}

export {Token};