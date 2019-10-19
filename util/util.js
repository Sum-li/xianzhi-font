function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  // 这里秒钟也取整
  var second = parseInt(time)

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}
function beautify_time(time){ //时间格式：yyyy-mm-dd hh:mm:ss  2018-09-01 11:11:11
  var timestamp=Date.parse(new Date(time))
  var mistiming = Math.round((Date.now() - timestamp) / 1000);
  var postfix = mistiming>0 ? '前' : '后'
  mistiming = Math.abs(mistiming)  //绝对值
  var arrr = ['年','个月','星期','天','小时','分钟','秒'];
  var arrn = [31536000,2592000,604800,86400,3600,60,1];

  for(var i=0; i<7; i++){
      var inm = Math.floor(mistiming/arrn[i])
      if(inm!=0){
          return inm+arrr[i] + postfix
      }
  }
}

module.exports = {
  formatTime: formatTime,
  beautify_time:beautify_time
}