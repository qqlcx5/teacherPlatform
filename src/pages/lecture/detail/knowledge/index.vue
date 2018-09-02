<template>
  <div class="lecture-detail-knowledge">
    <v-content-extand :show-btn="!isView" style="padding-left: 0px;" v-if="!data.hidden">
      <template slot="btns">
        <span class="m-content-expand__btn" @click="opedAddDesDialog">添加描述</span>
        <span class="m-content-expand__btn" @click="showAddQuDialog">添加试题</span>
        <span class="m-content-expand__btn" v-if="quList && quList.children && quList.children.length > 0" @click="resetShowNo">重置题号</span>
        <span class="m-content-expand__btn" :class="{'disable': showAddSummaryBtn}" @click="addKnowledgeSummary">添加总结</span>
      </template>
      <div class="knowledge-name cat-name">
        <i class="lecture-icon iconfont icon-biaoqian1"></i>
        <span style="padding-left: 5px;">{{data.templateName}}</span>
      </div>
    </v-content-extand>
    <div class="lecture-detail-knowledge-content" v-if="showDetail && !data.hidden">
      <!-- 描述 -->
      <div class="lecture-detail-knowledge__label" v-if="desList && !desList.hidden">
        <span>描述</span>
      </div>
      <v-content-extand :show-btn="!isView" v-if="desList && !desList.hidden && desList.children && desList.children.length">
        <template slot="btns">
          <span class="m-content-expand__btn" @click="opedAddDesDialog">编辑描述</span>
        </template>
        <v-knowledge-des :data="desList.children" />
      </v-content-extand>
      <!-- 例题 -->
      <div class="lecture-detail-knowledge__label" v-if="quList && !quList.hidden">
        <span>例题</span>
      </div>
      <div class="qu-list" style="margin-top: 15px" v-if="quList && !quList.hidden && quList.children && quList.children.length">
        <v-question-list :lecture-id="lectureId" :data="quList.children" @on-set="setScore" :readonly="isView" />
      </div>
      <!-- 总结 -->
      <div class="lecture-detail-knowledge__label" v-if="summary && !summary.hidden">
        <span>总结</span>
      </div>
      <v-content-extand style="margin-top: 15px" :show-btn="!isView" v-if="summary && !summary.hidden && summary.children && summary.children[0].pointExplainVo && summary.children[0].pointExplainVo.content">
        <template slot="btns">
          <span class="m-content-expand__btn" @click="delKnowledgeSummary">删除总结</span>
        </template>
        <v-knowledge-summary :data="summary.children[0].pointExplainVo.content" v-if="summary && summary.children && summary.children[0].pointExplainVo && summary.children[0].pointExplainVo.content" />
      </v-content-extand>
    </div>

    <v-add-qu-dialog :visible.sync="addQuDialogVisible" :lecture-id="lectureId" :point-id="pointId" @on-finish="finishAddQu" @add-qu="addQu" />
    <v-add-knowledge-des-dialog :visible.sync="addDesDialogVisible" :lecture-id="lectureId" :point-id="pointId" @on-success="updateDes" />

  </div>
</template>

<script>
import vContentExtand from '@/components/content-expand'
import vAddQuDialog from '../add-qu-dialog'
import vQuestionList from '../question-list'
import { lecture } from '@/api'
export default {
  components: {
    vContentExtand,
    vAddQuDialog,
    vQuestionList,
    vKnowledgeDes: () => import('../describe'),
    vKnowledgeSummary: () => import('../summary'),
    vAddKnowledgeDesDialog: () => import('../add-knowledge-des-dialog')
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      addQuDialogVisible: false,
      addDesDialogVisible: false,
      showItem: false,
      showDesc: false,
      showSummary: false
    }
  },
  computed: {
    quList() {
      return this.filterModuleData(this.data.children, '例题')
      // const arr = this.filterModuleData(this.data.children, '例题')
      // const nArr = arr.map(v => v.contentItemInfo)
      // return nArr
    },
    desList() {
      return this.filterModuleData(this.data.children, '描述')
    },
    summary() {
      const obj = this.filterModuleData(this.data.children, '总结')
      return obj
    },
    lectureId() {
      return this.data.lectureId
    },
    pointId() {
      return this.data.refId
    },
    showDetail() {
      const arr = this.data.children
      if (!arr || arr.length === 0) return false
      let isSomeShow = arr.some(v => !v.hidden)
      let hasCon = arr.some(v => v.children && v.children.length > 0)
      return isSomeShow && hasCon
    },
    showAddSummaryBtn() {
      return (
        this.summary &&
        this.summary.children &&
        this.summary.children[0] &&
        this.summary.children[0].pointExplainVo
      )
    },
    isView() {
      return this.$route.query.type === 'view'
    }
  },
  methods: {
    // 添加知识总结
    async addKnowledgeSummary() {
      try {
        const res = await lecture.getKnwoledgeDesAndSummary(
          this.lectureId,
          this.pointId
        )
        if (!res.success) throw res.message
        const err = '该总结内容为空！'
        if (!res.data.summary.explainId) throw err
        const summary = res.data.summary
        await lecture.updateKnowledgeSummary({
          explainId: summary.explainId,
          lectureId: this.lectureId,
          pointId: this.pointId
        })
        this.$emit('refresh')
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 删除总结
    async delKnowledgeSummary() {
      if (!this.summary.children || !this.summary.children[0].id) return
      try {
        await lecture.deleteTemplate(this.summary.children[0].id)
        this.$emit('refresh')
      } catch (e) {
        this.$message.error(e)
      }
    },
    showAddQuDialog() {
      this.addQuDialogVisible = true
    },
    // 打开添加描述弹框
    opedAddDesDialog() {
      this.addDesDialogVisible = true
    },
    filterModuleData(data, tmpName) {
      let record = {}
      if (data && data.length > 0) {
        record = data.find(v => v.templateName === tmpName)
        // if (record && record.children) arr = record.children
      }
      return record
    },
    setScore(val) {
      this.$emit('refresh')
    },
    updateDes() {
      this.$emit('refresh')
    },
    refresh() {
      this.$emit('refresh')
    },
    finishAddQu() {
      this.$emit('refresh')
    },
    async addQu(val) {
      try {
        await lecture.addLectureQu({
          itemId: val.itemId,
          lectureId: this.lectureId,
          pointId: this.pointId
        })
        val.addFlag = true
        this.$emit('refresh')
      } catch (e) {
        this.$message.error(e)
      }
    },
    async resetShowNo() {
      let id = this.quList.id
      if (!id) return
      try {
        await this.$confirm('确认重置题号？')
        let res = await lecture.resetItemShowNo(id)
        if (res.success) {
          this.$message.success(res.message || '删除成功')
          this.$emit('refresh')
        }
      } catch (e) {
        e !== 'cancel' && this.$message.error(e.message)
      }
    }
  }
}
</script>

<style lang="less">
.m-content-expand__btn.disable,
.m-content-expand__btn.disable:hover {
  background: #f5f5f5;
  color: #c0c4cc;
  cursor: not-allowed;
}
.lecture-detail-knowledge-content {
  background: rgb(248, 248, 248);
  border: 1px solid #eee;
  padding: 40px 0;
  .m-qu-analy {
    background: rgb(209, 225, 249);
    border: 1px solid rgb(154, 193, 251);
  }
}
.lecture-detail-knowledge__label {
  margin-bottom: 10px;
  margin-top: 10px;
  & > span {
    background: rgb(209, 225, 249);
    display: inline-flex;
    height: 32px;
    line-height: 32px;
    padding: 0 30px;
    font-size: 14px;
  }
}
</style>
