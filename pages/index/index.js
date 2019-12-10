const {
  api
} = require('../../utils/config.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    js_code: null,
    openid: null,
    sjusercode: "",
    isagree: true,
    platform: ""
  },
  //事件处理函数
  bindViewTap: function() {},

  onLoad: function(options) {
    var _this = this;
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.reLaunch({
        url: '../myapp/myapp',
      })
    } else {
      wx.getSystemInfo({
        success(res) {
          var platform = res.platform;
          wx.setStorage({
            key: 'platform',
            data: res.platform
          })
          if (platform != "ios") {
            _this.setData({
              isagree: false
            })
          }
        }
      })

      if (options.scene) {
        _this.setData({
          "sjusercode": options.scene
        })
      }
    }
  },
  getUserInfo: function(e) {

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    wx.showLoading({
      title: '登录中...',
      duration: 6000
    })
    this.getjscode();

  },
  getjscode: function() {
    var _this = this;
    wx.login({
      success: function(res) {
        console.info("获取JSCODE", res);
        if (res.code) {
          _this.setData({
            js_code: res.code
          });

          _this.login();
          //_this.getopenid();
        } else {
          wx.showToast({
            title: '获取用户登录态失败！' + res.errMsg,
            icon: 'none',
            duration: 1000
          })
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function() {
        wx.showToast({
          title: '登录失败，请重试！',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 登录
  login: function() {

    var _this = this;
    var para = {
      "sjusercode": this.data.sjusercode,
      "js_code": _this.data.js_code,
      "username": _this.data.userInfo.nickName
    };

    console.info("登录", para);
    wx.request({
      url: api.user_wx_login,
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
            key: 'loginuser',
            data: data.obj
          })

          wx.setStorage({
            key: 'userInfo',
            data: _this.data.userInfo
          })
          wx.reLaunch({
            url: '../myapp/myapp',
          })
        } else {
          wx.showToast({
            title: '获取数据失败，请重试！',
          })
        }

      }
    });
  },
  agree_click: function() {
    this.setData({
      isagree: true
    })
  }
})