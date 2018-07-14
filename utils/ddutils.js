const download_file_list_key = 'download_file_list'

/**
 * 下载并保存文件到本地
 * function success(filePath)
 */
function downloadAndSaveFile(object) {

  var reload = true
  if (object.reload != undefined) reload = object.reload

  if (!reload) {
    var originMap = wx.getStorageSync(download_file_list_key)
    var filePath = originMap[object.url]
    if (filePath) {
      existsFile({
        filePath: filePath,
        success: function () {
          if (object.success) object.success(filePath)
        },
        fail: function () {
          var obj = object
          obj.reload = true
          downloadAndSaveFile(obj)
        }
      })

      return
    }
  }

  wx.downloadFile({
    url: object.url,
    success: function (res) {
      if (res.statusCode / 200 == 1 && object.success) {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (r) {
            object.success(r.savedFilePath)

            // 保存索引列表
            var newMap = {}
            newMap[object.url] = r.savedFilePath
            var originMap = wx.getStorageSync(download_file_list_key)
            wx.setStorageSync(download_file_list_key, updateMap(originMap, newMap))
          }
        })
      } else {
        if (object.fail) object.fail("出错了")
      }
    }
  })
}

/**
 * 下载并保存多个文件到本地
 * function success({url1:filePath1, url2:filePath2})
 */
function downloadAndSaveFiles(object) {
  var urls = object.urls
  if (!urls || typeof urls != 'object') {
    console.error('urls必须是一个数组')
  }
  var reload = true
  if (object.reload != undefined) reload = object.reload

  var result = {}
  var failed = false  // 标记已经出错过，不用再向上抛出异常
  var successTimes = 0;
  for (var index in urls) {
    var url = urls[index]
    downloadAndSaveFile({
      url: url,
      reload: reload,
      success: function (path) {
        result[url] = path
        successTimes = successTimes + 1
        if (successTimes == urls.length) {
          object.success(result)
        }
      },
      fail: function (err) {
        if (!failed) {
          failed = true
          object.fail(err)
        }
      }
    })
  }
}

/**
 * 更新map，以新map为主，对原始map进行更新
 * @return 原始map
 */
function updateMap(originMap, newMap) {
  if (!originMap || Object.prototype.toString.call(originMap) != '[object Object]') {
    originMap = {}
  }
  for (var key in newMap) {
    originMap[key] = newMap[key]
  }
  return originMap
}

/**
 * 异步检测某个 保存的文件 是否还存在
 */
function existsFile(object) {
  wx.getSavedFileInfo({
    filePath: object.filePath,
    success: function (res) {
      if (res.errMsg.lastIndexOf('ok') != -1) {
        if (object.success) {
          object.success()
        }
      }
    },
    fail: function (err) {
      if (object.fail) {
        object.fail()
      }
    }
  })
}

function md5(url) {
  return url
}

module.exports = {
  downloadAndSaveFile: downloadAndSaveFile,
  downloadAndSaveFiles: downloadAndSaveFiles
}