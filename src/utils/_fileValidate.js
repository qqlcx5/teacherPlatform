/**
 * Created by user on 2017/9/25.
 */
import _ from 'lodash'
  /**
   * 文件大小验证
   * @param file
   * @param maxSize
   * @param unit
   * @returns {boolean}
   */
export function sizeValidate (file, maxSize, unit = 'KB') {
  let fileSize = file.size
  if (unit === 'KB') {
    return fileSize <= maxSize * 1024
  } else if (unit === 'M') {
    return fileSize <= maxSize * 1024 * 1024
  } else {
    throw new Error('文件大小单位只能为KB或M')
  }
}
export function formatValidate (file, format) {
  let fileName = file.name
  let index = fileName.lastIndexOf('.')
  let suffix = fileName.substr(index + 1).toLowerCase()
  let formatArr = []
  if (_.isArray(format)) {
    formatArr = format
  } else if (_.isString(format)) {
    formatArr = format.split[','].map((item) => {
      item.trim()
    })
  } else {
    throw new Error('不支持的验证格式类型，只能是数组或字符串')
  }
  let result = formatArr.some((item) => {
    return item === suffix
  })
  return result
}
