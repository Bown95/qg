const api = {};
api.getquerystr = function(data){
  var querystrarr = [];
  for (var key in data) {
    querystrarr.push(key + "=" + data[key]);
  }
  return querystrarr.join("&");
}
api.filebaseurl ="https://file.xhkjedu.com/static/";
api.baseurl = "https://qgapi.xhkjedu.com/";
// api.baseurl = "https://qgapitest.xhkjedu.com/";
// api.baseurl = "http://192.168.3.165:8896/";
api.user_wx_login = api.baseurl + "user/wx_login";
api.paperuser_wx_savepaper = api.baseurl + "paperuser/wx_savepaper";
api.paperuser_commitquestion = api.baseurl + "paperuser/commitquestion";
//3.6用户提交试卷
api.paperuser_commitpaper = api.baseurl + "paperuser/commitpaper";

//3.9 获取用户测评历史分页列表
api.paperuser_paper_user = api.baseurl + "paperuser/paper_user";

//3.7 获取试卷中试题以及用户作答
api.paperuser_paper_questions = api.baseurl + "paperuser/paper_questions";

//3.8 试卷分析报告
api.paperanalyze_wx_useranalyze = api.baseurl + "paperanalyze/wx_useranalyze";


//3.12 系统生成本地订单
api.uporder_createorder = api.baseurl + "uporder/createorder";


//3.10 微信统一下单
api.uporder_createUnifiedOrder = api.baseurl + "uporder/createUnifiedOrder";

//3.11 获取用户虚拟币消费记录
api.userpayhb_userpayhb_history = api.baseurl + "userpayhb/userpayhb_history";

//3.14 获取用户拥有虚拟货币
api.user_userxnhb = api.baseurl + "user/userxnhb";

//3.16 保存提现信息
api.mptx_savetx = api.baseurl + "mptx/savetx";

//3.17 用户设置手机号
api.user_user_phone = api.baseurl + "user/user_phone";


//3.20 手机号验证码
api.usercode_rtn_code = api.baseurl + "usercode/rtn_code";

//3.3 获取用户详细信息
api.user_getuser = api.baseurl + "user/getuser";


//3.21 获取用户免费支付次数
api.user_user_paynum = api.baseurl + "user/user_paynum";

module.exports = { api }