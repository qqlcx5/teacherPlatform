<template>
  <el-dialog class="hi-dialog" title="添加讲义" :visible="visible" width="400px" :before-close="handleClose">
    <p class="period-subject" style="text-align: center; margin: 5px; color: #FF9800">({{periodName}}{{subjectName}})</p>
    <p style="text-align: center; margin: 10px; font-size: 12px; color: #9E9E9E;">请填写基本信息，提交之后将进入讲义编辑页面</p>
    <el-form :model="form" size="small" status-icon :rules="rules" ref="form" label-width="110px">
      <el-form-item label="讲义名称:" prop="name">
        <el-input v-model="form.name" placeholder="请填写讲义名称"></el-input>
      </el-form-item>
      <el-form-item label="产品线:" prop="productCode">
        <el-select v-model="form.productCode" placeholder="请选择产品线" style="width: 100%">
          <el-option :label="item.label" :value="item.code" v-for="item in productLineList" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程类型:" prop="courseTypeId">
        <el-select v-model="form.courseTypeId" placeholder="请选择课程类型" style="width: 100%">
          <el-option :label="item.label" :value="item.code" v-for="item in courseList" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级:" prop="gradeId">
        <el-select v-model="form.gradeId" placeholder="请选择年级" style="width: 100%">
          <el-option :label="item.label" :value="item.code" v-for="item in gradeList" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">下一步</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { lecture } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    gradeList: {
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
    productLineList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    sgrOptions() {
      return this.$store.state.app.sgrOptions
    },
    userSgr() {
      return this.$store.state.user.userSgr
    },
    periodName() {
      let record = this.sgrOptions.find(Option => Option.key === 'periodId')
      if (record && record.list && record.list.length) {
        let period = record.list.find(item => item.code === this.userSgr.periodId)
        return period && period.label
      }
      return ''
    },
    subjectName() {
      let record = this.sgrOptions.find(Option => Option.key === 'subjectId')
      if (record && record.list && record.list.length) {
        let subject = record.list.find(item => item.code === this.userSgr.subjectId)
        return subject && subject.label
      }
      return ''
    }
  },
  data() {
    return {
      form: {
        name: '',
        gradeId: '',
        courseTypeId: '',
        productCode: '',
        subjectId: '',
        periodId: '',
        regionId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入讲义名称', trigger: 'blur' },
          { max: 50, message: '讲义套件名称长度不能超过50个字符', trigger: 'blur' }
        ],
        gradeId: [{ required: true, message: '请选择年级', trigger: 'change' }],
        courseTypeId: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ],
        productCode: [
          { required: true, message: '请选择产品线', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.$refs['form'].resetFields()
      }
    }
  },
  methods: {
    filterArrayByKey(arr, key) {
      let record = arr.find(v => v.key === key)
      if (record) {
        let arr = [...record.list]
        arr.shift()
        return arr
      } else {
        return []
      }
    },
    handleClose() {
      // console.log(this.userSgr)
      this.$emit('update:visible', !this.visible)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          ({ subjectId: this.form.subjectId, regionId: this.form.regionId, periodId: this.form.periodId } = this.userSgr)
          lecture
            .createLectureBasicinfo(this.form)
            .then(res => {
              // this.$message.success('创建成功')
              this.handleClose()
              this.$router.push({
                name: 'groupLecture',
                params: {
                  lectureId: res.data
                }
              })
            })
            .catch(err => {
              this.$message.error(err)
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.period-subject {
  text-align: center;
}

</style>
