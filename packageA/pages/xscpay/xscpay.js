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
    papername: null,
    stoptime: null,
    timestr: "",
    loginuser: {},
    orderdetail: {},
    userInfo: {},
    platform: "",
    paynum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }

    const platform = wx.getStorageSync('platform')
    if (platform) {
      this.setData({
        platform: platform
      })
    }
    var timeStr = formatTime(new Date(options.stoptime * 1000))
    this.setData({
      paperid: options.paperid,
      papername: options.papername,
      stoptime: options.stoptime,
      timeStr: timeStr
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

    this.get_user_paynum();
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
            paynum: data.obj || 0
          });
        }
      }
    });

  },
  createorder: function(callback) {
    wx.showLoading({
      title: '加载中...',
      duration: 6000
    })
    var _this = this;
    var userid = this.data.loginuser.userid;
    var oid = this.data.loginuser.oid;
    var paperid = this.data.paperid;

    var currpage = this.data.currpage;
    var para = {
      "userid": userid,
      "oid": oid,
      "paperid": paperid
    };
    wx.request({
      url: api.uporder_createorder,
      data: api.getquerystr(para),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading()
        var data = res.data;

        if (data.code == 0) {
          data.obj.paynum = data.obj.paynum || 0;
          _this.setData({
            orderdetail: data.obj
          });
          callback();

        } else {
          wx.showToast({
            title: '获取数据失败，请重试！',
          })
        }

      }
    });
  },
  payshow: function() {
    var _this = this;
    var platform = _this.data.platform;
    var paynum = _this.data.paynum;
    if ((platform == "" || platform == "ios") && paynum == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '十分抱歉，由于相关规范，您暂时无法查看报告！',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      this.createorder(function() {
        var papername = _this.data.papername;
        var paperid = _this.data.paperid;
        var poid = _this.data.orderdetail.poid;
        var pomoney = _this.data.orderdetail.pomoney;
        var userxnhb = _this.data.orderdetail.userxnhb;
        var payorder = _this.data.orderdetail.payorder;
        var paynum = _this.data.orderdetail.paynum;
        var createtime = _this.data.stoptime;
        var queryPara = {
          paperid: paperid,
          poid: poid,
          pomoney: pomoney,
          userxnhb: userxnhb,
          payorder: payorder,
          createtime: createtime,
          papername: papername,
          paynum: paynum
        };
        wx.redirectTo({
          url: '../xscpayorder/xscpayorder?' + api.getquerystr(queryPara)
        })
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  }
})