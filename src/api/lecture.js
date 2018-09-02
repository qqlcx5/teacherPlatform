import fetch from '@/utils/fetch'

export default {
  lectureList(params) {
    return fetch.post(`/lecture/list`, params)
  },
  deleteLeture(id) {
    return fetch.delete(`/lecture/${id}`)
  },
  getDictionary({ type, subjectId, periodId, needUnchecked }) {
    return fetch.get(`/dict/selector/list?type=${type}&needUnchecked=${needUnchecked}`)
  },
  // 获取完全版知识点树
  getTree() {
    return fetch.get(`/point/tree`)
  },
  // 根据年级筛选 知识点树
  getPointTree({ gradeId }) {
    return fetch.get(`/point/tree/${gradeId}`)
  },
  // 只用于讲义编辑知识点树
  getLecturePointTree({ lectureId }) {
    return fetch.get(`/lecture/${lectureId}/point/tree`)
  },
  // 获取 知识点设定 -> 知识点 列表
  getPointRequire({ pointIds }) {
    return fetch.get(`/lecture/point/require?pointIds=${pointIds}`)
  },
  // 创建讲义： 这里对应是创建讲义第一步，应该我们后台采用异步保存
  create(params) {
    return fetch.post(`/lecture`, params)
  },
  // 获取 讲义详情
  fetch({ lectureId }) {
    return fetch.get(`/lecture/${lectureId}/edit`)
  },
  // 根据知识点 获取知识引入 PREFACE || 知识总结 SUMMARY
  getExplainByPointId({ pointId, type }) {
    return fetch.get(`/lecture/point/${pointId}/explain/${type}`)
  },
  // 更新 引入与框图
  updateExplain(params) {
    return fetch.post(`/lecture/explain`, params)
  },
  // 更新知识点描述/总结
  updatePointDesc(params) {
    return fetch.post(`lecture/point/describe/summary`, params)
  },
  // 组讲义第四步 上移题目
  moveUp({ templateId }) {
    return fetch.put(`/lecture/item`, { templateId, sortType: 'up' })
  },
  // 组讲义第四步 下移题目
  moveDown({ templateId }) {
    return fetch.put(`/lecture/item`, { templateId, sortType: 'down' })
  },
  deleteItem({ lectureId, templateId }) {
    return fetch.delete(`/lecture/item?lectureId=${lectureId}&templateId=${templateId}`)
  },
  // 讲义保存
  save(lectureId) {
    return fetch.post(`/lecture/${lectureId}`)
  },
  // 搜索题目 for 第四步 添加例题与练习题
  getLectureItemList(params) {
    return fetch.post('/lecture/item/list', params)
  },
  // 添加 题目
  addItem({ itemId, lectureId, pointId, type }) {
    return fetch.post('/lecture/item', { itemId, lectureId, pointId, type })
  },
  // 移除 题目
  removeItem({ lectureId, templateId }) {
    return fetch.delete(`/lecture/item?lectureId=${lectureId}&templateId=${templateId}`)
  },
  /**
   * 我的知识点引入
   */
  createPrefaceExplain({ pointId, type }) {
    return fetch.post('/point/explain', { pointId, type })
  },
  getPointExplain({ id, type }) {
    return fetch.get(`/point/explain/displayMyPointExplain?pointId=${id}&type=${type}`)
  },
  updatePrefaceExplain({ id, content }) {
    return fetch.put('/point/explain', { id, content })
  },
  // 讲义概览
  overview({ lectureId }) {
    return fetch.get(`/lecture/overView?lectureId=${lectureId}`)
  },
  clearAllItems({ lectureId }) {
    return fetch.delete(`/lecture/item/cleanPointItem?lectureId=${lectureId}`)
  },
  clearItem({ lectureId, pointId }) {
    return fetch.delete(`/lecture/item/cleanPointItem?lectureId=${lectureId}&pointId=${pointId}`)
  },
  // 预览教义
  showLecture(id) {
    return fetch.get(`/lecture/showLecture?lectureId=${id}`)
  },
  // 讲义库 列表
  getLectureLibList(params) {
    return fetch.post(`/lecture/lib/list`, params)
  },
  // 复制讲义
  copyLecture({ lectureId, source }) {
    return fetch.post(`/lecture/${lectureId}/copy?source=${source}`)
  },
  // 分享讲义
  shareLecture(lectureId) {
    return fetch.put(`/lecture/${lectureId}/share`)
  },
  // 发布讲义
  publishLecture({ lectureId }) {
    return fetch.put(`/lecture/${lectureId}/publish`)
  },
  // 获取讲义套件
  getLectureSuite(params) {
    return fetch.post(`/lecturesuit/list`, params)
  },
  // 复制讲义套件
  copyLectureSuite(lecturesuitId) {
    return fetch.post(`/lecturesuit/${lecturesuitId}/copy`)
  },
  // 发布讲义套件
  pubilshLectureSuite(lecturesuitId) {
    return fetch.put(`/lecturesuit/${lecturesuitId}/publish`)
  },
  // 删除讲义套件
  delLectureSuite(lecturesuitId) {
    return fetch.delete(`/lecturesuit/${lecturesuitId}`)
  },
  // 创建讲义套件
  createLectureSuite(params) {
    return fetch.post('/lecturesuit', params)
  },
  // 课次绑定讲义套件
  courseBindLectureSuite(params) {
    return fetch.post('/user/schedule/lectureSuit/bind', params)
  },
  // 课次解绑讲义套件
  courseUnbindLectureSuite(bindRecordId) {
    return fetch.put(`/user/schedule/lectureSuit/unbound/${bindRecordId}`)
  },
  // 获取讲义套件详情
  getLectureSuiteDetail(lecturesuitId) {
    return fetch.get(`/lecturesuit/${lecturesuitId}`)
  },
  // 获取讲义套件教学步骤
  getLectureSuiteSteps() {
    return fetch.get(`/lecturesuit/teachingsteps`)
  },
  // 删除讲义套件中的教学步骤模块
  delLectureSuiteTemplate(templateId) {
    return fetch.delete(`/lecturesuit/template/${templateId}`)
  },
  // 添加讲义套件模块
  addLectureSuiteTemplate(params) {
    return fetch.post('/lecturesuit/template', params)
  },
  // 获取讲义套件可绑定讲义列表
  getLectureSuiteBandingLecture(params) {
    return fetch.post('/lecturesuit/lecture/binding/list', params)
  },
  // 获取讲义套件可绑定的试卷列表
  getLectureSuiteBandingPaper(params) {
    return fetch.post('/lecturesuit/paper/binding/list', params)
  },
  // 绑定讲义套件
  bindLectureSuite(params) {
    return fetch.put('/lecturesuit/template/bind', params)
  },
  // 更新讲义套件名称
  updateLectureSuiteName(params) {
    return fetch.put('/lecturesuit', params)
  },
  // 更新讲义套件
  updateLectureSuite(lecturesuitId) {
    return fetch.put(`/lecturesuit/${lecturesuitId}/submit`)
  },
  // 编辑试题 题号与分数 复合题
  subItemShowNoAndScore ({parentTemplateId, parentShowNo, itemScores}) {
    return fetch.put(`/lecture/item/subItemShowNoAndScore?parentTemplateId=${parentTemplateId}&parentShowNo=${parentShowNo}`, {itemScores})
  },
  // 编辑试题 题号与分数 简单题
  showNoAndScore ({templateId, showNo, itemScore}) {
    return fetch.put(`/lecture/item/showNoAndScore?templateId=${templateId}&showNo=${showNo}&itemScore=${itemScore}`)
  },
  // 获取知识点对应的考试要求
  getLecturePointRequire(pointIds) {
    return fetch.get(`/lecture/point/require?pointIds=${pointIds}`)
  },
  // 1.5.1 讲义api
  getLectureInfo(lectureId) {
    return fetch.get(`/lecture/new/${lectureId}`)
  },
  // 新增讲义基础信息
  createLectureBasicinfo (params) {
    return fetch.post(`/lecture/new`, params)
  },
  // 更新基础信息
  updateLectureBasicinfo(params) {
    return fetch.put(`/lecture/new`, params)
  },
  // 目录排序
  sortTemplate(params) {
    return fetch.put(`/lecture/new/templateSort`, params)
  },
  // 删除目录
  deleteTemplate(id) {
    return fetch.delete(`/lecture/new/template/${id}`)
  },
  // 隐藏显示目录
  controlTemplateVisible(params) {
    return fetch.put(`/lecture/new/templateProperty`, params)
  },
  // 添加框图目录
  addBlockDiagram(params) {
    return fetch.post(`/lecture/new/${params.lectureId}/addBlockDiagram`)
  },
  // 添加知识引入
  addKnowledgeIntroduction(params) {
    return fetch.post(`/lecture/new/${params.lectureId}/addKnowledgeIntroduction`)
  },
  addPointTemplate(params) {
    return fetch.post(`/lecture/new/${params.lectureId}/addPointTemplate`, params)
  },
  // 添加自定义目录
  addCustomTemplate(params) {
    return fetch.post(`/lecture/new/${params.lectureId}/addCustomTemplate`, params)
  },
  // 查询知识点的描述和总结
  getKnwoledgeDesAndSummary(lectureId, pointId) {
    return fetch.get(`/lecture/new/${lectureId}/point/${pointId}/getDescribeAndSummary`)
  },
  // 保存知识点描述
  updateKnowledgeDes(params) {
    return fetch.post('/lecture/new/point/saveDescribe', params)
  },
  // 保存知识总结
  updateKnowledgeSummary(params) {
    return fetch.post('/lecture/new/point/saveSummary', params)
  },
  // 删除目录
  removeTemplate(templateId) {
    return fetch.delete(`/lecture/new/template/${templateId}`)
  },
  // 讲义目录排序
  sortLectureTemplate(parmas) {
    return fetch.put('/lecture/new/templateSort', parmas)
  },
  // 添加例题
  addLectureQu(params) {
    return fetch.post('/lecture/new/point/addItem', params)
  },
  // 框图添加修改
  updateImage(params) {
    return fetch.put(`/lecture/new/image/edit`, params)
  },
  // 编辑富文本
  updateRichText(params) {
    return fetch.put(`/lecture/new/richText/edit`, params)
  },
  // 新增富文本
  addRichText(params) {
    return fetch.post(`/lecture/new/knowledgeIntroduction/addRichText`, params)
  },
  // 添加自定义试题
  addCustomItem(params) {
    return fetch.post(`/lecture/new/customTemplate/addItem`, params)
  },
  // 新增框图图片
  addImage(params) {
    return fetch.post(`/lecture/new/blockDiagram/save`, params)
  },
  // 自定义目录添加富文本
  addCustomRichText(params) {
    return fetch.post(`/lecture/new/customTemplate/addRichText`, params)
  },
  // 重置题号
  resetItemShowNo(templateId) {
    return fetch.put(`/lecture/new/template/${templateId}/resetItemShowNo`)
  },
  // 添加双师自定义富文本 1.5.2
  addCustomText(params) {
    return fetch.post(`/lecture/new/customTemplate/addMaterialText`, params)
  }
}
