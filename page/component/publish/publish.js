// page/component/publish/publish.js
import {
  $init,
  $digest
} from '../../../util/common.util'
import {
  promisify
} from '../../../util/promise.util'
let app = getApp();


const wxUploadFile = promisify(wx.uploadFile)



Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    good_name: '', //名字
    category_id: '', //分类id
    quickinput_index: -1,
    textarea_value: "", //详细描述
    price: "",
    category: ["其他", "交通工具", "电子产品", "衣物鞋子", "书本教材"], //可选的物品种类
    active:[],
    index: 0, //picker组件用到
    images: [],
    options: ['新旧程度:', '入手渠道:', '使用感受:', '出手原因:']
  },


  methods: {
    onReady: function (e) {
      var _this = this
      var temp = []
      app.globalData.category.forEach((element, index) => {
        temp[index] = element.name
      });
      this.setData({
        category: temp
      })
      $init(this) //图片选择功能初始化
    },
    onShow(){
      this.certify()

    },
    inputedit(e) {
      this.setData({
        good_name: e.detail.value
      });
    },
    textareaedit(e) {
      this.setData({
        textarea_value: e.detail.value
      });
    },
    priceEdit(e) {
      this.setData({
        price: e.detail.value
      });
    },
    onLuanch(e) {
      
    },

    certify(){
      //判断是否已经认证
      if(app.globalData.certified==false){
        wx.showModal({
          title: '未认证',
          content: '发布闲置需要进行认证',
          showCancel: true,
          cancelText:"不认证",
          cancelColor: '#000000',
          confirmText: '去认证',
          confirmColor: '#BC8F8F',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({
                url:"../approve/approve"
              })
            }
            if (res.cancel) {
              wx.reLaunch({
                url:'../index'
              })
            }
          },

        });
      }
    },


    chooseImage(e) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
        sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
        success: res => {
          const images = this.data.images.concat(res.tempFilePaths)
          // 限制最多只能留下3张照片
          this.data.images = images.length <= 9 ? images : images.slice(0, 9)
          $digest(this)
        }
      })
    },
    removeImage(e) {
      const idx = e.target.dataset.idx
      this.data.images.splice(idx, 1)
      $digest(this)
    },
    handleImagePreview(e) {
      const idx = e.target.dataset.idx
      const images = this.data.images
      wx.previewImage({
        current: images[idx], //当前预览的图片
        urls: images, //所有要预览的图片
      })
    },

    select(e) {
      var value = this.data.textarea_value;
      value += "\n" + this.data.options[e.detail.index]
      this.setData({
        textarea_value: value
      })

    },
    bindPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        index: e.detail.value
      })
    },
    gdChange: function (e){
      var active=this.data.active
      console.log('switch1 发生 change 事件，携带值为', e.detail.value)
      if(e.detail.value==false){
        active.forEach( (element,index) => {
          if(element=="gd"){
            active.splice(index,1)
          }
        });
      }else{
        active.push('gd')
      }
      this.setData({
        active:active
      })
    },

    test(){
      var category_id =Number(this.data.index)+1 
      console.log( category_id)
    },
    submitForm(e) {
      const _this = this
      const good_name = this.data.good_name
      const textarea_value = this.data.textarea_value
      var category_id = Number(this.data.index)+1 
      var imgs=_this.data.images
      const active = this.data.active
      const price = this.data.price;
      var good_id = 1; //后台传回来的
      if (good_name&&imgs.length!=0) {
        wx.showLoading({
          title: '发布中...',
          mask: true
        })
        console.log("active:"+JSON.stringify(active)  )
        console.log(active)
        wx.uploadFile({
          url: "https://www.schoolbuy.online:80/logic/pub",
          filePath: _this.data.images[0],
          name: 'gphoto',
          formData: {
            name: good_name,
            user_id: app.globalData.userID,
            name: good_name,
            category_id: category_id,
            price: price,
            discribe: textarea_value,
            active: JSON.stringify(active)   
          },
          success: (res) => {
            // console.log("返回good_id的res.data："+ JSON.parse(res.data).ID)
            good_id = JSON.parse(res.data).ID;
            console.log("good_id:" + good_id)

            const arr = _this.data.images.map((path, index) => {
              if (index > 0) {
                return wxUploadFile({
                  url: "https://www.schoolbuy.online:80/logic/photo",
                  filePath: path,
                  name: 'image',
                  formData: {
                    name: good_name,
                    user_id: app.globalData.userID,
                    goods_id: good_id
                  }
                })
              }
            })
            Promise.all(arr).then(res => {
              // 发布成功，清空输入框、转到刚才发布的物品页
              wx.navigateTo({
                url: `../details/details?good_id=${good_id}`
              })
            }).then(() => {
              _this.setData({
                good_name: '',
                textarea_value: "",
                price: 0,
                images: []
              })


              wx.hideLoading()
            })
          }
        })

      }else{
        wx.showModal({
          title: '提示',
          content: '信息输入不完整，明确的信息才有更多人感兴趣哦',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
  }
})