import { Base } from '../../util/base.js';

class Product extends Base{
  constructor(){
    super();
  }

  /**
   * 获取商品详情信息
   */
   getDetailInfo(id, callback){
     var param = {
       url: 'product/' + id,
       sCallback: function(res){
         callback && callback(res);
       }
     };
     this.request(param);
   }
}

export { Product };