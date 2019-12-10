const {
  api
} = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgimage: "/images/share/share_bg.png",
    loginuser: {},
    userInfo: {},
    hasUserInfo: false
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

    this.createImage();
  },
  createImage: function() {
    let _this = this;
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#shareCanvas').boundingClientRect()
    query.exec(function(res) {
      var width = res[0].width;
      var height = res[0].height;
      var radio = 1.0 * width / 750;

      // 创建画布
      const ctx = wx.createCanvasContext('shareCanvas')
      // 白色背景

      //绘制背景
      ctx.setFillStyle('#ff0000')
      ctx.fillRect(0, 0, ctx.width, ctx.height)
      ctx.draw()
      ctx.drawImage(_this.data.bgimage, 0, 0, 750, 1100, 0, 0, width, height)
      ctx.draw(true)



      //绘制用户名字
      var nickName = _this.data.userInfo.nickName
      ctx.fillStyle = "#ffffff";        //设置填充颜色为紫色
      ctx.font = '14px "微软雅黑"';  //设置字体
      ctx.textBaseline = 'top';      //设置字体底线对齐绘制基线        
      ctx.textAlign = "center";   //设置字体对齐的方式
      var txtwidth = ctx.measureText(nickName).width;       
      ctx.fillText(nickName, 365 * radio, 202 * radio);     //填充文字

      //绘制用户头像
      wx.getImageInfo({
        src: _this.data.userInfo.avatarUrl,
        success: (res2) => {

          ctx.drawImage(
            res2.path, 0, 0, res2.width, res2.height,
            302 * radio, 30 * radio, 140 * radio, 140 * radio
          )
          ctx.draw(true)

          //绘制二维码
          var imageurl = api.filebaseurl + _this.data.loginuser.userwxpath;
          wx.getImageInfo({
            src: imageurl,
            success: (res4) => {
              var cli = {
                x: 204 * radio + 340 * radio / 2,
                y: 622 * radio + 340 * radio / 2,
                r: 340 * radio / 2
              }
              ctx.beginPath()
              ctx.arc(cli.x, cli.y, cli.r, 0, Math.PI * 2, false)
              ctx.clip()
              ctx.drawImage(
                res4.path, 0, 0, res4.width, res4.height,
                204 * radio, 622 * radio, 340 * radio, 340 * radio
              )
              ctx.draw(true)
            }
          })
        }
      })

    })

  },
  downloadImg: function() {
    var _this = this;
    // 保存到相册
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            wx.showToast({
              title: '分享图片已保存到相册,快去分享到朋友圈吧！',
              icon:"none"
            })
          }
        })
      }
    }, this)
  },
  saveqrcode:function(){
    var _this = this;
    wx.downloadFile({
      url: api.filebaseurl + _this.data.loginuser.userwxpath,
      success(res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (res) {
              wx.hideToast()
            }
          })
        }
      }
    })
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