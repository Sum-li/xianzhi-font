// page/component/orders/orders.js
let app = getApp();

Page({
  data: {
    userID: '',
    address: "",
    phone: "",
    hasAddress: true,
    total: 0,
    good_id: "3",
    good_images: [],
    good_name: "",
    good_price: "",
    pay_type_arr: [
      '面交',
      // '配送帮',
      // '邮递'
    ],
    pay_type: 0,

  },
  onLoad(options) {
    // this.setData({
    //   good_id:options.good_id
    // })
    console.log(options)
    this.setData({
      good_id: options.good_id
    })
    this.fresh()
  },
  fresh() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var _this = this;
    wx.request({
      url: `https://www.schoolbuy.online:80/goods/detail?goods_id=${_this.data.good_id}`,
      data: {
        good_id: _this.good_id
      },
      success: (res) => {
        console.log(res)
        var images = res.data.images || []
        var all_images = []
        all_images.push(res.data.gphoto)
        all_images.concat(images)
        _this.setData({
          good_name: res.data.name,
          good_images: all_images,
          good_price: res.data.price
        })
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },

  onReady() {
    // this.getTotalPrice();
  },

  onShow: function () {
    const self = this;
    wx.getStorage({
      key: 'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
    var userid = app.globalData.userID;
    this.setData({
      userID: userid
    })
  },
  bindPickerChange(e) {
    this.setData({
      pay_type: e.detail.value
    })
  },

  toPay() {
    // wx.showLoading({
    //   title: '正在下单',
    //   mask: true
    // })
    var _this = this
    var _data = this.data;
    var address = _data.address
    var phone = _data.phone

    if (phone && address) {
      if(_data.pay_type==1){  //配送帮
        // wx.requestPayment(
        //   {
        //   'timeStamp': '',
        //   'nonceStr': '',
        //   'package': '',
        //   'signType': 'MD5',
        //   'paySign': '',
        //   'success':function(res){},
        //   'fail':function(res){},
        //   'complete':function(res){}
        //   })
        wx.request({
          url: "https://www.schoolbuy.online:80/logic/buy",
          method: "get",
          data: {
            user_id: _data.userID,
            goods_id: _data.good_id,
            address: _data.address,
            telephone: _data.phone,
            distribution_id: _data.pay_type + 1
          },
          success(res) {
            console.log(res)
            wx.redirectTo({
              url: '../cart4/cart4',
            });
            wx.showLoading({
              title: '操作成功',
              mask: true
            })
          },
          fail(res) {
            wx.showLoading({
              title: '操作失败',
              mask: true
            })
          },
          complete(res) {
            setTimeout(() => {
              wx.hideLoading()
            }, 500)
          }
        })
      }else{
        wx.request({
          url: "https://www.schoolbuy.online:80/logic/buy",
          method: "get",
          data: {
            user_id: _data.userID,
            goods_id: _data.good_id,
            address: _data.address,
            telephone: _data.phone,
            distribution_id: _data.pay_type + 1
          },
          success(res) {
            console.log(res)
            wx.redirectTo({
              url: '../cart4/cart4',
            });
            wx.showLoading({
              title: '操作成功',
              mask: true
            })
          },
          fail(res) {
            wx.showLoading({
              title: '操作失败',
              mask: true
            })
          },
          complete(res) {
            setTimeout(() => {
              wx.hideLoading()
            }, 500)
          }
        }) 
      }
    } else {
      wx.showModal({
        title: '提示！',
        content: '请确认地址与手机号输入完整',
        success(res) {}
      })
    }

  },

  tipPsb() {
    wx.showModal({
      title: '关于配送帮',
      content: '平台免费配送，我们将送货上门，待您亲自查看无误后再确认收货，如有不满意可当场拒签，无须面交，少点麻烦，多点安全。',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  changeAddress(e) {
    this.setData({
      address: e.detail.value
    })
    console.log(e.detail)

  },
  changePhone(e) {
    this.setData({
      phone: e.detail.value
    })
    console.log(e.detail)
  },
})