import { Token } from 'util/token.js';
/**
 * 应用程序相关的生命周期函数
 */
App({
  /**
   * 初始化执行的函数 校验令牌
   */
  onLaunch: function(){
    var token = new Token();
    token.verify();
  }
});