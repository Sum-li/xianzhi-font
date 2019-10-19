// page/common/components/dialog/dialog.js
// 弹出框组件
Component({
  /**
* 组件的属性列表
*/
  properties: {
    account: {
      type: Array,
      value: []
    },
    accountName: {
      type: String,
      value: "未选择"
    }
  }, //存放公共数据的地方，可以供调用方传递数据
  /**
* 组件的初始数据
*/
  data: {
    state: false,
    first_click: false,
  }, //私有属性的地方，data中的数据只有组件可以访问，外部无法访问
  /**
* 组件的方法列表
*/
  methods: {
    closer: function (e) {
      this.setData({
        state: false,
      })
    }, //点击遮罩层消失
    select: function (e) {
      var oIndex = e.currentTarget.dataset.index;
      var oAccount = this.data.account[oIndex].name; //这里需要的数据有调用方传递到properties
      this.setData({
        state: false,
      })
      this.triggerEvent("action", oAccount); //将该方法抛出
      console.log(this.properties.accountName)

    }, //选择下拉的用户名称
    toggle: function () {
      var list_state = this.data.state,
        first_state = this.data.first_click;
      if (!first_state) {
        this.setData({
          first_click: true
        });
      }
      if (list_state) {
        this.setData({
          state: false
        });
      } else {
        this.setData({
          state: true
        });
      }
    }, //调出弹出框事件
  } //存放事件的地方
})