// page/component/approve/approve.js
let app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    number: "",
    school: "",
    image: null,
    res: {
      name: "",
      number: "",
      school: ""
    },
    yes: 0,
    approved: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    console.log(app.globalData)
    if(app.globalData.certified==true){
      console.log(11111)
      this.setData({
        yes:1,
        approved:1
      })
    }
  },
  submit() {
    wx.showLoading({
      title: "认证中",
      mask: true,
    });

    var _this = this
    var data = this.data
    if (data.name && data.school && data.number && data.image != null) {
      wx.uploadFile({
        url: 'https://www.schoolbuy.online:80/logic/authenticate',
        filePath: _this.data.image,
        name: "image",
        formData: {
          user_id: app.globalData.userID,
          school: _this.data.school,
          name: _this.data.name,
          school_number: _this.data.number
        },
        success: (res) => {
          console.log(res.data)

          if(res.data.indexOf("true") > 0){
            console.log(res.data)
          // if(res.data.is_authentication==true){   传的是个字符串回来，所以先用这个方式判断
            _this.setData({
              res: res.data,
              yes: 1,
              approved:1
            })
            app.globalData.certified=true
          }else{
            console.log(11123123123)
            _this.setData({
              res: res.data,
              yes: 0,
              approved:1
            })
          }
        },
        fail:(res)=>{
          console.log("认证网络请求失败")
          console.log(res)
        },
        complete(res){
          wx.hideLoading();
        }
      });
        
    }
    // _this.setData({
    //   approved: 1
    // })

  },

  chooseimg() {
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          image: res.tempFilePaths[0]
        })
      }
    })
  },
  rengong(){
    wx.showLoading({
      title: "提交中",
      mask: true,
    });

    var _this = this
    var data = this.data
    if (data.name && data.school && data.number && data.image != null) {
      wx.uploadFile({
        url: 'https://www.schoolbuy.online:80/logic/authenticaterengong',
        filePath: _this.data.image,
        name: "image",
        formData: {
          user_id: app.globalData.userID,
          school: _this.data.school,
          name: _this.data.name,
          school_number: _this.data.number
        },
        success: (res) => {
          console.log(res)
        },
        complete(res){
          wx.hideLoading();
          wx.showModal({
            title: '提交成功',
            content: '等待人工验证中,先逛逛吧~',
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
            },
            fail: () => {},
            complete: () => {}
          });
            
        }
      });
        
    }
  },
  bindName(e) {
    this.setData({
      name: e.detail.value
    });
  },
  bindPhone(e) {
    this.setData({
      number: e.detail.value
    });
  },
  bindDetail(e) {
    this.setData({
      school: e.detail.value
    });
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