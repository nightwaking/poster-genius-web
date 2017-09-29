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
  getBannerData(id, callBack){
    var params = {
      url: 'banner/' + id,
      sCallBack: function(res){
        // 判断左侧正确，右侧才能执行
        callBack && callBack(res.items);
      }
    };
    this.request(params);
  }
}

export {Home};