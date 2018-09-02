import fetch from '@/utils/fetch'

export default {
  getCourseList(params) {
    return fetch.post(`/user/course/list`, params)
  },
  getCourseDetail({ courseId, productLine }) {
    return fetch.get(`/user/course?courseId=${courseId}&productLine=${productLine}`)
  },
  getPartialDoubleTeacherCourseList({ mtCourseId }) {
    return fetch.get(`/user/course/doubleTeacher/${mtCourseId}/list`)
  },
  // 课次绑定讲义套件
  bindLectureSuite(params) {
    return fetch.post('/user/course/bind', params)
  },
  // 课次解除绑定
  unbindLectureSuite(bindRecordId) {
    return fetch.put(`/user/course/unbind/${bindRecordId}`)
  },
  // 获取课次绑定信息
  getCourseBindInfo(bindRecordId) {
    return fetch.get(`/user/course/${bindRecordId}/show`)
  },
  // 更新课次模块时间
  updateCourseTime(id, startTime, endTime) {
    return fetch.put('/user/course/update/module/time', { id, startTime, endTime })
  }
}
