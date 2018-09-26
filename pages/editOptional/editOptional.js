Page({
  data: {
    optionsListData: [],
    // 用户拖动时显示的控件信息
    movableViewPosition:{
      x: 0,
      y: 0,
      className: "none",
      data: {}
    },
    // 显示信息的滚动视图
    scrollPosition: {
      everyOptionCell: 65,
      top: 47,
      scrollTop: 0,
      scrollY: true,
      scrollViewHeight: 1000,
      scrollViewWidth: 375,
      windowViewHeight: 1000,
    },
    selectItemInfo: {
      content: "",
      id: "",
      sCode: "",
      selectIndex: -1,
      selectPosition: 0,
    },
  },

  showDetail: function (event) {
    console.log(event)
    var itemId = event.target.dataset.index
    wx.showModal({
      title: '详情',
      content: this.data.optionsListData[itemId].content,
      showCancel: false,
    })
  },

  // 视图滚动
  bindscroll: function (event) {
    var scrollTop = event.detail.scrollTop
    this.setData({
      'scrollPosition.scrollTop': scrollTop
    })
  },

  // 通过id获取选项的值
  getOptionInfo: function (code) {
    for(var i = 0, j = this.data.optionsListData.length; i < j; i++){
      var optionData= this.data.optionsListData[i]
      if(optionData.id == code){
        optionData.selectIndex = i
        // console.log('getOptionInfo获取到了 ', optionData)
        return optionData
      }
    }
    return {}
  },

  // 通过坐标获取选项信息
  getPositionDomByXY: function (potions) {
    var y = potions.y - this.data.scrollPosition.top + this.data.scrollPosition.scrollTop
    var optionsListData = this.data.optionsListData
    var everyOptionCell = this.data.scrollPosition.everyOptionCell
    for(var i = 0, j = optionsListData.length; i < j; i++){
      if(y >= i * everyOptionCell && y < (i + 1) * everyOptionCell) {
        return optionsListData[i]
      }
    }
    return optionsListData[0]
  },

  // 开始拖动时
  scrollTouchStart: function (event) {
    var firstTouchPosition = {
      x:event.changedTouches[0].pageX,
      y:event.changedTouches[0].pageY,
    }

    console.log("开始拖动点:", firstTouchPosition)
    var domData = this.getPositionDomByXY(firstTouchPosition)
    console.log("拖动的元素为:", domData)

    //movable-area滑块位置处理
    // var movableX = 0
    // var movableY = firstTouchPosition.y - this.data.scrollPosition.top - this.data.scrollPosition.everyOptionCell / 2
    // this.setData({
    //   movableViewPosition: {
    //     x: movableX,
    //     y: movableY,
    //     className: "",
    //     data: domData
    //   }
    // })

    var secCode = domData.id
    var secInfo = this.getOptionInfo(secCode)
    secInfo.selectPosition = event.changedTouches[0].clientY
    secInfo.selectClass = "dragSelected"

    this.data.optionsListData[secInfo.selectIndex].selectClass = "dragSelected"

    var optionsListData = this.data.optionsListData

    this.setData({
      'scrollPosition.scrollY': false,
      selectItemInfo: secInfo,
      optionsListData: optionsListData,
      'scrollPosition.selectIndex': secInfo.selectIndex
    })
  },

  scrollTouchMove: function (event) {
    var selectItemInfo = this.data.selectItemInfo
    var selectPosition = selectItemInfo.selectPosition
    var selectIndex = selectItemInfo.selectIndex
    var moveDistance   = event.changedTouches[0].clientY
    var everyOptionCell = this.data.scrollPosition.everyOptionCell
    var optionsListData = this.data.optionsListData

    // console.log("拖动到:", event.changedTouches)
    //movable-area滑块位置处理
    var movableX = 0
    var movableY = event.changedTouches[0].pageY - this.data.scrollPosition.top - this.data.scrollPosition.everyOptionCell / 2

    this.setData({
      movableViewPosition:{
        x: movableX,
        y: movableY,
        className: "",
        data: this.data.movableViewPosition.data
      }
    })

    // 实现滑块向上拖动效果
    if(moveDistance - selectPosition > 0 && selectIndex < optionsListData.length - 1){
      if (optionsListData[selectIndex].id == selectItemInfo.id) {
        optionsListData.splice(selectIndex, 1)
        optionsListData.splice(++selectIndex, 0, selectItemInfo)
        selectPosition += everyOptionCell
      }
    }

    // 实现滑块向上拖动效果
    if (moveDistance - selectPosition < 0 && selectIndex > 0) {
      if (optionsListData[selectIndex].id == selectItemInfo.id) {
        optionsListData.splice(selectIndex, 1)
        optionsListData.splice(--selectIndex, 0, selectItemInfo)
        selectPosition -= everyOptionCell
      }
    }

    this.setData({
        'selectItemInfo.selectPosition': selectPosition,
        'selectItemInfo.selectIndex': selectIndex,
        optionsListData: optionsListData,
    })
  },

  scrollTouchEnd: function (event) {
    // console.log('拖动结束于: ', event)
    var optionsListData = this.optionsDataTranlate(this.data.optionsListData, "")
    var dragId = this.data.selectItemInfo.id
    var placeId = this.data.selectItemInfo.selectIndex

    console.log('结束位置为：', this.data.movableViewPosition.y)

    // 对optionListData的元素id重新排序
    if (dragId < placeId) {
      for (var i = dragId; i <= placeId; i++) {
        optionsListData[i].id = i
      }
    }
    else {
      for (var i = dragId; i >= placeId; i--) {
        optionsListData[i].id = i
      }
    }

    this.setData({
      optionsListData: optionsListData,
      'scrollPosition.scrollY': true,
      'movableViewPosition.className': "none"
    })
  },
  
  // 设置每个选项的selectClass属性
  optionsDataTranlate: function (optionsList, selectClass) {
    for(var i = 0, j = optionsList.length; i < j; i++){
      optionsList[i].selectClass = selectClass
    }
    return optionsList
  },

  // 填充内容 获取srcollView的长度和高度
  onLoad: function (options) {
    var systemInfo = wx.getSystemInfoSync()
    var optionsList = [
      { "id": "0", "content":"段落1 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"},
      { "id": "1", "content":"段落2 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"},
      { "id": "2", "content":"段落3 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"},
      { "id": "3", "content":"段落4 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"},
      { "id": "4", "content":"段落5 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"},
      { "id": "5", "content":"段落6 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"},
      { "id": "6", "content":"段落7 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"},
      { "id": "7", "content":"段落8 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"},
      { "id": "8", "content":"段落9 内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"}
    ]
    optionsList = this.optionsDataTranlate(optionsList,"")
    // 开始加载页面
    var scrollViewHeight = systemInfo.windowHeight - 47
    var scrollViewWidth = systemInfo.windowWidth
    this.setData({
      optionsListData: optionsList,
      'scrollPosition.scrollViewWidth': scrollViewWidth,
      'scrollPosition.scrollViewHeight': scrollViewHeight,
      'scrollPosition.windowViewHeight': systemInfo.windowHeight,
    })
  },
});
