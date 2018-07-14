//index.js
//获取应用实例
var app = getApp()
var utils = require('../../utils/ddutils.js')
Page({
  data: {

  },
  //事件处理函数
  bindViewTap: function () {
    wx.showLoading({
      title: 'loading...',
    })
    utils.downloadAndSaveFiles({
      urls: ["https://up.enterdesk.com/edpic_source/6a/ad/e3/6aade3d71c3f8309ea33f9508e88d9c0.jpg",
      "https://up.enterdesk.com/edpic_source/3e/36/34/3e3634c7574a9fc889d285a94ba9d9ad.jpg"
      ],
      reload: false,
      success: function (path) {
        console.log(path)
        wx.hideLoading()


        wx.getSavedFileList({
          success: function(res){
            console.log(res)
          }
        })
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '下载失败',
        })
      }
    })
  },

  onLoad: function () {
    console.log('onLoad')
  }
})
