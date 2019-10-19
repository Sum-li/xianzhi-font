// page/component/new-pages/cart/cart.js
let app =  getApp();

  

Page({
  data: {
    goods:[],
    total:"",   //收藏的物品总数
    isStretch:[],
    page_count:1
  },
  onLoad(opstions){
    this.fresh()

    
  },
  fresh(){
    var _this=this
    console.log("fresh")
    wx.request({
      url: "https://www.schoolbuy.online:80/goods/wantbuy",
      data: {
        user_id: app.globalData.userID,
        page_count:_this.data.page_count
      },
      success(res) {
        console.log(res)
        var goods=_this.data.goods
        var newgoods=res.data
        for(var i=0;i<newgoods.length;i++){
          goods.push(newgoods[i])
        }
        _this.setData({
          goods:goods,
          page_count:_this.data.page_count+1
        })
      }
    })
  },
  onShow() {
    
    

  },
  longtap(e){
    var that = this
    var x = e.touches[0].pageX;
    var y = e.touches[0].pageY;
    this.setData({
      rippleStyle: ''
    });
    setTimeout(function () {
      that.setData({
        rippleStyle: 'top:' + y + 'px;left:' + x + 'px;-webkit-animation: ripple 0.4s linear;animation:ripple 0.4s linear;'
      });
    }, 200)
  },
  
  stretch(e){
    var _this=this
    var index=e.currentTarget.dataset.index;
    var temp=this.data.isStretch
    var value=temp[index]
    if(value==0){
        temp[index]=1;
        this.setData({
        isStretch:temp
      })
    }else{
      temp[index]=0;
      this.setData({
      isStretch:temp
    })
    }
    this.data.isStretch.forEach( (element,index) => {
      _this.data.isStretch[index]=0
    });
    
  },
  unstretch(){
    var temp=this.data.isStretch
    for(var i=0;i<temp.length;i++){
      temp[i]=0;
    }
    this.setData({
      isStretch:temp
    })
  },
  cancle(e){
    var good_id=e.currentTarget.dataset.goodid
    var index=e.currentTarget.dataset.index
    var _this=this
    var goods=this.data.goods
    wx.request({
      url: "https://www.schoolbuy.online:80/logic/cancelcoll",
      data:{
        goods_id:good_id,
        user_id:app.globalData.userID
      },
      success(res){
        console.log("success")
        // console.log(res)
        goods.splice(index,1)
        // console.log(goods)
        _this.unstretch()
      },
      fail(res){
        console.log("delete fail")
      },
      complete(res){
        _this.setData({
          goods:goods,
        })
      }
    })   
  },//end cancle()
  buy(e){
    var _this=this
    var good_id=e.currentTarget.dataset.goodid
    wx.navigateTo({
      url: `../orders/orders?good_id=${good_id}`,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
  }//end buy()
  
})