<template>
  <div class="lecture-suite">
    <v-head :can-edit="type === 'edit'" v-model.trim="name" @on-blur="updateName" />
    <div class="lecture-suite-subtit">
      <span>{{gradeName}}</span>|
      <span>{{subjectName}}</span>
    </div>
    <v-steps v-if="type === 'edit'" :data="stepsList" :select="addStep" />
    <v-item v-for="item in templateList" :data="item" :key="item.id">
      <template slot="operate">
        <router-link class="lecture-suite-operate__btn" :to="{name: 'lecture_preview', params: {lectureId: item.refId}, query: {type: 'view'}}" v-if="item.bindStatus === 'BIND' && item.refType === 'LECTURE'">
          <i class="iconfont icon-See"></i>查看
        </router-link>
        <router-link target="_blank" class="lecture-suite-operate__btn" :to="{name: 'Paper_detail', params: {id: item.refId}}" v-if="item.bindStatus === 'BIND' && item.refType === 'PAPER'">
          <i class="iconfont icon-See"></i>查看
        </router-link>
        <span class="lecture-suite-operate__btn" v-if="type === 'edit' && item.bindStatus === 'BIND'" @click="unbind(item)">
          <i class="iconfont icon-Unbundling"></i>解绑</span>
        <span class="lecture-suite-operate__btn" v-if="type === 'edit' && item.bindStatus === 'UNBOUND'" @click="showDialog(item.id)">
          <i class="iconfont icon-binding"></i>绑定</span>
        <span class="lecture-suite-operate__btn is-delete" v-if="type === 'edit'" @click="deleteStep(item.id)">
          <i class="iconfont icon-delete_1"></i>删除</span>
      </template>
    </v-item>
    <div class="lecture-suite-submit" v-if="type === 'edit'">
      <el-button type="primary" size="small" @click="submit" :loading="submitLoading">提交</el-button>
      <p class="lecture-suite-submit__txt">点击提交前，系统已为您自动保存至草稿箱</p>
    </div>
    <v-bind-dialog v-if="type === 'edit'" :visible.sync="dialogVisible" :template-id="templateId" @bind="handleBind" />
  </div>
</template>

<script>
import vHead from './header'
import vSteps from './steps'
import vItem from './item'
import vBindDialog from './bind-dialog'
import { lecture } from '../../api'
export default {
  components: {
    vHead,
    vSteps,
    vItem,
    vBindDialog
  },
  data() {
    return {
      lecturesuitId: this.$route.params.id,
      name: '',
      gradeId: 0,
      gradeName: '',
      subjectId: 0,
      subjectName: '',
      templateList: [],
      stepsList: [],
      dialogVisible: false,
      templateId: '',
      submitLoading: false
    }
  },
  computed: {
    type() {
      return this.$route.name === 'lecture_suite_edit' ? 'edit' : 'view'
    }
  },
  created() {
    this.getLectureSuiteDetail(this.lecturesuitId)
    this.getLectureSuiteSteps()
  },
  methods: {
    async getLectureSuiteDetail(id) {
      try {
        let res = await lecture.getLectureSuiteDetail(id)
        this.name = res.data.name
        this.gradeId = res.data.gradeId
        this.gradeName = res.data.gradeName
        this.subjectId = res.data.subjectId
        this.subjectName = res.data.subjectName
        this.templateList = res.data.templateList
      } catch (e) {
        this.$message.error(e)
      }
    },
    async getLectureSuiteSteps() {
      try {
        let res = await lecture.getLectureSuiteSteps()
        this.stepsList = res.data
      } catch (e) {
        this.$message.error(e)
      }
    },
    async deleteStep(id) {
      this.$confirm(`此操作将永久删除该教学步骤，是否继续?`, '提示', {
        type: 'warning'
      })
        .then(() => {
          lecture
            .delLectureSuiteTemplate(id)
            .then(() => {
              let idx = this.templateList.findIndex(v => v.id === id)
              idx > -1 && this.templateList.splice(idx, 1)
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },
    async addStep(val) {
      try {
        await lecture.addLectureSuiteTemplate({
          lecturesuitId: this.lecturesuitId.toString(),
          teachingStepsId: val.toString()
        })
        await this.getLectureSuiteDetail(this.lecturesuitId)
      } catch (e) {
        this.$message.error(e)
      }
    },
    handleBind(val) {
      let item = this.templateList.find(v => v.id === val.id)
      item.templateName = val.templateName
      item.refType = val.refType
      item.refId = val.refId
      item.bindStatus = val.bindStatus
    },
    showDialog(templateId) {
      this.templateId = templateId
      this.dialogVisible = true
    },
    unbind(item) {
      this.$confirm(
        `<p>确定解除《${
          item.templateName
        }》与教学步骤的绑定关系？</p><p style="color:#a9a9a9;margin-top:5px">解绑后可重新绑定</p>`,
        {
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      ).then(() => {
        lecture
          .bindLectureSuite({
            templateId: item.id,
            refType: item.refType,
            refId: item.refId,
            bindStatus: 'UNBOUND'
          })
          .then(res => {
            item.templateName = res.data.templateName
            item.refType = res.data.refType
            item.refId = res.data.refId
            item.bindStatus = res.data.bindStatus
          })
          .catch(err => {
            this.$message.error(err)
          })
      })
    },
    hasAllStepsBinded() {
      if (this.templateList.length === 0) return false
      return this.templateList.every(v => {
        return v.refId
      })
    },
    async submit() {
      if (this.name === '') {
        return this.$message.error('讲义套件名称不能为空，请重新输入！')
      }
      if (this.name.length > 50) {
        return this.$message.error('讲义套件名称过长，请重新输入！')
      }
      if (!this.hasAllStepsBinded()) {
        return this.$confirm(
          `<p>未添加模块或有模块未绑定，请先完成操作！</p><p style="color:#a9a9a9;margin-top:5px">点击确定，此讲义套件将会移至草稿箱</p>`,
          {
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }
        ).then(() => {
          this.$router.push({
            name: 'draft_lecture-suite'
          })
        })
      }
      this.submitLoading = true
      try {
        await lecture.updateLectureSuite(this.lecturesuitId)
        this.$router.push({
          name: 'lecture_suite'
        })
      } catch (e) {
        this.$message.error(e)
      }
      this.submitLoading = false
    },
    async updateName() {
      if (this.name === '') {
        return this.$message.error('讲义套件名称不能为空，请重新输入！')
      }
      try {
        await lecture.updateLectureSuiteName({
          id: this.lecturesuitId,
          name: this.name
        })
        this.$message.success('标题修改成功！')
      } catch (e) {
        this.$message.error(e)
      }
    }
  }
}
</script>

<style lang="less">
.lecture-suite {
  padding: 50px 0;
  width: 960px;
  margin: 0 auto;
  &-subtit {
    text-align: center;
    line-height: 56px;
    & > span {
      margin: 0 10px;
    }
  }
}
.lecture-suite-operate__btn {
  color: #3587ff;
  cursor: pointer;
  margin-left: 15px;
  text-decoration: none;
  &.is-delete {
    color: #fe5c5d;
  }
  & > i {
    margin-right: 5px;
    vertical-align: middle;
  }
}
.lecture-suite-submit {
  text-align: center;
  margin-top: 80px;
  &__txt {
    font-size: 12px;
    color: #c0c4cc;
    margin-top: 15px;
  }
}
</style>
