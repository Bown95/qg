const {
  api
} = require('../../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginuser: {},
    paynum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    try {
      const loginuser = wx.getStorageSync('loginuser')
      if (loginuser) {
        this.setData({
          loginuser: loginuser
        });
      }
    } catch (e) {

    }

    
  },
  get_user_paynum: function() {
    var _this = this;
    var para = {
      "userid": _this.data.loginuser.userid
    };

    wx.request({
      url: api.user_user_paynum,
      data: api.getquerystr(para),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading()
        var data = res.data;
        if (data.code == 0) {
          _this.setData({
            paynum: data.obj||0
          });
        }
      }
    });

  },

  begin_test: function() {
    var _this = this;
    var para = {
      "userid": _this.data.loginuser.userid,
      "oid": _this.data.loginuser.oid,
      "usertype": 3
    };
    wx.showLoading({
      title: '加载中...',
      duration: 6000
    })
    wx.request({
      url: api.paperuser_wx_savepaper,
      data: api.getquerystr(para),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading()
        var data = res.data;
        if (data.code == 0) {
          wx.setStorage({
            key: 'exampaper',
            data: data.obj
          })
          wx.navigateTo({
            url: '../xsctest/xsctest',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: data.msg,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../xschistory/xschistory',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onShow:function(){
    this.get_user_paynum();
  }
})