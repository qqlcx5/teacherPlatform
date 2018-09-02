<template lang="html">
  <div class="material">
    <div class="main-content" v-loading="loading">
      <div class="main-content__detail">
        <v-title v-if="lectureName" :value="lectureName" :can-edit="false" style="margin-bottom: 30px"/>
        <div v-if="templateList.length" v-for="(item, index) in templateList" :key="index">
          <v-custom :data="item" :key="item.id" @refresh="refresh" />
        </div>
      </div>
      <div class="main-content__operation">
        <v-operate-box
          title="讲义目录"
          :tree="lectureTemplateTreeList"
          @open-module-dialog="openModuleDialog"
          @change-property="changeProperty"
          @finish="save" />
      </div>
    </div>
    <v-module-dialog
      :visible.sync="moduleDialogVisible"
      :data="moduleList"
      @close="closeModuleDialog"
      @submit="submitModuleDialog" />
  </div>
</template>

<script>
import vTitle from '@/components/title'
import vOperateBox from './components/operate-box'
import vModuleDialog from './components/module-dialog'
import vCustom from './components/custom'
// import { lectureInfo } from './components/mockData'
import lectureService from '@/api/lecture'

export default {
  name: 'materialIndex',
  components: {
    vTitle,
    vOperateBox,
    vModuleDialog,
    vCustom
  },
  computed: {
    chapterId() {
      return this.$route.params.chapterId
    },
    lectureId() {
      return this.$route.params.lectureId
    }
  },
  provide() {
    return {
      chapterId: this.$route.params.chapterId,
      lectureId: this.$route.params.lectureId
    }
  },
  data () {
    return {
      loading: false,
      moduleDialogVisible: false,
      lectureTemplateTreeList: [],
      moduleList: [],
      templateList: [],
      lectureTemplateList: [],
      lectureName: '',
      // 刚打开编辑目录，记录原始templateIds, 以供比较，如果排序没有目录的数量与id改变都不会进行排序
      origialLectureTemplateIds: [],
      error: false
    }
  },
  methods: {
    refresh() {
      this.getLectureInfo(this.lectureId)
    },
    openModuleDialog() {
      this.moduleList = this.lectureTemplateTreeList.slice(0)
      this.origialLectureTemplateIds = this.moduleList.map(moduleItem => moduleItem.id)
      this.moduleDialogVisible = true
    },
    closeModuleDialog() {
      this.moduleDialogVisible = false
    },
    async getLectureInfo (lectureId) {
      try {
        this.loading = true
        let res = await lectureService.getLectureInfo(lectureId)
        let lecture = res.data
        // 基础数据
        // this.baseInfo = {...res.data.lectureBaseInfoVo}
        // this.lectureName = this.baseInfo.name
        // this.lectureId = res.data.lectureBaseInfoVo.id || ''

        // 讲义目录树
        // this.lectureTemplateTreeList = this.addEditToList(res.data.lectureTemplateTreeList)
        // this.lectureTemplateList = res.data.lectureTemplateVo.lectureTemplateList
        // this.handleLectureTemplates(this.lectureTemplateTreeList, this.lectureTemplateList)

        this.baseInfo = lecture.lectureBaseInfoVo
        this.lectureName = this.baseInfo.name
        // this.lectureId = this.baseInfo.id || ''
        this.lectureTemplateTreeList = this.addEditPropertyToListItem(lecture.lectureTemplateTreeList)
        // this.lectureTemplateTreeList = lecture.lectureTemplateTreeList
        this.templateList = lecture.lectureTemplateVo.lectureTemplateList
        this.error = false
      } catch (e) {
        this.$message.error(e)
        this.error = true
      } finally {
        this.loading = false
      }
    },
    // 添加 ‘edit’ 属性，以便 控制编辑状态
    addEditPropertyToListItem(items) {
      items.forEach(item => {
        item['edit'] = false
      })
      return items
    },
    // 编辑目录dialog提交
    async submitModuleDialog(moduleList) {
      let lectureTemplateIds = this.moduleList.map(moduleItem => moduleItem.id)
      // 如果数组的元素不变（数量与位置）简单判断
      if (JSON.stringify(this.origialLectureTemplateIds) === JSON.stringify(lectureTemplateIds)) {
        this.moduleDialogVisible = false
        return
      }
      let res = await lectureService.sortTemplate({
        lectureId: this.lectureId,
        lectureTemplateIds: lectureTemplateIds
      })
      if (res.success) {
        this.$message.success(res.message || '排序成功')
        // 刷新 数据
        this.refresh()
        this.moduleDialogVisible = false
      }
    },
    // 右边操作控制 内容的展示
    async changeProperty(item) {
      try {
        let params = {
          hidden: !item.hidden,
          name: item.templateName,
          templateId: item.id
        }
        let res = await lectureService.controlTemplateVisible(params)
        if (res.success) {
          this.refresh()
        }
      } catch (e) {
        this.$message.error(e.message || '操作失败')
      }
    },
    // 保存讲义
    async save() {
      try {
        await lectureService.save(this.lectureId)
        this.$router.push({
          name: 'DTextBook_detail',
          params: {
            id: this.$route.params.id
          }
        })
      } catch (e) {
        this.$message.error(e.message || '保存失败')
      }
    }
  },
  mounted () {
    this.getLectureInfo(this.lectureId)
  }
}
</script>

<style lang="less" scoped>
.material {
  display: flex;
  justify-content: center;
  .main-content {
    display: inline-flex;
    margin: 0 auto;

    &__detail {
      width: 210mm;
      min-height: 297mm;
      padding: 20px;
      background: #fff;
    }

    &__operation {
      width: 322px;
      margin-left: 30px;
    }
  }
}
</style>
