/**
 * 用于判断、验证的工具方法集。
 */
export default {
  type,
  fn: isFn,
  str: isStr,
  num: isNum,
  undef: isUndef,
  nullable: isNull,
  bool: isBool,
  obj: isObj,
  emptyObj: isEmptyObj,
  arr: isArr,

  android: isAndroid,
  ios: isIOS,

  phone: isPhone,
  email: isEmail,
  emoji: isEmoji,
  IDcard: isIDcard,

  value: isValue,
  space: isSpace,
  checkbox: vCheckbox,
  changeDate,   //时间转换 年月日
  changeDateHour,  //时间转换 年月日时分
  changeMsgDate,   //消息模块时间转换  
  cutout   //字符串截断
}


/**
 * 输入框的值是否为空。
 * @param {String} val
 *        {String} text
 * @returns Boolean
 */
export function isValue(val, text) {
  // if (text) {
  //   wx.showToast({
  //     title: text,
  //     icon: 'none'
  //   })
  // }
  return !!val
}


/**
 * 去掉输入框中的所有空格
 * @param {String} val
 * @returns String
 */
export function isSpace(val) {
  return val.replace(/\s+/g, "")
}

/**
 * 多选框非空验证
 * @param {Array} val
 * @returns Boolean
 */
//多选框验证
export function vCheckbox(val, text) {
    // if (text) {
    //   wx.showToast({
    //     title: text,
    //     icon: 'none'
    //   })
    // }
    return val.length > 0
}


var class2type = {};
(function () {
  const types = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'];
  types.forEach(name => {
    class2type["[object " + name + "]"] = name.toLowerCase();
  })
})();




/**
 * 是否是emoji。
 * @param {String} e
 * @returns Boolean
 */
export function isEmoji(substring) {
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
        || hs == 0x2b50) {
        return true;
      }
    }
  }
}

/**
 * 是否是Android。
 * @returns Boolean
 */
export function isAndroid() {
  return  'android';
}

/**
 * 是否是iOS。
 * @returns Boolean
 */
export function isIOS() {
  return 'ios';
}


/**
 * 是否是身份证。
 * @param {String} e
 * @returns Boolean
 */
export function isIDcard(e) {
  if (isUndef(e)) return false;
  return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(e);
}

/**
 * 是否是邮箱。
 * @param {String} e
 * @returns Boolean
 */
export function isEmail(e) {
  if (isUndef(e)) return false;
  return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(e);
}

/**
 * 是否是11位手机号码。
 * @param {Any} p
 * @returns Boolean
 */
export function isPhone(p) {
  if (isUndef(p)) return false;
  if (p.length !== 11) return false
  return /^[1][3-9][0-9]{9}$/.test(p + '');
}

/**
 * 是否是空对象（不包含任何可枚举属性）
 * @param {Any} obj
 * @returns Boolean
 */
export function isEmptyObj(obj) {
  for (var p in obj) {
    if (p !== undefined) {
      return false;
    }
  }
  return true;
}

/**
 * 是否是对象(Object)。
 * @param {Any} obj
 * @returns Boolean
 */
export function isObj(obj) {
  return type(obj) === 'object';
}

/**
 * 是否是数组。
 * @param {Any} arr
 * @returns Boolean
 */
export function isArr(arr) {
  return Array.isArray(arr);
}

/**
 * 是否是 boolean
 * @param {Any} bool
 * @returns Boolean
 */
export function isBool(bool) {
  return type(bool) === 'boolean';
}

/**
 * 是否是 undefined。
 * @param {Any} undef
 * @returns Boolean
 */
export function isUndef(undef) {
  return type(undef) === 'undefined';
}
/**
 * 是否是 null
 * @param {Any} nullable
 * @returns Boolean
 */
export function isNull(nullable) {
  return type(nullable) === 'null';
}

/**
 * 是否是字符串。
 * @param {Any} str
 * @returns Boolean
 */
export function isStr(str) {
  return type(str) === 'string';
}

/**
 * 是否是数字类型。
 * @param {Any} num
 * @returns Boolean
 */
export function isNum(num) {
  return type(num) === 'number';
}

/**
 * 获取一个JavaScript对象的具体类型。
 * (boolean, number, string, function, array, date, regexp, object, error)
 * @param {Any} obj
 */
export function type(obj) {
  // return typeof o;
  return obj == null ? String(obj) : (class2type[{}.toString.call(obj)] || 'object');
}

/**
 * 是否是Function。
 * @param {Any} fn
 * @return Boolean
 */
export function isFn(fn) {
  return type(fn) === 'function';
}

// 小于10，加0
function addZero(m) {
  return m < 10 ? '0' + m : m
}

// 时间戳转化为年-月-日
export function changeDate(millis, guide) {
  var time = new Date(millis)
  // 年
  var year = time.getFullYear()
  // 月
  var month = time.getMonth() + 1
  // 日
  var date = time.getDate()
  // 时
  var hour = time.getHours()
  // 分
  var mins = time.getMinutes()
  if (guide === 'guide') {
    if (year === new Date().getFullYear()) {
      return addZero(month) + '-' + addZero(date)
    } else {
      return year + '-' + addZero(month) + '-' + addZero(date)
    }
  } else {
    return year + '-' + addZero(month) + '-' + addZero(date)
  }
}

//消息模块的时间处理
export function changeMsgDate(millis){
  var time = new Date(millis)
  // 年
  var year = time.getFullYear()
  // 月
  var month = time.getMonth() + 1
  // 日
  var date = time.getDate()
  // 时
  var hour = time.getHours()
  // 分
  var mins = time.getMinutes()
  //是同一年份和月份
  if (year === new Date().getFullYear()){
    if ((month === new Date().getMonth() + 1) && (date === new Date().getDate())){
      //今天
      return '今天' + ' ' + addZero(hour) + ':' + addZero(mins)
    } else if ((month === new Date().getMonth() + 1) && (date === new Date().getDate() - 1)){
      //昨天
      return '昨天' + ' ' + addZero(hour) + ':' + addZero(mins)
    }else{
      return addZero(month) + '-' + addZero(date) + ' '  + addZero(hour) + ':' + addZero(mins)
    }
  }else{
    return year + ' ' + addZero(month) + '-' + addZero(date) + ' ' + addZero(hour) + ':' + addZero(mins)
  }

  if (year === new Date().getFullYear()) {
    return addZero(month) + '-' + addZero(date)
  } else {
    return year + '-' + addZero(month) + '-' + addZero(date)
  }
}

// 时间戳转化为年-月-日-时-分
export function changeDateHour(millis) {
  var time = new Date(millis)
  // 年
  var year = time.getFullYear()
  // 月
  var month = time.getMonth() + 1
  // 日
  var date = time.getDate()
  // 时
  var hour = time.getHours()
  // 分
  var mins = time.getMinutes()
  return year + '-' + addZero(month) + '-' + addZero(date) + ' ' + addZero(hour) + ':' + addZero(mins)
}

/**
 * 字符串截断方法,字符串长度大于指定值
 * @param {String}  
 * @return String
 */
export function cutout(val, num){
  if (val && val.length > num) {
    val = val.substring(0, num) + '...'
  }
  return val;
}
