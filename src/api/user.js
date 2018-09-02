import fetch from '@/utils/fetch'

export default {
  // 获取用户权限
  getPermission() {
    return fetch.get('/permission')
  },
  // 获取用户路由
  getRoutes() {
    return fetch.get('/routes')
  },
  // 科目年段地区面板数据查询，修改
  userSgr: {
    get() {
      return fetch.get('/user/userOperate')
    },
    put(params) {
      return fetch.put('/user/userOperate', params)
    }
  },
  // 获取我的日程表
  getSchedule(startDate, endDate) {
    return fetch.get('/user/schedule', { params: { startDate, endDate } })
  },
  // 获取用户信息
  getUserInfo() {
    return fetch.get('/user')
  },
  // 课程绑定/解绑讲义
  bindLecture(lectureId, courseId, attendanceId, bindFlag = true) {
    return fetch.post(`/user/schedule/lecture/bind`, { lectureId, courseId, attendanceId, bindFlag })
  },
  // 讲义列表
  getLectureList(params) {
    return fetch.post('/user/schedule/lecture/binding/list', params)
  },
  // 获取讲义
  getLecture(lectureId) {
    return fetch.get('/user/schedule/lecture', { params: { lectureId } })
  },
  // 获取日程表的年级列表
  getGradeList(gradeId) {
    return fetch.get('/user/schedule/grade/list', { params: { gradeId } })
  }
}
