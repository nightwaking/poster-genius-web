import { Base } from '../../util/base.js';

class Theme extends Base{
  constructor(){
    super();
  }

  /**
   * 获取主题下的商品列表
   * @param id　对应主题的id
   */
  getProductsData(id, callback){
    var params = {
      url: 'theme/' + id,
      sCallback: function(res){
        callback && callback(res);
      }
    };
    this.request(params);
  }
}
export {Theme};