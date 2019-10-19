// page/component/chat/chat.js
/* 聊天窗口
 * 其中54px为回复框高度，css同
 * mode true为文本，false为语音
 * cancel true为取消录音，false为正常录音完毕并发送
 * 上拉超过50px为取消发送语音
 * status 0为normal，1为pressed，2为cancel
 * hud的尺寸是150*150
 */
let app = getApp();


Page({
  data: {
    my_avavtar: "",
    socketOpen: true,
    message_list: [],
    scroll_height: wx.getSystemInfoSync().windowHeight,
    page_index: 0,
    mode: true,
    cancel: false,
    status: 0,
    tips: ['按住 说话', '松开 结束', '取消 发送'],
    state: {
      'normal': 0,
      'pressed': 1,
      'cancel': 2
    },
    toView: '',
    myid: "",
    yourid: "",
    your_avartar: '',
    your_info: {}
  },
  onLoad: function (options) {
    console.log(options.user_id)
    var _this = this;
    this.setData({
      my_avavtar: wx.getStorageSync("userInfo").avatarUrl,
      myid: app.globalData.userID,
      yourid: options.user_id,
    })
    wx.request({
      url: "https://schoolbuy.online:80/ws/getchatuserinfo",
      data: {
        send_id: options.user_id
      },
      success(res) {
        console.log(res)
        _this.setData({
          your_avartar: res.data.gphoto,
        })
      }
    })

    wx.onSocketMessage(function (res) {
      console.log('收到服务器返回内容（unload chat）：' + (res.data));
      var message_list = _this.data.message_list
      var data = JSON.parse(res.data)
      if (data.send_id == _this.data.yourid && data.receive_id == _this.data.myid) {
        var new_msg = {
          myself: 0,
          head_img_url: _this.data.your_avartar, //发来消息的人的头像路径(未改)
          msg_type: data.type,
          content: data.context,
          create_time: data.time
        }
        message_list.push(new_msg);
        _this.setData({
          message_list: message_list,
          content: '' // 清空输入框文本
        })
        _this.scrollToBottom();
      }
      _this.freshStorage(data)
    });
    _this.getHistory()

  },
  fistLoadUserInfo() {
    var _this = this
    wx.request({
      url: "https://schoolbuy.online:80/ws/getchatusersinfo",
      data: _this.data.yourid,
      success: (res) => {
        _this.setData({
          your_avartar: res.data.gphoto,
          your_school: res.data.school,
          your_name: res.data.name,
        })
      }
    })
  },
  freshStorage(obj) { //更新消息列表
    var list = wx.getStorageSync("chatList")
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    // console.log(obj)
    // console.log(list)
    //已经在缓存中,更新那一条的lasttime
    var had = 0;
    list.forEach((element, index) => {
      if (element.user_id == obj.send_id) {
        // console.log("zai")
        // console.log(element.user_id)
        // console.log(obj.send_id)
        // console.log(obj)
        element.time = obj.time
        // wx.getStorage("chatlist",list)
        had = 1;

      }
    });
    //不在缓存中    
    if (had == 1) {
      wx.setStorage({
        key: "chatList",
        data: list
      })
    } else {
      var new_list_item = {
        user_id: obj.send_id, //对方id
        gphoto: obj.gphoto, //对方头像
        time: obj.time, //最后一条消息记录时间
        from: "xxxxxxxx", //通过什么物品找来
        school: obj.school,
        name: obj.name
      }
      console.log(new_list_item)
      wx.request({
        url: "https://schoolbuy.online:80/ws/getchatuserinfo",
        data: {
          user_id: obj.send_id,
        },
        success(res) {
          new_list_item.gphoto = res.data.gphoto
          new_list_item.school = res.data.school
          new_list_item.name = res.data.name
        }
      })
      list.push(new_list_item)
      wx.setStorage({
        key: "chatList",
        data: list
      })
    }

    prevPage.setData({
      list: list
    }) //设置数据


  },
  sendSocketMessage: function (msg, callback, callback2, callback3) {
    if (app.globalData.socketOpen) {
      wx.sendSocketMessage({
        data: msg,
        success: callback,
        fail: callback2,
        complete: callback3
      })
    }




  },
  // onUnload: function () {
  //   wx.closeSocket();
  // },
  reply: function (e) {
    var content = e.detail.value;
    var _this = this;
    if (content == '') {
      wx.showToast({
        title: '总要写点什么吧'
      });
      return;
    }
    var message_list = this.data.message_list;
    var message = {
      myself: 1,
      head_img_url: _this.data.my_avavtar,
      msg_type: 'text',
      content: content,
      create_time: Date.parse(new Date())
    }
    var test = {
      send_id: _this.data.myid,
      receive_id: parseInt(_this.data.yourid),
      context: content,
      type: "text"
    }
    this.sendSocketMessage(JSON.stringify(test), function () {
      console.log("发送：" + JSON.stringify(test))
      message_list.push(message);
      _this.setData({
        message_list: message_list,
        content: '' // 清空输入框文本
      })
      _this.scrollToBottom();
    });

  },



  chooseImage: function () {
    // 选择图片供上传
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths);
        // 遍历多图
        tempFilePaths.forEach((tempFilePath) => {
          this.upload(tempFilePath, 'image');
        });
      }
    })
  },
  preview: function (e) {
    // 当前点击图片的地址
    var src = e.currentTarget.dataset.src;
    // 遍历出使用images
    var images = [];
    this.data.message_list.forEach(function (messasge) {
      if (messasge != null && messasge.msg_type == 'image') {
        images.push(messasge.content);
      }
    });
    // 预览图片
    wx.previewImage({
      urls: images,
      current: src
    });
  },
  switchMode: function () {
    // 切换语音与文本模式
    this.setData({
      mode: !this.data.mode
    });
  },
  // record: function () {
  //   // 录音事件
  //   wx.startRecord({
  //     success: function (res) {
  //       if (!(this.data.cancel)) {
  //         this.upload(res.tempFilePath, 'voice');
  //       }
  //     },
  //     fail: function (res) {
  //       console.log(res);
  //       //录音失败

  //     },
  //     complete: function (res) {
  //       console.log(res);

  //     }
  //   })
  // },
  // stop: function () {
  //   wx.stopRecord();
  // },
  // touchStart: function (e) {
  //   // 触摸开始
  //   var startY = e.touches[0].clientY;
  //   // 记录初始Y值
  //   this.setData({
  //     startY: startY,
  //     status: this.data.state.pressed
  //   });
  // },
  // touchMove: function (e) {
  //   // 触摸移动
  //   var movedY = e.touches[0].clientY;
  //   var distance = this.data.startY - movedY;
  //   // console.log(distance);
  //   // 距离超过50，取消发送
  //   this.setData({
  //     status: distance > 50 ? this.data.state.cancel : this.data.state.pressed
  //   });
  // },
  // touchEnd: function (e) {
  //   // 触摸结束
  //   var endY = e.changedTouches[0].clientY;
  //   var distance = this.data.startY - endY;
  //   // console.log(distance);
  //   // 距离超过50，取消发送
  //   this.setData({
  //     cancel: distance > 50 ? true : false,
  //     status: this.data.state.normal
  //   });
  //   // 不论如何，都结束录音
  //   this.stop();
  // },
  upload: function (tempFilePath, type) {
    var _this = this
    console.log(tempFilePath);

    wx.showLoading({
      title: '发送中'
    });

    var message_list = this.data.message_list;
    var message = {
      myself: 1,
      head_img_url: _this.data.my_avavtar,
      'msg_type': type,
      'content': tempFilePath,
      create_time: Date.parse(new Date())
    };

    var test = {
      send_id: _this.data.myid,
      receive_id: parseInt(_this.data.yourid),
      type: "image",
      context: ""
    }

    wx.uploadFile({
      url: 'https://www.schoolbuy.online:80/ws/wsimages',
      filePath: tempFilePath,
      name: "image",
      success: (res) => {
        console.log(123123)
        console.log(res)
        test.context = res.data
        _this.sendSocketMessage(JSON.stringify(test), function (res) {
          console.log("发送图片的res：" + JSON.stringify(res))
          message_list.push(message);
          _this.setData({
            message_list: message_list,
          })
        }, (res) => {
          console.log(res)
        }, (res) => {
          console.log(res)
          _this.scrollToBottom();
        });
      },
      fail: (res) => {},
      complete: (res) => {
        wx.hideLoading();
      }
    });



  },
  scrollToBottom: function () {
    this.setData({
      toView: 'row_' + (this.data.message_list.length - 1)
    });
  },
  closeSocket: function () {
    wx.closeSocket({
      success: function () {
        console.log("close success")
      }
    })
  },
  onUnload: function () {
    var _this=this

    _this.socketOn()  //切换socketon链接形式
  },
  socketOn() { //socket长连接   接受新消息
    var _this = this
    wx.onSocketMessage(function (res) {
      console.log('chat的socket on 收到服务器发来消息：' + (res.data));
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
  getHistory() {
    var _this = this
    var old_msglist = this.data.message_list
    //获取历史聊天记录

    wx.request({
      url: "https://schoolbuy.online:80/ws/getchatinfo",
      data: {
        send_id: _this.data.myid,
        receive_id: _this.data.yourid
      },
      success(res) {
        var message_list = _this.data.message_list
        var new_list = []
        console.log("history")
        console.log(res.data)

        res.data.forEach((element, index) => {
          if (element.send_id == _this.data.myid) {
            var message = {
              myself: 1,
              head_img_url: _this.data.my_avavtar,
              msg_type: element.Type,
              content: element.context,
              create_time: element.created_at
            };
          } else {
            var message = {
              myself: 0,
              head_img_url: _this.data.your_avartar,
              msg_type: element.Type,
              content: element.context,
              create_time: element.created_at
            };
          }
          new_list.push(message)
        });

        new_list.concat(message_list)
        _this.setData({
          message_list: new_list
        })
        _this.scrollToBottom();

      },
      fail(res) {

      }
    })

  }
})