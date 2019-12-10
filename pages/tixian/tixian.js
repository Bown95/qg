const {
  api
} = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginuser: {},
    userxnb: 0,
    jine: "",
    name: "",
    cardnum: "",
    bankname: "",
    phone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.userxnb) {
      this.setData({
        userxnb: options.userxnb
      });
    }
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
  jine_input: function(e) {
    this.setData({
      jine: e.detail.value
    })
  },
  name_input: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  cardnum_input: function(e) {
    this.setData({
      cardnum: e.detail.value
    })
  },
  bankname_input: function(e) {
    this.setData({
      bankname: e.detail.value
    })
  },
  phone_input: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  tixian_click: function() {
    var _this = this;
    var jine = this.data.jine;
    var name = this.data.name;
    var cardnum = this.data.cardnum;
    var bankname = this.data.bankname;
    var userxnb = this.data.userxnb;
    var phone = this.data.phone;
    if (jine == "") {
      wx.showToast({
        title: '金额不能为空',
        icon: "none"
      })
    } else if (jine * 100 < 2000) {
      wx.showToast({
        title: '金额未满20,无法提现！',
        icon: "none"
      })
    } else if (jine * 100 > userxnb) {
      wx.showToast({
        title: '账户金额不足,无法提现！',
        icon: "none"
      })
    } else if (name == "") {
      wx.showToast({
        title: '名称不能为空',
        icon: "none"
      })
    } else if (cardnum == "") {
      wx.showToast({
        title: '卡号不能为空',
        icon: "none"
      })
    } else if (bankname == "") {
      wx.showToast({
        title: '开户行不能为空',
        icon: "none"
      })
    } else if (!(/^1\d{10}$/.test(phone))) {
      wx.showToast({
        title: '手机号输入有误！',
        icon: "none"
      })
    } else {
      console.info(this.data);

      wx.showLoading({
        title: '加载中...',
        duration: 6000
      })

      var userid = this.data.loginuser.userid;
      var txcard = this.data.cardnum;
      var txcardaddr = this.data.bankname;
      var txusername = this.data.name;
      var txnum = this.data.jine * 100;
      var para = {
        "userid": userid,
        "txcard": txcard,
        "txcardaddr": txcardaddr,
        "txusername": txusername,
        "txnum": txnum,
        "txphone":phone
      };
      wx.request({
        url: api.mptx_savetx,
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
              showCancel: false, //是否显示取消按钮-----》false去掉取消按钮
              cancelText: "否", //默认是“取消”
              content: '申请提现成功，5个工作日内到账，请注意查收',
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
  }
})