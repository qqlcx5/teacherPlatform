<template>
  <el-form :model="form" ref="form" :rules="formRules" label-width="90px" size="mini">
    <el-form-item label="纠错类型:" prop="errorType">
      <el-checkbox-group v-model="form.errorType">
        <el-checkbox :label="item.value" v-for="item in errorTypeOptions" :key="item.value" style="line-height:28px;margin-left: 0;margin-right:5px;">{{item.label}}</el-checkbox>
      </el-checkbox-group>
      <!-- <el-radio-group v-model="form.errorType">
        <el-radio :label="item.value" v-for="item in errorTypeOptions" :key="item.value" style="line-height:28px;margin-left: 0;margin-right:10px">{{item.label}}</el-radio>
      </el-radio-group> -->
    </el-form-item>
    <el-form-item label="备注:" prop="errorComment">
      <v-edit-content class="correct-post-remark__textarea" v-model="form.errorComment"/>
      <!-- <div class="correct-post-remark__textarea" v-html="form.errorComment" @input="form.errorComment = $event.target.innerHTML" @paste="paste" contenteditable="true"></div> -->
    </el-form-item>
    <el-form-item style="margin-bottom:0">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { correct } from '../../api'
import vEditContent from './editContent'
const errorTypeOptions = [
  {
    value: 'STEM_ERROR',
    label: '题干错误'
  },
  {
    value: 'OPTION_ERROR',
    label: '选项错误'
  },
  {
    value: 'ANSWER_ERROR',
    label: '答案错误'
  },
  {
    value: 'ANALYSIS_ERROR',
    label: '解析错误'
  },
  {
    value: 'TAG_ERROR',
    label: '标签错误'
  },
  {
    value: 'POINT_ERROR',
    label: '知识点错误'
  },
  {
    value: 'OTHER_ERROR',
    label: '其他错误'
  }
]
export default {
  components: {
    vEditContent
  },
  props: {
    itemId: [String, Number]
  },
  data() {
    return {
      errorTypeOptions,
      form: {
        errorType: [],
        errorComment: ''
      },
      formRules: {
        errorType: [
          { required: true, message: '请选择错误类型', trigger: 'change' }
        ],
        errorComment: [
          { required: true, message: '请填写错误信息', trigger: 'blur' },
          { max: 1000, message: '错误信息长度不能超过1000个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          try {
            this.form.errorComment = this.form.errorComment.trim()
            await correct.createCorrectInfo({ itemId: this.itemId, errorType: this.form.errorType.join(','), errorComment: this.form.errorComment })
            this.$emit('on-success')
            this.close()
          } catch (e) {
            this.$message.error(e)
          }
        } else {
          return false
        }
      })
    },
    close() {
      this.$refs['form'].resetFields()
      this.$emit('close')
    }
  }
}
</script>
