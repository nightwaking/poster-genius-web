import { Base } from '../../util/base.js'

class My extends Base{
    constructor(){
      super();
    }

    /**
     * 获取用户信息
     */
    getUserInfo(callback){
      var that = this;
      wx.login({
        success: function(){
          wx.getUserInfo({
            success: function(res){
              typeof callback == 'function' && callback(res.userInfo);
            },
            fail: function (res){
              typeof callback == 'function' && callback({
                avatarUrl:'../../imgs/icon/user@default.png',
                nickName: '微信小程序'
              });
            }
          });
        },
      });
    }
}

export {My}