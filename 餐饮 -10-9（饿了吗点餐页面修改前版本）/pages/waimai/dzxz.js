// pages/waimai/dzxz.js
var config = require("../../config.js");
var QQMapWX = require("../../qqmap-wx-jssdk.min.js");
var qqmapsdk;
Page({
  data: {
    path: config.resPath,
    api: config.apiPath,
    address:'',
    sele:'1',
    state:'0',
    next:true,
    setick:false,
    cShow:false,
    info: { name: '', sex: '', phone: '', address: '', lat: '', lng: '', isDefault: '0', remark:''},
    loading:true
  },
  onShow:function(){
    if (!wx.getStorageSync('color')) {
      wx.setStorageSync('color', 'blue');
    }
    config.navBarColor(wx.getStorageSync('color'));
    this.setData({
      next:true,
      color: wx.getStorageSync('color')
    })
  },
  onLoad: function (options) {
    var that=this;
    qqmapsdk = new QQMapWX({
      key: 'YWZBZ-5MFCP-WRSDO-LAWMH-GFZRT-WUFST'
    });
    that.setData({
      state: options.state
    })
    if (that.data.state==1){
      var info = wx.getStorageSync('dzinfo');
      that.locat(info.address);
      that.data.info.address = info.address;
      that.data.info.isDefault = info.isDefault;
      that.data.info.lat = info.lat;
      that.data.info.lng = info.lng;
      that.data.info.sex = info.sex;
      that.data.info.name = info.name;
      that.data.info.phone = info.phone;
      that.data.info.remark = info.remark;
      that.data.info.id=info.id;
      that.setData({
        info: that.data.info,
        setick:info.isDefault
      })
    }else{
      that.locat(wx.getStorageSync('address'));
      that.data.info.address = wx.getStorageSync('address');
      that.data.info.lat = wx.getStorageSync('lat');
      that.data.info.lng = wx.getStorageSync('lng');
      that.data.info.sex = that.data.sele;
      that.setData({
        info: that.data.info,
        mraddress: wx.getStorageSync('address')
      })
    }
    setTimeout(function () {
      that.setData({
        loading: false
      })
    }, 500)
  },
  locat:function(val){
    var that=this;
    qqmapsdk.getSuggestion({
      keyword: val,
      region: wx.getStorageSync('city'),
      success: function (res) {
        that.setData({
          address: res.data,
        })
      },
    });
  },
  search:function(e){
    var val=e.detail.value;
    this.locat(val);
  },
  sele:function(e){
    var se = e.currentTarget.dataset.se;
    this.data.info.sex = se;
    this.setData({
      sele:se,
      info:this.data.info
    })
  },
  setick:function(){
    this.setData({
      setick: !this.data.setick
    })
    if (this.data.setick==true){
      this.data.info.isDefault = 1;
      this.setData({
        info: this.data.info
      })
    }else{
      this.data.info.isDefault = 0;
      this.setData({
        info: this.data.info
      })
    }    
  },
  choose:function(){
    this.setData({
      cShow:true
    })
  },
  xzbak:function(){
    this.setData({
      cShow:false
    })
  },
  name:function(e){
    this.data.info.name = e.detail.value;
    this.setData({
      info: this.data.info,
    })
  },
  phone:function(e){
    this.data.info.phone = e.detail.value;
    this.setData({
      info: this.data.info,
    })
  },
  chosdd:function(e){
    var add = e.currentTarget.dataset.add;
    this.data.info.address = add.address;
    this.data.info.lat = add.location.lat;
    this.data.info.lng = add.location.lng;
    this.setData({
      info:this.data.info,
      cShow:false,
      mraddress: this.data.info.address
    })
  },
  remark:function(e){
    this.data.info.remark = e.detail.value;
    this.setData({
      info:this.data.info
    })
  },
  sub:function(){
    var that = this;
    if (that.data.state == 1) {
      if (that.data.info.name == '') {
        config.tost('请输入姓名！')
      } else if (that.data.info.phone == '') {
        config.tost('请输入联系方式！');
      } else if (config.isphone(that.data.info.phone) == '2') {
        wx.showToast({
          title: '手机号码不正确！',
          icon: 'success',
          duration: 1000
        })
      }
      else if (that.data.info.remark == '') {
        config.tost('请输入门牌号！')
      } else {
        config.post('wxApi/addr/save', that.data.info, function (ret) {
          that.setData({
            next:false
          })
          if (ret.code == 0) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    } else {
      if (that.data.info.name == '') {
        config.tost('请输入姓名！')
      } else if (that.data.info.phone == '') {
        config.tost('请输入联系方式！');
      } else if (config.isphone(that.data.info.phone) == '2') {
        wx.showToast({
          title: '手机号码不正确！',
          icon: 'success',
          duration: 1000
        })
      }
      else if (that.data.info.remark == '') {
        config.tost('请输入门牌号！')
      } else {
        config.post('wxApi/addr/save', that.data.info, function (ret) {
          if (ret.code == 0) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    }
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
  del:function(){
    var that=this;
    config.post('wxApi/addr/del',{id:that.data.info.id},function(ret){
      wx.removeStorage({
        key: 'wmaddr',
      })
      if(ret.code==0){
        wx.navigateBack({
          delta:1
        })
      }
    })
  }
})