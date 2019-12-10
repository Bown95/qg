const {
  api
} = require('../../../utils/config.js')
let chart = null;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    opts: {},
    paperid: null,
    paperuser: {},
    radardata: [],
    analyze: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      paperid: options.paperid
    });
    this.setData({
      opts: {
        onInit: this.initChart
      }
    });
  },
  getreport: function() {
    var _this = this;
    var paperid = this.data.paperid;
    var para = {
      "paperid": paperid
    };
    wx.request({
      url: api.paperanalyze_wx_useranalyze,
      data: api.getquerystr(para),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading()

        var data = res.data;
        var obj = data.obj;
        if (data.code == 0) {
          var analyze = data.obj.analyze;
          var paperuser = data.obj.paperuser;
          var radardata = [];
          for (var i = 0; i < analyze.length; i++) {
            var item = analyze[i];
            var lst = item.lst;
            if (lst) {
              for (var j = 0; j < lst.length; j++) {
                var item2 = lst[j];
                radardata.push({
                  name: item2.qtypename,
                  value: item2.userrate
                });
              }
            }
          }
          _this.setData({
            "radardata": radardata,
            "analyze": analyze,
            "paperuser": paperuser
          });

          _this.initChartData();

        } else {
          wx.showToast({
            title: '获取数据失败，请重试！',
          })
        }

      }
    });
  },

  initChartData: function() {
    const data = this.data.radardata;
    if (chart) {
      chart.changeData(data);
    }

  },

  initChart: function(canvas, width, height, F2) {
    chart = new F2.Chart({
      el: canvas,
      width,
      height
    });

    const data = this.data.radardata;

    chart.source(data, {
      value: {
        min: 0,
        max: 100
      }
    });
    chart.coord('polar');
    chart.tooltip(false); // 关闭 tooltip
    chart.axis('value', {
      grid: {
        lineDash: null
      },
      label: null,
      line: null
    });
    chart.axis('name', {
      grid: {
        lineDash: null
      }
    });
    chart.area()
      .position('name*value')
      .color('#FE5C5B')
      .style({
        fillOpacity: 0.2
      })
      .animate({
        appear: {
          animation: 'groupWaveIn'
        }
      });
    chart.line()
      .position('name*value')
      .color('#FE5C5B')
      .size(1)
      .animate({
        appear: {
          animation: 'groupWaveIn'
        }
      });
    chart.point().position('name*value').color('#FE5C5B').animate({
      appear: {
        delay: 300
      }
    });

    // chart.guide().text({
    //   position: ['50%', '50%'],
    //   content: '73',
    //   style: {
    //     fontSize: 32,
    //     fontWeight: 'bold',
    //     fill: '#FE5C5B'
    //   }
    // });
    chart.render();
    return chart;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    this.getreport();
  },
  //查看试卷详情
  show_action: function() {
    var _this = this;
    var para = {
      "paperid": _this.data.paperid
    };
    wx.showLoading({
      title: '加载中...',
      duration: 6000
    })
    wx.request({
      url: api.paperuser_paper_questions,
      data: api.getquerystr(para),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        var data = res.data;
        if (data.code == 0) {
          wx.setStorage({
            key: 'exampaper',
            data: data.obj
          })
          wx.navigateTo({
            url: '../xsctestdetail/xsctestdetail',
          })
        } else {
         
        }
      }
    });
  }
})