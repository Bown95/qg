const {
  api
} = require('../../../utils/config.js')

const {
  formatTime
} = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    paperid: null,
    papername: "",
    poid: null,
    pomoney: 0, //订单金额
    userxnhb: 0, //用户虚拟币
    canusexnhb: 0, //可使用虚拟货币
    paymoney: 0, //需要支付的金额
    paynum: 0,
    checked: 0,
    payorder: "",
    createtime: "",
    loginuser: {},
    paydetail: {},
    timestr: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pomoney = options.pomoney;
    var userxnhb = options.userxnhb;
    var paynum = options.paynum;

    var canusexnhb = userxnhb;
    if (canusexnhb > pomoney) {
      canusexnhb = pomoney;
    }
    var paymoney = pomoney;
    if (this.data.checked) {
      paymoney = pomoney - canusexnhb;
    }
    var payorder = options.payorder
    var createtime = options.createtime
    var timestr = formatTime(new Date(options.createtime * 1000))
    this.setData({
      paperid: options.paperid,
      papername: options.papername,
      poid: options.poid,
      pomoney: pomoney,
      userxnhb: userxnhb,
      canusexnhb: canusexnhb,
      paymoney: paymoney,
      paynum: paynum,
      payorder: payorder,
      createtime: createtime,
      timestr: timestr
    });

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
  //开始支付
  paydetail: function() {
    wx.showLoading({
      title: '加载中...',
      duration: 6000
    })
    var _this = this;
    var openid = this.data.loginuser.userwx;
    var poid = this.data.poid;
    var isxnbh = this.data.checked ? 1 : 0;
    var paynum = this.data.paynum;

    //如果有免费体验次数  就进行免费体验
    if (paynum > 0) {
      isxnbh = 2;
    }
    var para = {
      "openid": openid,
      "poid": poid,
      "isxnbh": isxnbh
    };
    wx.request({
      url: api.uporder_createUnifiedOrder,
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
            paydetail: data.obj
          });
          if (data.obj.needpay == 1) {
            _this.wxpay();
          } else if (data.obj.needpay == 0) {
            _this.turnsuccess();
          }
        } else {
          wx.showToast({
            title: '获取数据失败，请重试！',
          })
        }

      }
    });
  },
  wxpay: function() {
    var _this = this;
    var nonce_str = this.data.paydetail.nonce_str;
    var packagestr = this.data.paydetail.package;
    var paySign = this.data.paydetail.sign;
    var timeStamp = this.data.paydetail.time_stamp;

    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonce_str,
      'package': packagestr,
      'signType': 'MD5',
      'paySign': paySign,
      'success': function(res) {
        _this.turnsuccess();
      },
      'fail': function(res) {

      }
    })
  },
  turnsuccess: function() {
    var _this = this;
    var paperid = _this.data.paperid;
    var canusexnhb = _this.data.canusexnhb;
    var paymoney = _this.data.paymoney;
    var checked = _this.data.checked;
    var payorder = _this.data.payorder;
    var createtime = _this.data.createtime;
    var paynum = _this.data.paynum;

    var para = {
      paperid: paperid,
      canusexnhb: canusexnhb, //可使用虚拟货币
      paymoney: paymoney, //需要支付的金额
      checked: checked,
      paynum: paynum,
      payorder: payorder,
      createtime: createtime
    }

    wx.redirectTo({
      url: '../xscpaysuccess/xscpaysuccess?' + api.getquerystr(para),
    })
  },
  payshow: function() {
    this.paydetail();
  },
  check_click: function() {
    this.setData({
      checked: !this.data.checked
    });
    var pomoney = this.data.pomoney;
    var userxnhb = this.data.userxnhb;
    var canusexnhb = userxnhb;
    if (canusexnhb > pomoney) {
      canusexnhb = pomoney;
    }
    var paymoney = pomoney;
    if (this.data.checked) {
      paymoney = pomoney - canusexnhb;
    }
    this.setData({
      pomoney: pomoney,
      userxnhb: userxnhb,
      canusexnhb: canusexnhb,
      paymoney: paymoney
    });
  }
})