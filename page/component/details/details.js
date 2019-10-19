// page/component/details/details.js
let app = getApp();

Page({
  data: {
    goods: {
      id: 1,
      images: [],
      title: '',
      price: 0,
      gphoto: '',
      detail: '',
      // parameter: '125g/个',
      service: '',
      isbuy: false
    },
    user: {
      user_id: "1",
      user_name: '',
      user_school: "",
      sell_count: "",
      avavtar: ""
    },
    isnotCart: true,
    is_buy: true,
    num: 1,
    good_id: "",
    totalNum: 0,
    isMyself: false,
    hasCarts: false,
    // curIndex: 0,
    show: false,
    scaleCart: false
  },
  onLoad(options) {
    console.log(options)
    var _this = this;
    this.setData({
      good_id: options.good_id
    })

    this.fresh()
  },
  fresh() {
    var _this = this
    wx.request({
      url: `https://www.schoolbuy.online:80/goods/detail`,
      data: {
        user_id: app.globalData.userID,
        goods_id: _this.data.good_id
      },
      success: (res) => {
        console.log(res.data)
        var isMyself = false
        var good = {
          id: `${_this.data.good_id}`,
          title: res.data.name,
          images: res.data.images,
          price: res.data.price,
          is_buy: res.data.is_buy,
          gphoto: res.data.gphoto,
          detail: res.data.discribe,
        }
        var user = {
          user_id: res.data.user_id,
          user_name: res.data.username,
          user_school: res.data.school,
          sell_count: res.data.sell_count,
          avavtar: res.data.avavtar
        };
        if (user.user_id == app.globalData.userID) {
          isMyself = true
        }
        _this.setData({
          goods: good,
          user: user,
          isnotCart: res.data.isnotcoll,
          isMyself: isMyself,
          is_buy: res.data.is_buy
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  chat(e) {
    var user_id = this.data.user.user_id;
    wx.navigateTo({
      url: "../chat/chat?user_id=" + user_id
    })
    this.addChatList(user_id)

  },

  addChatList(user_id) {
    var signal = 0
    var indexx = 0;
    var data=this.data
    var chatList = wx.getStorageSync("chatList")
    chatList.forEach((element, index) => {
      if (element.user_id == user_id) {
        signal = 1
        indexx = index
      }
    });
    if (signal == 0) { //说明是新的消息记录
      var new_item = {
        user_id: data.user.user_id, //对方id
        gphoto: data.user.avavtar, //对方头像
        time: Date.parse(new Date()), //消息记录时间
        from: "", //通过什么物品找来
        school: data.user.user_school,
        name: data.user.user_name
      }
      chatList.push(new_item)
    } else {
      // var new_item = chatList[indexx]
      // new_item.time = Date.parse(new Date())
      // chatList[indexx] = new_item
    }

    wx.setStorageSync("chatList", chatList);
  },


  down() {
    wx.showLoading({
      title: "操作中...",
      mask: true,
    });
    var _this = this;
    // var user_id = app.globalData.userID;
    wx.request({
      url: "https://www.schoolbuy.online:80/logic/low",
      method: "get",
      data: {
        // user_id: user_id,
        goods_id: _this.data.goods.id
      },
      success(res) {
        console.log("下架成功")
        _this.setData({
          isnotCart: !_this.data.isnotCart
        })
      },
      complete(res) {
        wx.hideLoading()
      }
    })
  },
  shelves() {
    wx.showLoading({
      title: "操作中...",
      mask: true,
    });
    var _this = this;
    // var user_id = app.globalData.userID;
    wx.request({
      url: "https://www.schoolbuy.online:80/logic/unlow",
      method: "get",
      data: {
        // user_id: user_id,
        goods_id: _this.data.goods.id
      },
      success(res) {
        console.log("重新上架成功")
        _this.setData({
          isnotCart: !_this.data.isnotCart
        })
      },
      complete(res) {
        wx.hideLoading()
      }
    })
  },
  addToCart() {
    wx.showLoading({
      title: "收藏...",
      mask: true,
    });
    var _this = this;
    var user_id = app.globalData.userID;
    console.log(user_id)
    console.log(_this.data.goods.id)

    wx.request({
      url: "https://www.schoolbuy.online:80/logic/coll",
      method: "get",
      data: {
        user_id: user_id,
        goods_id: _this.data.goods.id
      },
      success(res) {
        console.log("收藏成功")
        _this.setData({
          isnotCart: !_this.data.isnotCart
        })
      },
      complete(res) {
        wx.hideLoading()
      }
    })

  },
  popToCart(e) {
    wx.showLoading({
      title: "取消收藏...",
      mask: true,
    });
    var _this = this;
    var user_id = app.globalData.userID;
    wx.request({
      url: "https://www.schoolbuy.online:80/logic/cancelcoll",
      method: "get",
      data: {
        user_id: user_id,
        goods_id: _this.data.goods.id
      },
      success(res) {
        _this.setData({
          isnotCart: !_this.data.isnotCart
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 100)
      },
      fail(res) {
        wx.showLoading({
          title: "操作失败...",
          mask: true,
        });
        setTimeout(() => {
          wx.hideLoading()
        }, 100)
      },
    })


  },
  onShow() {
    this.fresh()

  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  onPullDownRefresh() {
    this.fresh()
    wx.stopPullDownRefresh();

  }

})