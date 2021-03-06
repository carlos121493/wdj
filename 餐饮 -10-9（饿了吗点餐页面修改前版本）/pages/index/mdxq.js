var config = require("../../config.js");
var WxParse = require('../../wxParse/wxParse.js')
Page({
    data: {
        resPath: config.resPath,
        api: config.apiPath,
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1200,
        path:{},
        obj:'',
        imgs:'',
        id:'',
        loading:true
    },
    onLoad: function (options){
      var that=this;
      var id =options.id;
      //首页按钮名称
      var alias = wx.getStorageSync('alias');
      if (alias){
        that.setData({ alias: alias});
      }
      if (options.deskId){
        that.setData({
          deskId: options.deskId,
          storeId: options.storeId
        })
      }
      if (!wx.getStorageSync('color')) {
        wx.setStorageSync('color', 'blue');
      }
      config.navBarColor(wx.getStorageSync('color'));
      that.setData({
        color: wx.getStorageSync('color')
      })
      wx.setStorageSync('sid',id);  
      //技术支持图标
      var supportImg = wx.getStorageSync('supportImg');
      if (supportImg){
        that.setData({
          supportImg:supportImg
        })
      }
      //门店详情数据    
      config.post('wxApi/s/info',{id:id},function(ret){
        console.log(ret);
        that.data.obj = ret.data;
        that.setData({
          obj: that.data.obj,
          logo:wx.getStorageSync('logo'),
          btnPd:ret.data.btnPd,
          btnYd: ret.data.btnYd,
          btnDc: ret.data.btnDc,
          btnWm: ret.data.btnWm
        })
        if (ret.code == 0) {
          that.data.imgs = ret.data.imgs.split(",");
          that.setData({
            imgs: that.data.imgs
          })
        }      
        if (that.data.obj.remark == '') {
          return;
        }
        WxParse.wxParse('remark', 'html', that.data.obj.remark, that, 5);   
        setTimeout(function () {
          that.setData({
            loading: false
          })
        }, 500) 
      },true);   
        that.getYh(id);
     },  
    getYh:function(id){
      var that=this;
      //优惠券
      config.post('wxApi/coupon/store', { id:id},function(ret){
        console.log(ret);
        if(ret.code==0){
          that.setData({
            couponList:ret.data
          })
        }
      },true)
    },
     phone:function(){
       wx.makePhoneCall({
         phoneNumber: this.data.obj.phone
       })
     },
     goyd:function(){
       wx.redirectTo({
         url:'../index/ydwz',
       })
     },
     loaction:function(e){
       var obj=e.currentTarget.dataset.data;
       wx.openLocation({
         latitude:Number(obj.lat),
         longitude: Number(obj.lng),
         name:obj.title,
         address:obj.address,
       })
     },
    //右上角转发
     onShareAppMessage: function (res) {
     },
     goYd:function(){
       wx.navigateTo({
         url: '../index/ydwz',
       })
     },
     goDc: function () {
       var deskId=this.data.deskId;
       var storeId = this.data.storeId;
       if (this.data.obj.id == storeId){
         wx.navigateTo({
           url: '../shop/shop?deskId='+deskId,
         })
       }else{
         wx.navigateTo({
           url: '../shop/shop',
         })
       }       
     },
     goPd: function () {
       wx.navigateTo({
         url: '../index/mdxz',
       })
     },
     goWm: function () {
       wx.redirectTo({
         url: '../shop/shop?isWm=1',
       })
     },
     get:function(){
       wx.navigateTo({
         url: '../mypage/qyhq',
       })
     }
})
