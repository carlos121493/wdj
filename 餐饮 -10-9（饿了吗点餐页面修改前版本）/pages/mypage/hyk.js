// pages/mypage/hyk.js
var config = require("../../config.js");
Page({
  data:{
    path: config.resPath,
    api: config.apiPath,
    obj:'',
  },
  onLoad:function(){
    var that=this;
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    that.setData({
      color: wx.getStorageSync('color')
    })  
    config.post("/wxApi/u/info", {}, function (ret) {
      if (ret.code == 0) {
        console.log(ret);
        that.setData({
          obj: ret.data
        })
      } 
    },true);
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})