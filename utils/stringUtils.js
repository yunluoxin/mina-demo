function StringUtils() {}

(function(){
  StringUtils.__proto__.isBlank = function (s) {
    if (!s) return true
    if (typeof s != 'string') return true
    if (!s.trim()) return true
    if (s == 'null') return true
    return false
  }
  
})()

module.exports = StringUtils