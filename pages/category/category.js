// category.js
import {Category} from 'category-model.js';

var category = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5'],
    currentIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  /**
   * 页面初始化的函数
   */
  _loadData: function () {
    category.getCategoryType((categoryData) => {
      this.setData({
        'categoryTypeArr': categoryData
      });
      
      /**
       * 获取category为1的所有商品
       * categoryData为异步返回数据，可能会加载不到
       * 放在回调函数中
       */
      category.getProudctsByCategory(categoryData[0].id, (data) => {
        var dataObject = {
          products: data,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name
        };

        this.setData({
          'categoryInfo0': dataObject
        })
      });
    });
  },

  /**
   * 切换分类
   */
  changeCategory: function(event){
    var id = category.getDataSet(event, 'id');
    var index = category.getDataSet(event, 'index');
    this.setData({
      'currentIndex': index
    });
    // 第一次加载数据
    if (!this.isLoadedData(index)){
      category.getProudctsByCategory(id, (data) => {
        this.setData(
          this.getDataObjForBind(index, data)
        );
      });
    }
  },

  /**
   * 对是否为第一次加载数据进行判断
   */
  isLoadedData:function(index){
    if (this.data['categoryInfo' + index]){
      return true;
    }
    return false;
  },

  /**
   * 根据传入的index获取商品详情信息
   */
  getDataObjForBind: function(index, data){
    var obj = {};
    var arr = [0, 1, 2, 3, 4, 5];
    var baseData = this.data.categoryTypeArr[index];
    for (var item in arr){
      if (item == arr[index]){
        obj['categoryInfo' + item] = {
          products: data,
          topImgUrl: baseData.img.url,
          title: baseData.name
        };
        return obj;
      }
    }
  },

  /**
   * 跳转到商品详情
   */
  onProductsItemTap: function (event) {
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },
})