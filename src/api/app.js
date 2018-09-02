import fetch from '@/utils/fetch'

export default {
  // 获取选择器基础数据
  selector: {
    get(type, needUnchecked = true) {
      return fetch.get('/dict/selector/list', { params: { type, needUnchecked } })
    }
  },
  // 知识点树
  knowledgeTree: {
    get(gradeId) {
      return fetch.get(`/point/tree/${gradeId}`)
    }
  },
  /**
   * 上传图片
   * @param {String} fileName 文件名称
   * @param {String} imgBase64Str Base64格式图片字符串
   */
  uploadImg(fileName, imgBase64Str) {
    return fetch.post('/common/upload/image-base64', {fileName, imgBase64Str})
  },
  getManageUrl() {
    return fetch.get(`/common/manage-url`)
  }
}
