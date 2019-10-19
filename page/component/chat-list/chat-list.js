// page/component/chat-list/chat-list.js
let app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      //   {
      //   user_id: "11", //对方id
      //   gphoto: 'https://wx.qlogo.cn/mmopen/vi_32/njwaSUP5DiabKEr626aBGHEhibiaAEFLqungTIkqq4WibYRBXcWnCdwBDqbibsZBo67O3ic0O56ZLAUicyKg0RwJ08sSg/0', //对方头像
      //   last_time: '2018-011-01', //最后一条消息记录时间
      //   from: "ipad pro 灰色 128G 99新", //通过什么物品找来
      //   school: "华北电力大学",
      //   name: "陈某某"
      // }, {
      //   user_id: "11", //对方id
      //   gphoto: 'https://wx.qlogo.cn/mmopen/vi_32/njwaSUP5DiabKEr626aBGHEhibiaAEFLqungTIkqq4WibYRBXcWnCdwBDqbibsZBo67O3ic0O56ZLAUicyKg0RwJ08sSg/0', //对方头像
      //   last_time: '2018-09-01', //最后一条消息记录时间
      //   from: "ipad pro 灰色 128G 99新", //通过什么物品找来
      //   school: "华北电力大学",
      //   name: "陈某某"
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    _this.setData({
      list: wx.getStorageSync("chatList")
    })
    // this.setData({
    //   list:wx.getStorageSync("chatList")
    // })
    // this.getList()
  },
  getList() {
    var _this = this
    console.log("getList")
    var list_storage = wx.getStorageSync("chatList")
    var new_list
    wx.request({
      url: "https://www.schoolbuy.online:80/ws/getchatusersinfo",
      data: {
        user_id: app.globalData.userID
      },
      success(res) {
        new_list = res.data.list
        console.log(res)
        if (!res.data.list) {
          _this.setData({
            list: wx.getStorageSync("chatList")
          })
        } else {
          new_list.forEach((element, index) => { //以新换旧
            new_list[index].unread = 1;
            list_storage.forEach((elm, idx) => {
              // console.log(element.user_id +"vs"+elm.user_id)

              // console.log(elm,element)
              if (element.user_id == elm.user_id) { //已经有这条记录
                list_storage.splice(idx, 1)
                console.log(element.user_id + "vs" + elm.user_id)
              }
            })
          });
          for (var i = 0; i < new_list.length; i++) {
            list_storage.push(new_list[i])
          }
          list_storage.sort((a,b)=>{
            if(a.time>b.time){
              return -1
            }else{
              return 1
            }
          })
          wx.setStorage({
            key: 'chatList',
            data: list_storage,
            success: (result) => {
              _this.setData({
                list: list_storage
              })
            },

          });
        }
      },
      complete(res) {}
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this
    this.getList()
    var chatList=wx.getStorageSync("chatList")
    chatList.sort((a,b)=>{
      if(a.time>b.time){
        return -1
      }else{
        return 1
      }
    })
    _this.setData({
      list: chatList
    })
    wx.hideTabBarRedDot({
      index: 3,
    });
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
    var _this = this
    _this.setData({
      list: wx.getStorageSync("chatList")
    })
    wx.stopPullDownRefresh();

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

  },
  getUnread() {

  },
  interChat(e){
    console.log(e.currentTarget.dataset.userid)
    var chatList=wx.getStorageSync("chatList")
    chatList.forEach( (element,index) => {
      if(element.user_id==e.currentTarget.dataset.userid){
        chatList[index].unread=0
      }
    });
    wx.setStorage({
      key:"chatList",
      data:chatList
    })
    
  }
})