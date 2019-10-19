// page/common/components/quickinput/quickinput.js

// 组件：快捷输入栏 
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options:{
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    select(e){
      var index=e.currentTarget.dataset.index;
      this.triggerEvent('myevent',{index:index})
      
    }
  }
})
