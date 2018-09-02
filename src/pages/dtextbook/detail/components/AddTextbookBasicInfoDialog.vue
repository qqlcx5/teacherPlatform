<template>
  <el-dialog center :visible="visible" title="新建教材" width="640px" height="312px" :before-close="handleClose">
    <el-form :model="form" size="small" status-icon :rules="rules" ref="ruleForm" :inline="true" label-width="67px">
      <el-form-item label="年份" prop="yearId">
        <el-select v-model="form.yearId" placeholder="请选择">
          <el-option :label="item.label" :value="item.code" v-for="item in yearList" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程季" prop="seasonId">
        <el-select v-model="form.seasonId" placeholder="请选择">
          <el-option :label="item.label" :value="item.code" v-for="item in courseList" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级" prop="gradeId">
        <el-select v-model="form.gradeId" placeholder="请选择">
          <el-option :label="item.label" :value="item.code" v-for="item in gradeList" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分级" prop="textbookLevelId">
        <el-select v-model="form.textbookLevelId" placeholder="请选择">
          <el-option :label="item.label" :value="item.code" v-for="item in levelList" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学段" prop="periodId">
        <el-select v-model="form.periodId" placeholder="请选择" disabled>
          <el-option :label="item.label" :value="item.code" v-for="item in periodList" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本" prop="textbookVersionId">
        <el-select v-model="form.textbookVersionId" placeholder="请选择" disabled>
          <el-option :label="item.label" :value="item.code" v-for="item in versionList" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-row type="flex" justify="end">
        <el-form-item>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">进入编辑</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { textbook } from '@/api'
export default {
  data() {
    return {
      form: {
        yearId: '',
        seasonId: '',
        textbookVersionId: 8900,
        textbookLevelId: '',
        periodId: this.$store.state.user.userSgr.periodId,
        gradeId: ''
      },
      region: '',
      subjectId: '',
      rules: {
        yearId: [{ required: true, message: '请选择年级', trigger: 'change' }],
        seasonId: [
          { required: true, message: '请选择课程季', trigger: 'change' }
        ],
        textbookVersionId: [
          { required: true, message: '请选择版本', trigger: 'change' }
        ],
        textbookLevelId: [
          { required: true, message: '请选择等级', trigger: 'change' }
        ],
        periodId: [
          { required: true, message: '请选择学段', trigger: 'change' }
        ],
        gradeId: [{ required: true, message: '请选择年级', trigger: 'change' }]
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    yearList: {
      type: Array,
      default: () => {
        return []
      }
    },
    courseList: {
      type: Array,
      default: () => {
        return []
      }
    },
    levelList: {
      type: Array,
      default: () => {
        return []
      }
    },
    periodList: {
      type: Array,
      default: () => {
        return []
      }
    },
    gradeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    versionList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    periodId() {
      return this.$store.state.user.userSgr.periodId
    }
  },
  watch: {
    periodId(val, oldVal) {
      if (val) {
        this.form.periodId = val
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editTextbook()
        } else {
          return false
        }
      })
    },
    async editTextbook() {
      try {
        this.region = this.$store.state.user.userSgr.regionId
        this.subjectId = this.$store.state.user.userSgr.subjectId
        await this.$confirm('操作将新建教材，是否继续?', { type: 'warning' })
        let res = await textbook.createTextbook({
          ...this.form,
          regionId: this.region,
          subjectId: this.subjectId
        })
        if (res.success) {
          this.$router.push({
            name: 'DTextBook_detail',
            params: { id: res.data }
          })
        }
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    }
  }
}
</script>
<style>
</style>
