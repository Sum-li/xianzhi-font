// page/component/new-pages/user/address/address.js
let app =  getApp();

  
Page({
  data:{
    address:{
      phone:'',
      detail:''
    }
  },
  onLoad(){
    var self = this;
    
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          address : res.data
        })
      }
    })
  },
  formSubmit(){
    var self = this;
    var _this=this
    if(self.data.address.phone && self.data.address.detail){
      wx.setStorage({
        key: 'address',
        data: self.data.address,
        success(){
          wx.navigateBack();
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整资料',
        showCancel:false
      })
    }
    wx.request({
      url: 'https://www.schoolbuy.online:80/logic/adduserinfo',
      data: {
        telephone:_this.data.address.phone,
        address:_this.data.address.detail,
        user_id:app.globalData.userID
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log(res)
      },
      fail: () => {},
      complete: () => {}
    });
      

  },
  bindName(e){
    this.setData({
      'address.name' : e.detail.value
    })
  },
  bindPhone(e){
    this.setData({
      'address.phone' : e.detail.value
    })
  },
  bindDetail(e){
    this.setData({
      'address.detail' : e.detail.value
    })
  }
})