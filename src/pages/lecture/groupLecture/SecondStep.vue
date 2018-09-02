<template lang="html">
  <div style="display: flex;justify-content: center">
    <div class="group-lecture" v-loading="loading">
      <div class="lecture-detail">
        <div class="lecture-detail-buttons" v-if="isView">
          <el-button style="background-color: #5cadff;" size="small" type="primary" @click="cancel">返回</el-button>
          <el-button style="color: #c07700; background-color: #ffc058;" size="small" @click="gotoDownloadPage">去打印</el-button>
          <a :href="downloadLatexUrl" class="el-button el-button--default el-button--small" style="color: #069d7b; background-color: #63f0d0; text-decoration: none;" size="small">latex导出</a>
        </div>
        <v-title v-if="lectureName" :value="lectureName" :can-edit="!isView" @on-blur="changeLectureName" style="margin-bottom: 30px"/>
        <div v-for="(template, index) in templateList" :key="index">
          <knowledge-introduction v-if="template.key === 'knowledgeIntroModule'" :data="template.value" @refresh="refresh" />
          <knowledge-chartImage v-if="template.key === 'imageModule'" :data="template.value" @refresh="refresh" />
          <knowledge-tablepoint v-if="!loading && template.key === 'tableModule'" :data="template.value" />
          <v-knowledge-detail v-if="template.key === 'pointModule'" :data="template.value" @refresh="refresh" />
          <knowledge-custom v-if="template.key === 'customModule'" :data="template.value" @refresh="refresh" />
        </div>
      </div>
      <div class="right-box" v-if="!isView">
        <v-base-box
          :disabled="disabledFinish"
          :base-info="baseInfo"
          :tree="lectureTemplateTreeList"
          @open-lecture-module="openModuleDialog"
          @change="changebasicInfo"
          @change-property="changeProperty"
          @finish="finishLecture"
          @preview="previewLecture" />
      </div>
    </div>
    <el-dialog class="hi-dialog edit-module-dialog" title="编辑目录"
      :visible="editModuleVisile"
      width="680px" :before-close="handleClose">
      <draggable :list="moduleList" @end="handleDrag" class="module-list">
        <p class="list-group-item" v-for="item of moduleList" :key="item.id">
          <span v-if="!item.edit">{{item.templateName}}</span>
          <el-input
            v-if="item.edit"
            style="width: 84%;"
            placeholder="请输入目录名称"
            v-model="item.templateName"
            clearable
            size="small">
          </el-input>
          <span v-if="!item.edit">
            <el-button type="text" :disabled="isDelDisabled(item)" @click="deleteTemplate(item)">删除</el-button>
            <el-button type="text" @click="editModuleName(item)" :disabled="isDisabled(item)">编辑</el-button>
          </span>
          <span v-if="item.edit">
            <el-button type="text" style="color: #F56C6C;" @click="cancelModuleName(item)">取消</el-button>
            <el-button type="text" style="color: #F56C6C;" @click="updateModuleName(item)">确定</el-button>
          </span>
        </p>
      </draggable>
      <div class="add-actions" style="text-align: center;">
        <el-button v-if="!isExist('知识引入')" size="small" type="warning" icon="el-icon-plus" @click="addKnowledgeIntroduction">添加知识引入</el-button>
        <el-button v-if="!isExist('框图')" size="small" type="warning" icon="el-icon-plus" @click="addBlockDiagram">添加框图</el-button>
        <el-button size="small" type="warning" icon="el-icon-plus" @click="openPointDialog">添加知识点</el-button>
        <el-button size="small" type="warning" icon="el-icon-plus" @click="addCustomTemplate">添加自定义目录</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click.prevent="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleModuleEdit">确 定</el-button>
      </span>
    </el-dialog>
    <KnowledgePointDialog
      :visible.sync="pointDialogVisible"
      :gradeId="baseInfo.gradeId"
      :defaultCheckedKeys="defaultCheckedKeys"
      @handler-select="getTemplatePoints" />
  </div>
</template>

<script>
import http from '@/utils/fetch.js'
import mixin from '@/components/mixins'
import vTitle from './components/title'
import KnowledgeIntroduction from './Introduction.vue'
import KnowledgeChartImage from './ChartImage.vue'
import KnowledgeTablepoint from './TablePoint.vue'
import vBaseBox from './components/baseControl.vue'
import { lecture } from '@/api'
import draggable from 'vuedraggable'
import KnowledgePointDialog from '../detail/add-knowledge-dialog'
import vKnowledgeDetail from '../detail/knowledge'
import KnowledgeCustom from './Custom.vue'

