// page/component/list/list.js
Page({
  data:{
    detail:[],
    key:"",
    cate:"",
    loading:false,
    noMore:false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      key:options.key,
      cate:options.key
    })
    this.fresh()
  },
  fresh(){
    var _this=this
    wx.request({
      url: 'https://www.schoolbuy.online:80/logic/search',
      data: {
        q:_this.data.key
      },
      success: (res) => {
        console.log(res)
        _this.setData({
          detail:res.data
        })
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  receive(){

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})