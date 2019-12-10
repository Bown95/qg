const {
  api
} = require('../../utils/config.js')

const {
  formatTime
} = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginuser: {},
    currpage: 1,
    hislist: [],
    userxnb: 0
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

  gethistory: function(isrefresh) {
    wx.showLoading({
      title: '加载中...',
      duration: 6000
    })
    if (isrefresh) {
      this.setData({
        currpage: 1
      });
    } else {
      this.setData({
        currpage: this.data.currpage + 1
      });
    }
    var _this = this;
    var userid = this.data.loginuser.userid;
    var currpage = this.data.currpage;
    var para = {
      "userid": userid,
      "currpage": currpage
    };
    wx.request({
      url: api.userpayhb_userpayhb_history,
      data: api.getquerystr(para),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading()

        wx.stopPullDownRefresh();

        var data = res.data;

        if (data.code == 0) {
          var obj = data.obj;
          for (var i = 0; i < obj.length; i++) {
            var item = obj[i];
            item["time"] = formatTime(new Date(item.cztime * 1000))
          }
          if (isrefresh) {
            _this.setData({
              hislist: data.obj
            });
          } else {
            var hislist = _this.data.hislist;
            hislist = hislist.concat(data.obj)
            _this.setData({
              hislist: hislist
            });
          }
        } else {
          wx.showToast({
            title: '获取数据失败，请重试！',
          })
        }

      }
    });
  },

  getuserxnb: function() {
    // wx.showLoading({
    //   title: '加载中...',
    // })

    var _this = this;
    var userid = this.data.loginuser.userid;
    var para = {
      "userid": userid
    };
    wx.request({
      url: api.user_userxnhb,
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
            userxnb: data.obj
          });
        } else {
          wx.showToast({
            title: '获取数据失败，请重试！',
          })
        }

      }
    });
  },
  tixian_action: function() {
    var userxnb = this.data.userxnb;
    if (userxnb < 2000) {
      wx.showToast({
        title: '成长值满20才能提现！',
        icon: "none"
      })
    } else {
      wx.navigateTo({
        url: '../tixian/tixian?userxnb=' + userxnb,
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.gethistory(true);
    this.getuserxnb();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.gethistory(true);
    this.getuserxnb();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.gethistory(false);
  }
})