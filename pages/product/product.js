// product.js
import { Product } from 'product-model.js';

var product = new Product();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    productCount: 1,
    tabBox: ['商品详情', '产品参数', '售后保障'],
    currentTabsIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.data.id = id;
    this._loadData();
  },
  
  _loadData: function(){
    product.getDetailInfo(this.data.id, (res) => {
      this.setData({
        'productArr': res
      });
    });
  },

  /**
   * 获取用户选择的数量，通过数组的下标获取
   */
  bindPickerChange: function(event){
    var index = event.detail.value;
    var selectedCount = this.data.countsArray[index];
    this.setData({
      'productCount': selectedCount
    })
  },

  /**
   * 获取选定的选项卡
   */
  onTabsItemTap: function(event){
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex:index
    })
  }
})