export default {
  name: 'secondStep',
  mixins: [mixin],
  components: {
    draggable,
    vTitle,
    vBaseBox,
    KnowledgeIntroduction,
    KnowledgeChartImage,
    KnowledgeTablepoint,
    KnowledgePointDialog,
    vKnowledgeDetail,
    KnowledgeCustom
  },
  computed: {
    isView() {
      return this.$route.query.type === 'view'
    },
    downloadLatexUrl () {
      return http.defaults.baseURL + `/lecture/${this.$route.params.lectureId}/download/latex`
    }
  },
  data () {
    return {
      loading: false,
      lectureId: this.$route.params.lectureId,
      lectureName: '',
      baseInfo: {
        courseTypeId: '',
        productCode: '',
        gradeId: ''
      },
      lectureTemplateTreeList: [],
      moduleList: [],
      lectureTemplateList: [],
      // lectureMap: Object.create(null),
      editModuleVisile: false,
      pointDialogVisible: false,
      // 这里后台的知识点块 应该有 知识点id
      defaultCheckedKeys: [],
      templateList: [],
      // 正在编辑的目录
      currentModule: {},
      disabledFinish: false,
      // 刚打开编辑目录，记录原始templateIds
      origialLectureTemplateIds: []
    }
  },
  mounted () {
    this.getLectureInfo(this.lectureId)
  },
  methods: {
    gotoDownloadPage () {
      let url = window.location.origin + `/tr/api/lecture/${this.lectureId}/preview`
      window.open(url)
    },
    cancel () {
      this.$router.go(-1)
    },
    refresh() {
      this.getLectureInfo(this.lectureId)
    },
    isExist(name) {
      return this.moduleList.some(item => item.templateName === name)
    },
    openModuleDialog() {
      this.moduleList = this.lectureTemplateTreeList.slice(0)
      this.origialLectureTemplateIds = this.moduleList.map(moduleItem => moduleItem.id)
      this.editModuleVisile = true
    },
    handleClose() {
      this.refresh()
      this.editModuleVisile = false
    },
    async handleModuleEdit(item) {
      let lectureTemplateIds = this.moduleList.map(moduleItem => moduleItem.id)
      // 如果数组的元素不变（数量与位置）
      if (JSON.stringify(this.origialLectureTemplateIds) === JSON.stringify(lectureTemplateIds)) {
        this.editModuleVisile = false
        return
      }
      let res = await lecture.sortTemplate({
        lectureId: this.lectureId,
        lectureTemplateIds: lectureTemplateIds
      })
      if (res.success) {
        this.$message.success(res.message || '排序成功')
        // 刷新 数据
        this.refresh()
        this.editModuleVisile = false
      }
    },
    async getLectureInfo (lectureId) {
      this.loading = true
      let res = await lecture.getLectureInfo(lectureId)
      // 基础数据
      this.baseInfo = {...res.data.lectureBaseInfoVo}
      this.lectureName = this.baseInfo.name
      this.lectureId = res.data.lectureBaseInfoVo.id || ''

      // 讲义目录树
      this.lectureTemplateTreeList = this.addEditToList(res.data.lectureTemplateTreeList)
      this.lectureTemplateList = res.data.lectureTemplateVo.lectureTemplateList
      this.handleLectureTemplates(this.lectureTemplateTreeList, this.lectureTemplateList)
      this.loading = false
    },
    handleLectureTemplates (catalogs, items) {
      this.templateList = []
      catalogs.forEach((catalog, index) => {
        // 这里通过粗略的通过 templateName， generationMethod 来判断 太恶心了
        // USER_ADD: 自定义模块, SYSTEM: 系统预置
        // 若 USER_ADD 目前只存在 描述 || 试题 || 图片（后期考虑）
        // 这里后端存在 没有 contextType
        if (catalog.generationMethod === 'USER_ADD' && catalog.contextType === 'POINT') {
          this.templateList.push({
            key: 'pointModule',
            value: items[index]
          })
        } else {
          if (catalog.generationMethod === 'USER_ADD') {
            this.templateList.push({
              key: 'customModule',
              value: items[index]
            })
          } else {
            if (catalog.templateName === '知识引入') {
              this.templateList.push({
                key: 'knowledgeIntroModule',
                value: items[index]
              })
            } else if (catalog.templateName === '框图') {
              this.templateList.push({
                key: 'imageModule',
                value: items[index]
              })
            } else if (catalog.templateName === '知识清单') {
              this.templateList.push({
                key: 'tableModule',
                value: items[index]
              })
            }
          }
        }
      })
      console.log(this.templateList)
    },
    addEditToList(items) {
      items.forEach(item => {
        item['edit'] = false
        // TODO: 识别 自定与非自定义
        // TODO: 过滤出pointId, 最好不要写在，函数最好职责单一
        if (item.contextType === 'POINT') {
          this.defaultCheckedKeys.push(item.refId)
        }
      })
      return items
    },
    handleDrag (item, a, c) {
      let arr1 = this.moduleList.map(moduleItem => moduleItem.id)
      console.log(arr1)
    },
    isDelDisabled(item) {
      if (item.contextType === 'POINT') {
        return false
      }
      // item.type === 'CUSTOM' 自己添加，在添加后控制该目录为 自定义，支持 删除编辑
      if ((item.contextType === 'GENERAL' && item.generationMethod === 'USER_ADD') || item.type === 'CUSTOM') {
        return false
      }
      return true
    },
    isDisabled(item) {
      // item.type === 'CUSTOM' 自己添加，在添加后控制该目录为 自定义，支持 删除编辑
      if ((item.contextType === 'GENERAL' && item.generationMethod === 'USER_ADD') || item.type === 'CUSTOM') {
        return false
      }
      return true
    },
    // 添加自定义目录
    addCustomTemplate() {
      this.moduleList.push({templateName: '', edit: true, type: 'CUSTOM'})
    },
    editModuleName(item) {
      item['edit'] = true
      this.currentModule = Object.assign({}, item)
    },
    // 更新目录
    async updateModuleName(item) {
      // 这里只能写15个字
      if (this.codePointLength(item.templateName) > 15) {
        this.$message.error('字数最多15个字')
        return
      }
      // 这里分为 自定义模块 。。。
      let params = {}
      if (item.id) {
        params = {
          templateId: item.id,
          name: item.templateName
        }
        try {
          let res = await lecture.controlTemplateVisible(params)
          if (res.success) {
            item.edit = false
            item = Object.assign(item, res.data)
          }
        } catch (e) {
          this.$message.error(e.message || '')
        }
      } else {
        params = {
          lectureId: this.lectureId,
          name: item.templateName
        }
        try {
          let res = await lecture.addCustomTemplate(params)
          if (res.success) {
            item.edit = false
            item = Object.assign(item, res.data)
          }
        } catch (e) {
          this.$message.error(e.message || '')
        }
      }
    },
    // 取消添加目录
    cancelModuleName(item) {
      // 这里根据item.id 来判定 取消 操作
      if (item.id) {
        // 说明目录已存在
        item.templateName = this.currentModule.templateName
        item.edit = false
        this.currentModule = {}
      } else {
        item.templateName = ''
        // 编辑情况 如果是自定义，根据id 来确定位置，然后删除
        // let idx = this.moduleList.indexOf(item)
        this.moduleList.pop()
      }
    },
    // 添加知识点框图
    async addBlockDiagram() {
      try {
        let res = await lecture.addBlockDiagram({lectureId: this.lectureId})
        if (res.success) {
          this.$message.success('添加成功')
          this.moduleList.push({templateName: '知识框图', edit: false, type: 'SYSTEM'})
        }
      } catch (e) {
        this.$message.error(e.message || '请求失败')
      }
    },
    // 添加知识点引入
    async addKnowledgeIntroduction() {
      try {
        let res = await lecture.addKnowledgeIntroduction({lectureId: this.lectureId})
        if (res.success) {
          this.$message.success('添加成功')
          this.moduleList.push({templateName: '知识框图', edit: false, type: 'SYSTEM'})
        }
      } catch (e) {
        this.$message.error(e.message || '请求失败')
      }
    },
    openPointDialog() {
      if (this.moduleList.length) {
        this.defaultCheckedKeys = []
        this.moduleList.forEach(item => {
          if (item.contextType === 'POINT') {
            this.defaultCheckedKeys.push(item.refId)
          }
        })
      }
      this.pointDialogVisible = true
    },
    getTemplatePoints(items) {
      let needAddpoints = []
      let points = items.map(item => item.pointId + '')
      points.forEach(p => {
        if (!this.defaultCheckedKeys.includes(p)) {
          needAddpoints.push(p)
        }
      })
      if (needAddpoints.length === 0) {
        return
      }
      this.addPointTemplate(needAddpoints)
    },
    async addPointTemplate(points) {
      let params = {
        lectureId: this.lectureId,
        pointIds: points
      }
      try {
        let res = await lecture.addPointTemplate(params)
        if (res.success) {
          this.$message.success(res.message)

          this.moduleList = this.moduleList.concat(res.data)
        }
      } catch (e) {
        this.$message.error(e.message || '添加知识点模块失败')
      }
    },
    async changebasicInfo(basicInfo) {
      try {
        let res = await lecture.updateLectureBasicinfo(this.baseInfo)
        if (res.success) {
          this.$message.success(res.message || '更新成功')
        }
      } catch (e) {
        this.$message.error(e.message || '更新失败')
      }
    },
    async changeProperty(item) {
      try {
        let params = {
          hidden: !item.hidden,
          name: item.templateName,
          templateId: item.id
        }
        let res = await lecture.controlTemplateVisible(params)
        if (res.success) {
          this.refresh()
        }
      } catch (e) {
        this.$message.error(e.message || '操作失败')
      }
    },
    // 保存更新 基础数据
    async changeLectureName(name) {
      try {
        if (!name) {
          this.$message.error('讲义名称不能为空...')
          this.disabledFinish = true
          return
        }
        if (this.codePointLength(name) > 64) {
          this.$message.error('讲义名称不能超过64个字')
          this.disabledFinish = true
          return
        }
        this.baseInfo.name = name
        let res = await lecture.updateLectureBasicinfo(this.baseInfo)
        if (res.success) {
          this.disabledFinish = false
          this.$message.success(res.message || '更新成功')
        }
      } catch (e) {
        this.$message.error(e.message || '更新失败')
      }
    },
    async deleteTemplate(item) {
      if (item.contextType === 'POINT') {
        this.deletePointTemplate(item)
      } else {
        this.deleteCustomTemplate(item)
      }
    },
    async deletePointTemplate(item) {
      this.$confirm(`讲义中知识点<span style="color: #e6a23c;">【${item.templateName}】</span>关联的描述,试题,总结也会删除, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        lecture.deleteTemplate(item.id).then((res) => {
          if (res.success) {
            this.handleRemoveTemplate(item.id)
            let onlyOnePointModule = function (items) {
              let arr = items.filter(item => item.contextType === 'POINT')
              return arr.length === 0
            }
            // 如果这是最后一个知识点，则需要删除知识清单
            if (onlyOnePointModule(this.moduleList)) {
              this.handleRemoveTablepointFromModuleList()
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async deleteCustomTemplate(item) {
      try {
        await this.$confirm(`讲义中<span style="color: #e6a23c;">【${item.templateName}】</span>关联的描述，试题也会删除，是否继续？`, '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        let res = await lecture.deleteTemplate(item.id)
        if (res.success) {
          this.handleRemoveTemplate(item.id)
        }
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    },
    handleRemoveTemplate(id) {
      let idx = this.moduleList.findIndex(item => item.id === id)
      this.moduleList.splice(idx, 1)
    },
    handleRemoveTablepointFromModuleList() {
      let idx = this.moduleList.findIndex(item => item.templateName === '知识清单')
      this.moduleList.splice(idx, 1)
    },
    // 差集
    difference(a, b) {
      return a.concat(b).filter(v => !a.includes(v) || !b.includes(v))
    },
    async finishLecture() {
      try {
        await lecture.save(this.lectureId)
        this.$router.push({
          name: 'lecture_index'
        })
      } catch (e) {
        this.$message.error(e.message || '保存失败')
      }
    },
    previewLecture () {
      this.$router.push({
        name: 'PreviewLecture',
        params: {
          lectureId: this.lectureId
        },
        query: {...this.$route.query, type: 'view'}
      })
    }
  }
}
</script>

<style lang="less">
.group-lecture {
  display: inline-flex;
  margin: 0 auto;
  .lecture-detail {
    width: 210mm;
    min-height: 297mm;
    padding: 20px;
    background: #fff;
  }
  .right-box {
    width: 322px;
    margin-left: 30px;
  }
}
.mb-30{
  margin-bottom: 30px;
}
  .lecture-detail-buttons {
    position: relative;
    top: -20px;
    right: 0;
    text-align: right;
  }
.list-group-item {
  border: 1px solid #eee;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    padding: 0px;
  }
}
</style>
