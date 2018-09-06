// home.js
import {
  Home
} from 'home-model.js';

var home = new Home();

// 商品数组
var prodcuts = [{
    id: 11,
    main_img_url: '/imgs/test/fangbianmian.jpg',
    name: '方便面',
    price: 3.5
  },
  {
    id: 12,
    main_img_url: '/imgs/test/test.jpg',
    name: '沙琪玛',
    price: 2
  },
  {
    id: 13,
    main_img_url: '/imgs/test/huotui.jpg',
    name: '火腿肠',
    price: 2.5
  },
  {
    id: 14,
    main_img_url: '/imgs/test/shupian.jpg',
    name: '薯片',
    price: 6
  },
  {
    id: 15,
    main_img_url: '/imgs/test/xiyifen.jpg',
    name: '洗衣粉',
    price: 10
  },
  {
    id: 16,
    main_img_url: '/imgs/test/guo.jpg',
    name: '炒锅',
    price: 80
  },
  {
    id: 17,
    main_img_url: '/imgs/test/ciwan.jpg',
    name: '瓷碗',
    price: 25
  }
];

// 图片数组
var images = [{
    id: 1,
    name: '方便面',
    img_url: '/imgs/test/fangbianmian.jpg'
  },
  {
    id: 2,
    name: '方便面',
    img_url: '/imgs/test/fangbianmian.jpg'
  },
  {
    id: 3,
    name: '方便面',
    img_url: '/imgs/test/fangbianmian.jpg'
  },
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    'prodcutsArr': prodcuts,
    productId: '',
    hidden: true,
    nocancel: false,
    prurl: '',
    canvasHidden: true
  },

  onLoad: function() {
    this._loadData();
    this.getView();
  },

  _loadData: function() {
    this.setData({
      'prodcutsArr': prodcuts
    });
  },

  /**
   * 扫码添加商品
   */
  scanViewTap: function(event) {
    wx.scanCode({
      scanType: new Array('qrCode', 'barCode'),
      success: (res) => {
        wx.showLoading({});
        prodcuts.push({
          id: 18,
          main_img_url: '/imgs/test/beizi.jpg',
          name: '杯子',
          price: 25
        });
        console.log(prodcuts);
        this._loadData();
        setTimeout(function() {
          wx.hideLoading()
        }, 2000)
      }
    })
  },

  onProductsItemTap: function(event) {
    var id = home.getDataSet(event, 'id');
    var product = prodcuts.filter(l => l.id == id)[0];
    var img_arr = images.filter(i => i.name == product.name);
    this.setData({
      'imgArr': img_arr,
      'product': product,
      hidden: false
    })
  },

  cancel: function() {
    this.setData({
      hidden: true
    });
  },

  radioChange: function(event) {
    this.setData({
      imgId: event.detail.value
    });
  },

  inputName: function(event) {
    this.setData({
      productName: event.detail.value
    });
  },

  inputPrice: function(event) {
    this.setData({
      productPrice: event.detail.value
    })
  },

  confirm: function(event) {
    this.setData({
      hidden: true
    })
  },

  /**
   * 生成海报
   */
  share: function() {
    var that = this
    wx.showLoading({
      title: '努力生成中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 545,
      height: 780,
      destWidth: 545,
      destHeight: 780,
      canvasId: 'shareImg',
      success: function(res) {
        console.log(res.tempFilePath);
        that.setData({
          prurl: res.tempFilePath,
          canvasHidden: false
        })
        wx.hideLoading()
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  /**
   * 保存到相册
   */
  save: function() {
    var that = this
    //需要获取相册授权
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#72B9C3',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                canvasHidden: true
              })
            }
          }
        })
      }
    })
  },

  html2canvas: function() {
    // 获取页面img

  },

  getView: function() {
    // 获取所有图片基本信息
    var query = wx.createSelectorQuery();
    var that = this;
    //主要就是计算好各个图文的位置
    var ctx = wx.createCanvasContext('shareImg')
    query.selectAll('.products-item > .products-image').boundingClientRect(function(rects) {
      that.autoMakeImage(ctx, rects)
      ctx.stroke()
      ctx.draw()
    }).exec();
  },


  /**
   * 绘制海报图片
   */
  autoMakeImage: function (ctx, rects) {
    let i = 0;
    rects.forEach(function(res) {
      ctx.drawImage(prodcuts[i].main_img_url, res.left * 1.2, res.top * 1.1, res.width * 1.5, res.height * 1.5)
      ctx.drawImage('/imgs/test/background.jpg', res.left * 1.2 + 110, res.top * 1.1 + 140, 120, 45)
      ctx.setFontSize(30);
      ctx.fillStyle = "#fff";
      ctx.fillText('￥' + prodcuts[i].price + '元', res.left * 1.2 + 120, res.top * 1.1 + 175);
      i++;
    })
  }
})