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
            for (var j = 0; j < item.options.length;j++){
              //替换选项中的空标签
              var opt = item.options[j];
              if (opt.optiontxt){
                opt.optiontxt = opt.optiontxt.replace(reg, "");
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
  
})