// page/component/new-pages/user/user.js
let app =  getApp();

  
Page({
  data:{
    thumb:'',
    nickname:'',
    orders:[],
    hasAddress:false,
    address:{},
    curIndex: 6,

  },
  onLoad(){
    var self = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function(res){
        console.log(res)
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    })

    console.log(app.globalData)
    
  },
  onShow(){
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
  },
  /**
   * 发起支付请求
   */
  
  test(){
    wx.closeSocket()
  },




  dealBarChange(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var target=e.currentTarget.dataset.type;
    var url="../"+target+"/"+target
    console.log(target)
    wx.navigateTo({
      url:url
    })    
    // this.setData({
    //   curIndex: index
    // })
  },orderSign: function (e) {
    console.log(e.detail)
    var fId = e.detail.formId;
    console.log(fId)
    var fObj = e.detail.value;
    var l = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + "22_5GM_MP-Cb___MfOjlXp9lv8T9jFQgYCNiPCB2CaZTYNQToap8K1ItUrmppOaA4cWbOOFbGjKxizEyoCb-W8Q-1_nRI23VD6n4wPDS-jjmzeaGRWZ3jrp0htU5X9WqwfecGvix5TiZm_wv6S8LVKeAIAEOD";
    var d = {
      touser: wx.getStorageSync('user').openid,
      template_id: 'gwS0SXz94EsTBGIeaAquoBhgcAxboiwdlqePPUWL_Aw',//这个是1、申请的模板消息id，
      page: '../user',
      form_id: fId,
      // data: {

      //   "keyword1": {
      //     "value": fObj.product,
      //     "color": "#4a4a4a"
      //   },
      //   "keyword2": {
      //     "value": fObj.detail,
      //     "color": "#9b9b9b"
      //   },
      //   "keyword3": {
      //     "value": new Date().getDate(),
      //     "color": "#9b9b9b"
      //   },
      //   "keyword4": {
      //     "value": "201612130909",
      //     "color": "#9b9b9b"
      //   },
      //   "keyword5": {
      //     "value": "$300",
      //     "color": "red"
      //   }
      // },
      // color: '#ccc',
      // emphasis_keyword: 'keyword1.DATA'
    } 
    setTimeout(()=>{
      wx.request({
        url: l,
        data: d,
        method: 'POST',
        success: function(res){
          console.log("push msg");
          console.log(res);
        },
        fail: function(err) {
          // fail
          console.log("push err")
          console.log(err);
        }
      })
    },1000)
   
    ;
  }
  
})