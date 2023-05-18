const _ = require('lodash')

function getTimeMap(date) {
  return {
    Y: _.toString(date.getFullYear()),
    M: add0(date.getMonth() + 1),
    D: add0(date.getDate()),
    h: add0(date.getHours()),
    m: add0(date.getMinutes()),
    s: add0(date.getSeconds()),
    // w : add0(d.getDay()),//0~6 周一~周六
    // W : getWeekNum(),//当前年份第x周
  }
}

function add0(v) {
  return v > 9 ? _.toString(v) : `0${v}`
}

function transDate(fmt, date) {
  if (!_.isDate(date)) return '-'
  const timeMap = getTimeMap(date)
  let result = ''
  let char = ''

  for (let i = 0; i < fmt.length; i++) {
    switch ((char = fmt.charAt(i))) {
      case 'Y':
      case 'M':
      case 'D':
      case 'h':
      case 'm':
      case 's':
        result = result.concat(timeMap[char])
        break
      default:
        result = result.concat(char)
        break
    }
  }

  return result
}

const df = _.curry(transDate)
module.exports = df
