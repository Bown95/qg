const {
  watch,
  computed
} = require('../../../utils/vuefy.js')

const {
  api
} = require('../../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginuser: {},
    chararr: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"],
    queslist: [],
    curr_ques:{},
    paperinfo: {},
    curr: 0,
    isshowcard: false
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

      const exampaper = wx.getStorageSync('exampaper')
      if (exampaper) {
        if (exampaper.paperuser) {
          this.setData({
            paperinfo: exampaper.paperuser
          });
        }

        if (exampaper.questions) {
          var reg = /<p><br\/>\<\/p>/ig;
          for (var i = 0; i < exampaper.questions.length; i++) {
            var item = exampaper.questions[i];
            if (item.answers){
              item["select_opt"] = item.answers;
            }else{
              item["select_opt"] = "";
            }
            
            item.questionstem = item.questionstem.replace(reg, "");
            item.questionstem = item.questionstem.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
            for (var j = 0; j < item.options.length;j++){
              //替换选项中的空标签
              var opt = item.options[j];
              if (opt.optiontxt){
                opt.optiontxt = opt.optiontxt.replace(reg, "");
                opt.optiontxt = opt.optiontxt.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
              }
            }
          }
          this.setData({
            queslist: exampaper.questions
          });
        }

      }
    } catch (e) {

    }
    computed(this, {
      curr_ques: function() {
        if (this.data.curr<this.data.queslist.length){
          return this.data.queslist[this.data.curr]
        }else{
          return {}
        }
      }
    })
  },

  ans_sheet_click: function() {
    this.setData({
      isshowcard: !this.data.isshowcard
    })
  },

  ques_num_click: function(event) {
    let index = event.currentTarget.dataset.index;
    this.setData({
      curr: index,
      isshowcard: !this.data.isshowcard
    })
  },

  opt_item_click: function(event) {
    var _this = this;
    let select_opt = event.currentTarget.dataset.select_opt;
    var curr_ques = this.data.curr_ques;
    var queslist = this.data.queslist;
    queslist[this.data.curr].select_opt = select_opt;

    this.setData({
      queslist: queslist
    })

    this.sumit_ques_action(function(){
      _this.next_ques_click();
    });
  },
  sumit_ques_action: function(callback) {
    var _this = this;
    var paperid = this.data.paperinfo.paperid;
    var questionid = this.data.curr_ques.questionid;
    var answer = this.data.curr_ques.select_opt;
    var optiontype = this.data.curr_ques.optiontype;
    var para = {
      "paperid": paperid,
      "questionid": questionid,
      "answer": answer,
      "optiontype": optiontype
    };
    wx.request({
      url: api.paperuser_commitquestion,
      data: api.getquerystr(para),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading()
        //console.info(res.data);
        var data = res.data;
        if (data.code == 0) {
          // wx.showToast({
          //   title: '提交成功！',
          // })

          callback();

        } else {
          wx.showToast({
            title: '获取数据失败，请重试！',
          })
        }

      }
    });
  },
  last_ques_click: function() {
    var _this = this;
    if (this.data.curr > 0) {
      _this.setData({
        curr: _this.data.curr - 1
      })
    }
  },
  next_ques_click: function() {
    var _this = this;
    if (this.data.curr < this.data.queslist.length - 1) {
      _this.setData({
        curr: _this.data.curr + 1
      })
    }
  },
  submit_ques_click: function() {
    this.setData({
      isshowcard: !this.data.isshowcard
    })
  },
  return_click: function() {
    this.setData({
      isshowcard: !this.data.isshowcard
    })
  },
  // 提交
  submit_click: function() {
    var _this = this;
    wx.showModal({
      title: '提交',
      content: '确定要提交吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.submit_action()
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  submit_action:function(){
    var _this = this;
    var paperid = this.data.paperinfo.paperid;
    var userid = this.data.loginuser.userid;
    var oid = this.data.loginuser.oid;
    var para = {
      "paperid": paperid,
      "userid": userid,
      "oid": oid
    };
    wx.request({
      url: api.paperuser_commitpaper,
      data: api.getquerystr(para),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        console.info(res.data);
        var data = res.data;
        if (data.code == 0) {

          var para = {
            paperid: paperid,
            papername: data.obj.papername,
            stoptime: data.obj.stoptime
          }
          wx.showToast({
            title: '提交试卷成功！',
            duration:2500,
            success:function(){
              wx.redirectTo({
                url: '../xscpay/xscpay?' + api.getquerystr(para)
              })
            }
          })
        } else {
          wx.showToast({
            title: '获取数据失败，请重试！',
          })
        }

      }
    });
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