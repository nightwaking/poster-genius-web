// home-model.js
// 客户端的mvc

/**
 * 使用ES6 class关键字定义类
 */
class Home{
  /**
   * 获取banner数据
   */
  getBannerData(){
    wx.request({
      url: 'http://www.wxservlet.com/api/v1/banner/#id',
      method: 'GET',
      // 定义回调函数, 异步
      success:function(res){
        return res;
      }
    })
  }
}