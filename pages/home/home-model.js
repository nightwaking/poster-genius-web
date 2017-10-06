import {Base} from '../../util/base.js'
// home-model.js
// 客户端的mvc

/**
 * 使用ES6 class关键字定义类
 */
class Home extends Base{
  constructor(){
    super();
  }
  /**
   * 获取banner数据
   */
  getBannerData(id, callback){
    var params = {
      url: 'banner/' + id,
      sCallback: function(res){
        // 判断左侧正确，右侧才能执行
        callback && callback(res.items);
      }
    };
    this.request(params);
  }

  getThemeData(callback){
    var params = {
      url: 'theme?ids=1,2,3' ,
      sCallback:function(data){
        callback && callback(data);
      }
    };
    this.request(params);
  }
}

export {Home};