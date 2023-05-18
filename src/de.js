//----------------模块变量定义区-------------------
const ONE_DAY_TIME = 86400000;

//----------------函数定义区---------------------

function isLeapYear(y) {
  if (isNaN(y)) throw new Error('isLeap函数参数必须为Number')
  if (y % 100 === 0) return y % 400 === 0
  return y % 4 === 0
}

function getYearDays(y) {
  return isLeapYear(y) ? 366 : 365
}

function getNow() {
  return new Date()
}

//@params baseDate {String} 形如'YYYY-MM-DD'，基准日期
//@params skipDays {Number} 跳转天数
//@returns {Date} 跳转后得到的日期
function skip(baseDate, skipDays){
  baseDate = new Date(baseDate);
  const dateTimes = baseDate.getTime();
  return new Date(dateTimes + (skipDays*ONE_DAY_TIME))
}

function diff(baseDate,targetDate){
  const baseTime = baseDate.getTime();
  const targetTime = targetDate.getTime();
  return (targetTime - baseTime) / ONE_DAY_TIME + 1;
}

function createDateEnhance() {
  return {
    isLeapYear,
    getYearDays,
    getNow,
    skip,
    diff
  }
}
const de = createDateEnhance()
module.exports = de
