var app = getApp()

Page({
  data: {
    imgUrls: [
      'http://www.schoolbuy.online:70/static/Poster/poster4.jpg',
      'http://www.schoolbuy.online:70/static/Poster/poster2.jpg',
      'http://www.schoolbuy.online:70/static/Poster/poster1.jpg',
      'http://www.schoolbuy.online:70/static/Poster/poster3.jpg',
    ],
    search_val: "",
    ortherBy: 0,
    page_count: 1,
    page_count_gd:1,
    certified: false,
    loading: false,
    autoplay: false,
    menu_direction: [0, 1, 0],
    good_list: [],
    active_gd_good_list:[],
    avavtar: "",
    noMore: false,
  },

  onLoad(options) {
    // 页面初次加载，请求第一页数据，并且判断是否用户已经授权，若为授权，则转到授权页面
    // this.loadMore(1) //请求第一页

    var _this = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!userInfo.nickName)) {
      console.log("没有授权公开信息 将转入授权页")
      wx.redirectTo({
        url: "accredit/accredit",
      })
    } else {
      _this.getUserId(); // 已经授权，通过后台获取我们的库中的userid
      setTimeout(() => {
        this.socketConn()
        this.socketOn()
        this.getList()
        this.getSold()
      }, 1000)
      this.data.avavtar = wx.getStorageSync("userInfo").avatarUrl
      this.loadMore() //请求第一页
    }

  },
  getUserId: function () {
    wx.login({
      success: function (res) {
        var userInfo = wx.getStorageSync("userInfo")
        if (res.code) {
          wx.request({
            url: "https://www.schoolbuy.online:80/user/id",
            data: {
              code: res.code,
              gphoto: userInfo.avatarUrl,
              user_name: userInfo.nickName
            },
            success(res) {
              console.log("获取userID：")
              console.log(res)
              app.globalData.userID = res.data.user_id
              app.globalData.certified = res.data.is_authentication
              console.log(app.globalData.certified)
            },
            fail(res) {

            },
            complete(res) {
              console.log(res)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  bindsearch(e) {
    this.setData({
      search_val: e.detail.value
    })
  },
  onReachBottom() {
    var _this = this
    console.log("到底了")

    if(this.data.ortherBy==0){
      this.loadMore()
    }else{
      this.loadMore('gd')
    }
  },
  loadMore(choose) { //上拉加载
    var _this = this;
    _this.setData({
      loading: true
    })

    if (choose) {
      if (choose == "gd") {
        this.festvialGd()
      }
    } else {
      console.log("没有gd")
      wx.request({
        url: 'https://www.schoolbuy.online:80/goods/index',
        method: "get",
        data: {
          page_count: _this.data.page_count
        },
        success: function (res) {
           console.log(res)
           var new_goods = res.data;
           var good_list = _this.data.good_list
           if (new_goods.length == 0) {
             _this.setData({
               noMore: true
             })
             return
           }
           new_goods.forEach(element => {
             good_list.push(element)
           });
           _this.setData({
             good_list: good_list,
             page_count: _this.data.page_count + 1,
             loading: false
           })
        },
        fail: function (res) {
          console.log("加载请求失败：" + JSON.stringify(res))
        },
        complete(res) {
         
        }
      })
    }
  },
  menuClick(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      ortherBy: index,
      // page_count:1
    })
    if (index == 1 && this.data.page_count_gd==1) {  //第一次加载
      this.loadMore('gd')
    } 
    // else if (index == 0) {
    //   this.onPullDownRefresh()
    // }
  },
  festvialGd() {
    var _this = this
    
    console.log("page_count_gd:"+ _this.data.page_count_gd)
    _this.setData({
      page_count_gd: _this.data.page_count_gd + 1,
    })
    wx.request({
      url: 'https://www.schoolbuy.online:80/goods/active',
      method: "get",
      data: {
        page_count: _this.data.page_count_gd-1,
        active:'gd'
      },
      success: function (res) {
        console.log(res)
        var new_goods = res.data;
        var good_list = _this.data.active_gd_good_list
        if (new_goods.length == 0) {
          _this.setData({
            noMore: true
          })
          return
        }
        new_goods.forEach(element => {
          good_list.push(element)
        });
        _this.setData({
          active_gd_good_list: good_list,
          // page_count_gd: _this.data.page_count_gd + 1,
          loading: false
        })
      },
      complete(res) {
        // console.log("request complete")
       
      }
    })
  },
  socketConn() {
    var _this = this
    var user_id = app.globalData.userID
    console.log(user_id)
    wx.connectSocket({
      url: `wss://www.schoolbuy.online:800/ws?user_id=${user_id}`,
      success: function (res) {}
    });

    wx.onSocketOpen(function (res) {
      console.log("连接websocket服务器成功。" + res);
      app.globalData.socketOpen = true
    });
    console.log(user_id)

  },
  getUnread() {
    wx.request({
      url: "https://schollbuy.online:80/ws/isnotread",
      data: {
        user_id: app.globalData.userID
      },
      success(res) {
        if (res.data.yes == 1) { //有未读消息

        } else { //无未读消息

        }
      }
    })
  },
  getSold(){
    var _this=this;
    
    wx.request({
      url:"https://www.schoolbuy.online:80/logic/goodstips",
      data:{
        user_id:app.globalData.userID
      },
      success(res){
        console.log("getSold")
        console.log(res)
        if(res.data.unread==true){
          wx.showModal({
            title: '有东西卖出啦~',
            content: '点击‘去看看’前往查看',
            showCancel: true,
            cancelText: '先不看',
            cancelColor: '#000000',
            confirmText: '去看看',
            confirmColor: '#3CC51F',
            success: (result) => {
              if (result.confirm) {
                wx.navigateTo({
                  url:"cart3/cart3",
                  data:{
                    user_id:app.globalData.userID
                  }
                })
              }
            },
            fail: () => {},
            complete: () => {}
          });
            
        }
      }
    })
  },
  socketOn() { //socket长连接   接受新消息
    var _this = this
    wx.onSocketMessage(function (res) {
      console.log('index的osocket on 收到服务器发来消息：' + (res.data));
      console.log(JSON.parse(res.data).send_id)
      var data = JSON.parse(res.data)
      if (res.data) { //代表有新消息发来

      }
      app.globalData.haveUnread = true
      wx.showTabBarRedDot({
        index: 3,
      });
      wx.request({
        url: "https://schoolbuy.online:80/ws/getchatuserinfo",
        data: {
          send_id: data.send_id
        },
        success(ress) {
          console.log(ress)
          var signal = 0
          var indexx = 0;
          var chatList = wx.getStorageSync("chatList")
          chatList.forEach((element, index) => {
            // console.log(element.user_id + "vs" + ress.data.send_id)
            if (element.user_id == data.send_id) {
              signal = 1
              indexx = index
            }
          });
          console.log("signal:" + signal)
          if (signal == 0) { //说明是新的消息记录
            var new_item = {
              user_id: data.send_id, //对方id
              gphoto: ress.data.gphoto, //对方头像
              time: Date.parse(new Date()), //最后一条消息记录时间
              from: "", //通过什么物品找来
              school: ress.data.school,
              name: ress.data.name,
              unread:1
            }
            chatList.push(new_item)
          } else {
            var new_item = chatList[indexx]
            new_item.unread=1
            new_item.time = Date.parse(new Date())
            chatList[indexx] = new_item
          }

          wx.setStorage({
            key: "chatList",
            data: chatList
          })

        }

      })
    });
  },
  onPullDownRefresh() {
    var _this = this
    this.setData({
      page_count: 1,
      good_list: []
    })
    this.loadMore()
    wx.stopPullDownRefresh();
  },
  search() {
    var _this = this
    wx.navigateTo({
      url: `list/list?key=${_this.data.search_val}`,
      success: (res) => {},
    });
  },
  getList() {  //获取未读的消息列表
    var _this = this
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
          console.log("没有新的未读消息")
        } else {
          wx.showTabBarRedDot({
            index: 3,
          });
          new_list.forEach((element, index) => {  //以新换旧
            new_list[index].unread=1;
            list_storage.forEach((elm, idx) => {
              // console.log(elm,element)
              // console.log(element.user_id + "vs" + elm.user_id)

              if (element.user_id == elm.user_id) { //已经有这条记录
                list_storage.splice(idx, 1)
                console.log(element.user_id + "vs" + elm.user_id)
              }
            })
          });
          for (var i = 0; i < new_list.length; i++) {
            new_list[i].time=Date.parse(new_list[i].time)
            list_storage.push(new_list[i])
          }
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

})