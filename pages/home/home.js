// home.js
import {Home} from 'home-model.js';

var home = new Home();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  onLoad:function(){
    this._loadData();
  },

  _loadData:function(){
    var id = 1;
    // 将回调函数作为参数传入，获取异步调用结果
    home.getBannerData(id, (res) => {
      // 数据绑定
      this.setData({
        'bannerArr': res
      });
    });
    
    home.getThemeData((res) => {
      this.setData({
        'themeArr': res
      });
    });

    home.getProductsData((res) => {
      this.setData({
        'prodcutsArr': res
      });
    });
  },

  /**
   * 跳转商品详情页面
   */
  onProductsItemTap:function(event){
    var id = home.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    });
  },

  /**
   * 主题详情页面
   */
  onThemesItemTap: function (event) {
    var id = home.getDataSet(event, 'id');
    var name = home.getDataSet(event, 'name');
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name' + name
    });
  }

  // 回调函数的另一种方式
  // callBack:function(res){
  //   console.log(res);
  // }

})

