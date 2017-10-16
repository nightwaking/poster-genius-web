import { Base } from '../../util/base.js'

class Category extends Base{
  constructor(){
    super();
  }

  /**
   * 获取所有分类
   */
  getCategoryType(callback){
    var param = {
      url: 'category/all',
      sCallback: function(res){
        callback && callback(res);
      }
    };
    this.request(param);
  };

  /**
   * 根据分类id获取具体商品
   */
  getProudctsByCategory(id, callback){
    var param = {
      url: 'product/by_category?id=' + id,
      sCallback:function(res){
        callback && callback(res);
      }
    };
    this.request(param);
  }

}

export {Category};