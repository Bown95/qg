// pages/myapp/myapp.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loginuser: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    applist: [{
      "code": 0,
      "image": "/images/myapp/main_general_survey.png",
      "name": "小升初\n综合素养测评"
    }, {
      "code": 1,
      "image": "/images/myapp/main_development_quality.png",
      "name": "发展素质测评"
    }, {
      "code": 2,
      "image": "/images/myapp/main_thought_quality.png",
      "name": "思维品质测评"
    }, {
      "code": 3,
      "image": "/images/myapp/main_active_ability.png",
      "name": "行为能力测评"
    }, {
      "code": 4,
      "image": "/images/myapp/main_career.png",
      "name": "职业生涯测评"
    }, {
      "code": 5,
      "image": "/images/myapp/main_emotion_competency.png",
      "name": "情绪能力测评"
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    try {
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
        });
      }
    } catch (e) {

    }
    wx.showShareMenu({
      withShareTicket: true
    })
    
  },

  app_click: function(event) {
    //console.info(event);
    let code = event.currentTarget.dataset.item.code;
    let name = event.currentTarget.dataset.item.name;
    if (code == 0) {
      wx.navigateTo({
        url: '/packageA/pages/xsc/xsc'
      })
    } else {
      wx.showToast({
        title: "您没有这项权限",
        icon: "none"
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  onShareAppMessage: function() {
    var username = this.data.loginuser.username
    var usercode = this.data.loginuser.usercode
    return {
      title: '小升初择校的真谛',
      desc: '青鸽易学',
      path: '/pages/index/index?scene=' + usercode // 路径，传递参数到指定页面。
    }
  },
})