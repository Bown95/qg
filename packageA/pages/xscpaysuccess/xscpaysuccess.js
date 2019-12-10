
const {
  formatTime
} = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    paperid: null,
    canusexnhb: 0, //可使用虚拟货币
    paymoney: 0, //需要支付的金额
    checked: 0,
    paynum:0,
    payorder: "",
    createtime: null,
    timestr:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var timestr = formatTime(new Date())
    this.setData({
      paperid: options.paperid,
      canusexnhb: options.canusexnhb, 
      paymoney: options.paymoney,
      checked: options.checked,
      paynum: options.paynum,
      payorder: options.payorder,
      createtime: options.createtime,
      timestr: timestr
    });
  },

  showreport: function() {
    var paperid = this.data.paperid;
    wx.redirectTo({
      url: '../xscreport/xscreport?paperid=' + paperid,
    })
    
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

  }
})