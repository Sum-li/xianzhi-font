let app =  getApp();

  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    page_count:1,
    status:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    this.loadMore()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  loadMore(){
    var _this=this
    console.log("loadMore")
    wx.request({
      url: "https://www.schoolbuy.online:80/goods/havebuy",
      data: {
        user_id: app.globalData.userID,
        page_count:_this.data.page_count
      },
      success(res) {
        console.log(res)
        var orders=_this.data.orders
        var newgoods=res.data
        for(var i=0;i<newgoods.length;i++){
          orders.push(newgoods[i])
        }
        _this.setData({
          orders:orders,
          page_count:_this.data.page_count+1
        })
      }
    })
  },
  delOrders(){
    var _this=this
    wx.request({
      url: "https://www.schoolbuy.online:80/goods/",
      data: {
        user_id: app.globalData.userID,
      },
      success(res) {
      //  _this.fresh()
      }
    })
  },
  receive(e){
    var _this=this
    console.log(e.currentTarget.dataset)
    wx.request({
      url: "https://www.schoolbuy.online:80/logic/receive",
      data: {
        order_id:e.currentTarget.dataset.orderid
      },
      success(res) {
        console.log(res)
       _this.fresh()
      }
    })
  },
  fresh(){
    var _this=this
    console.log("fresh")
    wx.request({
      url: "https://www.schoolbuy.online:80/goods/havebuy",
      data: {
        user_id: app.globalData.userID,
        page_count:1
      },
      success(res) {
        console.log(res)
        _this.setData({
          orders:res.data,
          page_count:1
        })
      }
    })
  },
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})