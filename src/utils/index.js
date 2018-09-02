export default {
  /**
   * 简单的节流函数 - 只允许一个函数在 X 毫秒内执行一次。
   * @param {Function} func 回调函数
   * @param {Number} wait 延迟多长时间
   * @param {Number} mustRun 至少多长时间触发一次
   */
  throttle(func, wait, mustRun) {
    let timeout
    let startTime = new Date()

    return function () {
      let context = this
      let args = arguments
      let curTime = +new Date()

      clearTimeout(timeout)

      // 如果达到了规定的触发时间间隔，触发 handler。没达到触发间隔，重新设定定时器
      if (curTime - startTime >= mustRun) {
        func.apply(context, args)
        startTime = curTime
      } else {
        timeout = setTimeout(func, wait)
      }
    }
  },
  /**
   * 阿拉伯数字转罗马数字
   * @param {Int} num - 整型数字
   */
  intToRoman(num) {
    let base = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    let lm = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
    let roman = ''
    let i = 0
    while (num !== 0) {
      if (num >= base[i]) {
        num -= base[i]
        roman += lm[i]
      } else {
        i++
      }
    }
    return roman
  },
  /**
   * 控制浏览器全屏
   * @param {Boolean} state - 当前浏览器是否全屏，默认是false
   */
  doFullScreen(state = false) {
    let main = document.body
    if (state) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    } else {
      if (main.requestFullscreen) {
        main.requestFullscreen()
      } else if (main.mozRequestFullScreen) {
        main.mozRequestFullScreen()
      } else if (main.webkitRequestFullScreen) {
        main.webkitRequestFullScreen()
      } else if (main.msRequestFullscreen) {
        main.msRequestFullscreen()
      }
    }
  },
  /**
   * 数字转中文
   * @param {Int} num 整形数字
   */
  numberToChinese(num) {
    let chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    let chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
    let chnUnitChar = ['', '十', '百', '千']
    let unitPos = 0
    let strIns = ''
    let chnStr = ''
    let needZero = false

    function SectionToChinese(section) {
      let strIns = ''
      let chnStr = ''
      let unitPos = 0
      let zero = true
      while (section > 0) {
        let v = section % 10
        if (v === 0) {
          if (!zero) {
            zero = true
            chnStr = chnNumChar[v] + chnStr
          }
        } else {
          zero = false
          strIns = chnNumChar[v]
          strIns += chnUnitChar[unitPos]
          chnStr = strIns + chnStr
        }
        unitPos++
        section = Math.floor(section / 10)
      }
      return chnStr
    }

    if (num < 10) {
      return chnNumChar[num]
    }

    if (num < 20) {
      let q = chnUnitChar[1]
      let p = num % 10
      if (p === 0) {
        return q
      } else {
        return q + chnNumChar[p]
      }
    }
    while (num >= 20) {
      let section = num % 10000
      if (needZero) {
        chnStr = chnNumChar[0] + chnStr
      }
      strIns = SectionToChinese(section)
      strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0]
      chnStr = strIns + chnStr
      needZero = (section < 1000) && (section > 0)
      num = Math.floor(num / 10000)
      unitPos++
    }

    return chnStr
  },
  /**
   * 文件大小转字节
   * @param {String} sizeStr 例如： 12.3k, 12kb, 12mb
   */
  convertToByte(sizeStr) {
    let arrUnit = ['B', 'K', 'M', 'G', 'T']
    let str = sizeStr.toUpperCase()
    let unit = str.match(/[a-zA-Z]+$/)
    const size = str.match(/^\d+(\.\d+)?/)
    if (!unit) {
      return size ? size[0] : 0
    }
    unit = unit[0].substr(0, 1)
    let idx = arrUnit.indexOf(unit)
    if (idx === -1) {
      return size ? size[0] : 0
    }
    return size ? size[0] * Math.pow(1024, idx) : 0
  }
}
