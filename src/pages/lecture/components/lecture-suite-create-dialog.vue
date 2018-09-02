<template>
  <el-dialog class="hi-dialog" title="添加讲义套件" :visible="visible" width="400px" :before-close="handleClose">
    <el-form :model="form" size="small" status-icon :rules="rules" ref="form" label-width="110px">
      <el-form-item label="讲义套件名称:" prop="name">
        <el-input v-model="form.name" placeholder="请填写讲义套件名称"></el-input>
      </el-form-item>
      <el-form-item label="年级:" prop="gradeId">
        <el-select v-model="form.gradeId" placeholder="请选择年级" style="width: 100%">
          <el-option :label="item.label" :value="item.code" v-for="item in gradeList" :key="item.code"></el-option>
        </el-select>
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
      <el-form-item>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">下一步</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { lecture } from '../../../api'
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
  data() {
    return {
      form: {
        name: '',
        gradeId: '',
        courseTypeId: '',
        productCode: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入讲义套件名称', trigger: 'blur' },
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
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          lecture
            .createLectureSuite(this.form)
            .then(res => {
              this.handleClose()
              this.$router.push({
                name: 'lecture_suite_edit',
                params: {
                  id: res.data
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
