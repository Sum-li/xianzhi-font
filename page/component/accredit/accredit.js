const app = getApp();
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {
        var _this = this;
        wx.setStorage({
            key:"chatList",
            data:[
            //     {
            //     user_id:15,  //对方id
            //     gphoto:'https://wx.qlogo.cn/mmopen/vi_32/njwaSUP5DiabKEr626aBGHEhibiaAEFLqungTIkqq4WibYRBXcWnCdwBDqbibsZBo67O3ic0O56ZLAUicyKg0RwJ08sSg/0',//对方头像
            //     last_time:'2018-09-01',//最后一条消息记录时间
            //     from:"ipad pro 灰色 128G 99新",//通过什么物品找来
            //     school:"华北电力大学",
            //     name:"陈某某"
            //   }
            ]
          })//缓存是空的话，还有建一个消息列表 缓存
    },
    bindGetUserInfo: function (e) {
        var userInfo=e.detail.userInfo
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var _this = this;
            //发送用户信息给后台

            var userInfoObj={}
            userInfoObj.nickName=userInfo.nickName;
            userInfoObj.avatarUrl=userInfo.avatarUrl;
            userInfoObj.province=userInfo.province;
            userInfoObj.city=userInfo.city;
            userInfoObj.userGender	=userInfo.userGender;
            wx.setStorageSync('userInfo', userInfoObj); 
            //授权成功后，跳转进入小程序首页
            wx.switchTab({
                url: '../index'
            })
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: 'warming',
                content: '您拒绝了授权，某些功能可能无法使用',
                showCancel: false,
                confirmText: '我知道了',
                success: function (res) {
                    if (res.confirm) {
                        wx.switchTab({
                            url: '../index'
                        })
                    }
                }
            })

        }
    },

})