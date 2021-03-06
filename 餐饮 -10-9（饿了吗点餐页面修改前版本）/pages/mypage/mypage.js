//获取应用实例
var app = getApp();
var config = require("../../config.js");
Page({
  data: {
    path: config.resPath,
    api: config.apiPath,
    userInfo:'',
  },
  onShow: function () {
    var that = this;
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      logo: wx.getStorageSync('logo'),
      color:wx.getStorageSync('color')
    })      
  },
  distr:function(){
    wx.navigateTo({
      url: '../waimai/dzlb?from=my',
    })
  },
  goToMypage:function(){
    wx.navigateTo({
      url: '../shop/shop'
    })
  },
  goToYhj:function(){
    wx.navigateTo({
      url: '../mypage/yhj'
    })
  }
})
