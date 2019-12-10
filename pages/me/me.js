const {
  api
} = require('../../utils/config.js')

Page({
  data: {
    loginuser: {},
    userInfo: {},
    hasUserInfo: false,
    showwx: false,
    hasbindphone:true,
    namelist: [{
        img: "../../images/me/leftlogo1.png",
        name: "历史记录",
        code: 0
      },
      {
        img: "../../images/me/leftlogo2.png",
        name: "我的收益",
        code: 1
      },
      {
        img: "../../images/me/leftlogo3.png",
        name: "分享二维码",
        code: 2
      },
      {
        img: "../../images/me/leftlogo4.png",
        name: "绑定手机号",
        code: 3
      },
      {
        img: "../../images/me/leftlogo99.png",
        name: "退出",
        code: 99
      }
    ]
  },
  showwx_action: function() {
    this.setData({
      showwx: !this.data.showwx
    })
  },
  copy_action:function(){
    wx.setClipboardData({
      data: this.data.loginuser.userwx,
      success(res) {
        //wx.hideToast(); //隐藏复制成功的弹窗提示,根据需求可选
      }
    })
  },
  onLoad: function(options) {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }

    const loginuser = wx.getStorageSync('loginuser')
    if (loginuser) {
      this.setData({
        loginuser: loginuser
      })
    }

    

  },
  onShow:function(){
    this.getuserdetail();
  },
  getuserdetail:function(){
    var _this = this;
    var userid = this.data.loginuser.userid;
    var para = {
      "userid": userid
    };
    wx.request({
      url: api.user_getuser,
      data: api.getquerystr(para),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        var data = res.data;

        if (data.code == 0) {
          _this.setData({
            loginuser: data.obj
          });
          wx.setStorage({
            key: 'loginuser',
            data: data.obj
          })
          if (data.obj.userphone){
            _this.setData({
              hasbindphone:true
            });
          }else{
            _this.setData({
              hasbindphone: false
            });
          }
        } else {
          wx.showToast({
            title: data.msg,
            icon: "none"
          })
        }

      }
    });
  },
  itemclick: function(event) {
    let code = event.currentTarget.dataset.code;
    if (code == 0) {
      wx.navigateTo({
        url: '/packageA/pages/xschistory/xschistory',
      })
    } else if (code == 1) {
      wx.navigateTo({
        url: '../income/income',
      })
    } else if (code == 2) {
      wx.navigateTo({
        url: '../share/share',
      })
    } else if (code == 3) {
      wx.navigateTo({
        url: '../phone/phone',
      })
    } else if (code == 99) {
      wx.showModal({
        title: '提示',
        content: "确认要退出登录吗？",
        success(res) {
          if (res.confirm) {
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('loginuser');
              wx.reLaunch({
                url: '../index/index',
              })
            } catch (e) {

            }
          } else if (res.cancel) {

          }
        }
      })


    }
  }
})