import fetch from '@/utils/fetch'

export default {
  // 查询章节讲义页签的内容
  getLecture(chapterId, tagType) {
    return fetch.get(`/doubleTeacher/textbook/chapter/${chapterId}/lectureTag/${tagType}`)
  },
  // 创建章节下指定页签下的讲义
  // tagType: MAIN_TEACHING_CASE | PREPARATION | CLASS_INTERACTION | POST_TEST | ENTRANCE_TEST | STUDENT_TEXTBOOK
  // 分别对应： 主师教案, 预习及预测, 课中互动题, 课后测, 入门测, 学生教材
  createLecture(chapterId, tagType) {
    return fetch.post(`/doubleTeacher/textbook/chapter/${chapterId}/lectureTag/${tagType}`)
  },
  // 组讲义 素材题目列表 查询
  // params: currentPage, pageSize, searchContent, textbookChapterId, lectureId
  getMaterialItems(params) {
    return fetch.post(`/lecture/new/doubleTeacher/materialItem/page`, params)
  },
  // 素材文本列表
  getMaterialText(params) {
    return fetch.post(`/lecture/new/doubleTeacher/materialText/page`, params)
  },
  // 复制讲义
  copyLectureTo(params) {
    return fetch.put(`/doubleTeacher/textbook/chapter/${params.id}/copy?lectureId=${params.lectureId}&lectureType=${params.lectureType}`)
  },
  // 升级讲义
  upgradeLecture(params) {
    return fetch.put(`doubleTeacher/textbook/chapter/${params.id}/upgrade?lectureId=${params.lectureId}&tagType=${params.tagType}`)
  },
  // 试卷列表查询
  getPaperList(params) {
    return fetch.post(`/doubleTeacher/textbook/chapter/material/paper/page`, params)
  },
  // 根据试卷id获取试题列表
  getItemList(textbookChapterId, paperId) {
    return fetch.get(`/doubleTeacher/textbook/chapter/material/${textbookChapterId}/${paperId}/item`)
  },
  // 素材库 关联题目
  // relateItemToMatter(params) {
  //   return fetch.post(`/doubleTeacher/textbook/chapter/material/item/related`, params)
  // },
  relateItemsToMatter(params) {
    return fetch.post(`/doubleTeacher/textbook/chapter/material/item/related`, params)
  },
  // 素材库 题目列表
  getMatterialLibraryItemsList(params) {
    return fetch.post(`/doubleTeacher/textbook/chapter/material/item/page`, params)
  },
  // 素材库 题目删除
  delMatterialLibraryItem(id) {
    return fetch.delete(`/doubleTeacher/textbook/chapter/material/${id}/item`)
  },
  getQuDetail (itemId) {
    return fetch.get(`/item/detail/${itemId}`)
  }
}
