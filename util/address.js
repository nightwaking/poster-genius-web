import { Base } from 'base.js';
import { Config } from 'config.js';

class Address extends Base{
  constructor(){
    super();
  }

  /**
   * 拼接地址
   */
  setAddressInfo(res){
    var province = res.provinceName || res.province,
        city = res.cityName || res.city,
        country = res.countyName || res.country,
        detail = res.detailInfo || res.detail;
    var totalDetail = city + country + detail;

    if (!this.isCenterCity(province)){
      totalDetail = province + totalDetail; 
    }

    return totalDetail;
  }

  /**
   * 判断是否为直辖市
   */
  isCenterCity(name){
    var centerCitys = ['北京市', '天津市', '上海市', '重庆市'];
    var flag = centerCitys.indexOf(name) >= 0;
    return flag;  
  }

}

export { Address } 