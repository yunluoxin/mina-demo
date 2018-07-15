require('b.js') ;   // ";号不能漏"

(function (){
  console.info('test.js init...')
  Date.prototype.format = function (formatString){
    console.log(formatString)
  }
  String.prototype.parseInt = function (s){
    if (!this) return 0 
    return parseInt(this)
  }
})() 




