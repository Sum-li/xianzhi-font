const app = getApp();

App({
  globalData: {
    // url_path: "http://www.schoolbuy.online.:80/",
    // appid: 'wx9cfbc6a0999d6e12',
    // secret: '3407cf52445ca173899bb2d217b030df',
    category: [],
    userID: '',
    socketOpen: false,
    socketHadClose:false,
    haveUnread: false,
    certified: false //已认证
  },
  onLaunch: function () {
    console.log('App Launch')
    var _this = this

    wx.request({
      url: "https://schoolbuy.online:80/goods/category",
      data: {},
      method: 'GET',
      success: function (res) {
        _this.globalData.category = res.data;
        console.log(res)
      }
    });

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
      _this.globalData.socketHadClose = true
    })
  },
  onShow: function () {
    console.log('App Show')

    var userInfo=wx.getStorageSync("userInfo");
    if(this.globalData.socketOpen==true && this.globalData.socketHadClose==true){
      this.socketConn()
      this.socketOn()
    }
   
  },
  socketConn() {
    var _this = this
    var user_id = _this.globalData.userID
    wx.connectSocket({
      url: `wss://www.schoolbuy.online:800/ws?user_id=${user_id}`,
      success: function (res) {}
    });

    wx.onSocketOpen(function (res) {
      console.log("连接websocket服务器成功。" + res);
      _this.globalData.socketOpen = true
    });
  },
  socketOn() { //socket长连接   接受新消息
    var _this = this
    wx.onSocketMessage(function (res) {
      console.log('收到服务器发来消息：' + (res.data));
      if (res.data) { //代表有新消息发来
        _this.globalData.haveUnread = true
        wx.showTabBarRedDot({
          index: 3,
        });
      }
    });
  },
  onHide: function () {
    // wx.closeSocket({
    //   success:function(){
    //     console.log("close success")
    //   }
    // })

    console.log('App Hide')
  },



})