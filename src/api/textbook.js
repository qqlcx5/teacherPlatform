import fetch from '@/utils/fetch'

export default {
  list: {
    get(params) {
      return fetch.post('/textbook/list', params)
    }
  },
  chapterList: {
    get(textBookId) {
      return fetch.get(`/textbook/${textBookId}/chapter/list`)
    }
  },
  chapterDetail: {
    get(chapterId) {
      return fetch.get(`/textbook/chapter/${chapterId}/lecture`)
    }
  },
  // 获取精品教材详情
  getChapterDetail(textBookId) {
    return fetch.get(`/textbook/${textBookId}/preview`)
  },
  // 获取精品教材绑定的课件列表
  getChapterCourseware(chapterId) {
    return fetch.get(`/textbook/chapter/${chapterId}/courseware/list`)
  },
  // 获取章节视频
  getVideos(chapterId, videoType) {
    return fetch.get(`/textbook/chapter/${chapterId}/video/${videoType}`)
  },
  // 根据章节获取讲义
  getChapterLecture(chapterId) {
    return fetch.get(`/textbook/chapter/${chapterId}/lecture/preview`)
  },
  // 根据章节ID获取视频
  getChapterVideo(id) {
    return fetch.get(`/courseware/playUrl`, { params: { coursewareId: id } })
  },
  // 获取讲义基本信息
  getLectureBasicinfo(id) {
    // return fetch.get(`/lecture/getBaseInfo/${id}`)
    return fetch.get(`/textbook/chapter/getCopyBaseInfo/${id}`)
  },
  // 复制精品教材讲义
  copyLecture(oldLectureId, params) {
    return fetch.post(`/textbook/chapter/copyLecture/${oldLectureId}`, params)
  },
  // 新增章节
  createTextbookChapter(params) {
    return fetch.post('/doubleTeacher/textbook/chapter', params)
  },
  // 更新章节
  updateTextbookChapter(params) {
    return fetch.put('/doubleTeacher/textbook/chapter', params)
  },
  // 删除章节
  removeTextbookChapter(id) {
    return fetch.delete(`/doubleTeacher/textbook/chapter/${id}`)
  },
  // 创建双师教材
  createTextbook(params) {
    return fetch.post('/doubleTeacher/textbook', params)
  },
  // 删除双师教材
  removeTextbook(id) {
    return fetch.delete(`/doubleTeacher/textbook/${id}`)
  },
  // 教材中获取讲义套件列表
  getLectureList(chapterId, pageSize, currentPage) {
    return fetch.get('/doubleTeacher/textbook/chapter/lecturesuit/page', {
      params: {
        chapterId,
        pageSize,
        currentPage
      }
    })
  },
  // 获取讲义套件概览
  getLectureSuiteDetail(textbookId, chapterId) {
    return fetch.get('/doubleTeacher/textbook/chapter/lecturesuit', { params: { chapterId, textbookId } })
  },
  // 创建讲义套件提交
  createLectureSuiteToChapter(params) {
    return fetch.post('/doubleTeacher/textbook/chapter/lecturesuit', params)
  },
  // 双师教材获取素材列表
  getDTextbookMaterialList(params) {
    return fetch.post('/doubleTeacher/textbook/chapter/material/page', params)
  },
  // 添加双师素材
  addDTextbookMaterial(params) {
    return fetch.post('/doubleTeacher/textbook/chapter/material', params)
  },
  removeDTextbookMaterial(chapterMaterialId) {
    return fetch.delete(`/doubleTeacher/textbook/chapter/material/${chapterMaterialId}`)
  },
  // 编辑双师素材
  updateDTextbookMaterial(params) {
    return fetch.put(`/doubleTeacher/textbook/chapter/material`, params)
  },
  // 查询双师素材详情
  getDTextbookMaterialDetail(chapterMaterialId) {
    return fetch.get(`/doubleTeacher/textbook/chapter/material/${chapterMaterialId}`)
  },
  // 编辑教材
  editTextbook(textBookId) {
    return fetch.get(`/textbook/${textBookId}/preview`)
  }
}
