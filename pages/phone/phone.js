const {
  api
} = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginuser: {},
    phone: "",
    valicode: "",
    truecode: "",
    pass1: "",
    pass2: "",
    timesec: 60,
    iscountdown: false
  },
  phone_input: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  valicode_input: function(e) {
    this.setData({
      valicode: e.detail.value
    })
  },
  pass1_input: function(e) {
    this.setData({
      pass1: e.detail.value
    })
  },
  pass2_input: function(e) {
    this.setData({
      pass2: e.detail.value
    })
  },
  // 获取手机验证码
  getvalicode_action() {
    var _this = this;
    var phone = this.data.phone;
    if (!(/^1\d{10}$/.test(phone))) {
      wx.showToast({
        title: '手机号输入有误！',
        icon: "none"
      })
      return;
    }
    if (_this.data.iscountdown){
      return;
    }

    var time_interval = setInterval(function () {
      var timesec = _this.data.timesec;
      var iscountdown = _this.data.iscountdown;
      if (timesec > 0 && iscountdown) {
        _this.setData({
          timesec: timesec - 1
        });
      } else {
        _this.setData({
          timesec: 60,
          iscountdown: false
        });
        clearInterval(time_interval);
      }
    }, 1000);

    var para = {
      "userphone": phone
    };
    wx.request({
      url: api.usercode_rtn_code,
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
            truecode: data.obj,
            iscountdown: true
          });
          wx.showToast({
            title: '获取验证码成功！',
            icon:"none"
          })
        
        } else {
          wx.showToast({
            title: data.msg,
            icon: "none"
          })
        }
      }
    });
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  bindphone_click: function() {
    var phone = this.data.phone;
    var valicode = this.data.valicode;
    var truecode = this.data.truecode;
    var pass1 = this.data.pass1;
    var pass2 = this.data.pass2;

    if (!(/^1\d{10}$/.test(phone))) {
      wx.showToast({
        title: '手机号输入有误！',
        icon: "none"
      })
      return;
    }

    if (valicode == "") {
      wx.showToast({
        title: '验证码不能为空！',
        icon: "none"
      })
      return;
    }

    if (valicode != truecode) {
      wx.showToast({
        title: '验证码输入有误！',
        icon: "none"
      })
      return;
    }

    if (pass1 == "") {
      wx.showToast({
        title: '密码不能为空！',
        icon: "none"
      })
      return;
    }

    if (pass2 == "") {
      wx.showToast({
        title: '确认密码不能为空！',
        icon: "none"
      })
      return;
    }

    if (pass1 != pass2) {
      wx.showToast({
        title: '两次密码输入不一致！',
        icon: "none"
      })
      return;
    }
    var userid = this.data.loginuser.userid;
    var para = {
      "userid": userid,
      "userphone": phone,
      "password": pass1,
      "phonecode": valicode
    };
    wx.request({
      url: api.user_user_phone,
      data: api.getquerystr(para),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading()
        var data = res.data;

        if (data.code == 0) {
          wx.showModal({
            title: '提示',
            showCancel: false, 
            content: '用户手机号绑定成功！',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: data.msg,
            icon: "none"
          })
        }

      }
    });

  }
})