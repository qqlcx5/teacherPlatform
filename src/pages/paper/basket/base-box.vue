<template>
  <div class="paper-base-ctr">
    <div class="hd">
      <p class="total">
        <span>试题总数：{{count}}道</span>
        <span>试题总分：{{score}}分</span>
      </p>
      <div class="btns">
        <el-button type="primary" size="mini" @click="goSelectItem">
          <i class="iconfont icon-jixutiaoti"></i>继续挑题</el-button>
        <el-button type="warning" plain size="mini" @click="clear">
          <i class="iconfont icon-qingkongshiti"></i>清空试题</el-button>
      </div>
      <div class="btns">
        <el-button type="primary" size="mini" @click="finish">
          <i class="iconfont icon-wanchengzujuan"></i>完成组卷</el-button>
        <el-button type="warning" plain size="mini" @click="resetShowNo">
          <i class="iconfont icon-pailie"></i>重置题号</el-button>
      </div>
    </div>
    <div class="bd">
      <span>基本信息</span>
    </div>
    <div class="ft">
      <el-form :model="baseInfo" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
        <el-form-item :label="item.label" v-for="item in options" :prop="item.key" :key="item.key">
          <el-select v-model="baseInfo[item.key]" @change="change">
            <el-option :label="child.label" :value="child.code" v-for="child in item.list" :key="child.code"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { app, paper } from '../../../api'
export default {
  props: {
    score: Number,
    count: Number,
    baseInfo: Object
  },
  data() {
    return {
      options: [],
      rules: {
        gradeId: [{ required: true, message: '请选择年级' }],
        productCode: [{ required: true, message: '请选择产品线' }],
        paperTypeId: [{ required: true, message: '请选择类型' }],
        sourceDepartmentId: [{ required: true, message: '请选择来源部门' }]
      }
    }
  },
  mounted() {
    this.getPaperBaseOptions()
  },
  methods: {
    async getPaperBaseOptions() {
      let res = await app.selector.get('PAPER', false)
      if (res.success && res.data) {
        this.options = res.data.reverse()
      }
    },
    change() {
      this.$emit('change', this.baseInfo)
    },
    clear() {
      this.$emit('clear')
    },
    goSelectItem() {
      this.$router.push({
        name: 'Question'
      })
    },
    finish() {
      this.$emit('finish', this.baseInfo)
    },
    validatePaper(callback) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          typeof callback === 'function' && callback()
        }
      })
    },
    async resetShowNo() {
      try {
        await this.$confirm('此操作将重置题号，是否继续？')
        await paper.resetShowNo()
        this.$emit('reset-showno-success')
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    }
  }
}
</script>

<style lang="less">
.paper-base-ctr {
  border: 1px solid #ddd;
  width: 270px;
  background: #fff;
  position: fixed;
  .hd,
  .ft {
    padding: 15px;
  }
  .bd {
    background: rgb(238, 238, 238);
    padding: 10px 15px;
    display: flex;
    align-items: center;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    span {
      font-size: 16px;
    }
  }
  .total {
    margin-top: 0;
    margin-bottom: 10px;
    span + span {
      margin-left: 20px;
    }
  }
  .btns {
    // .el-button {
    //   padding: 7px 10px;
    // }
    display: flex;
    justify-content: space-between;
    .el-button{
      padding: 7px 20px;
    }
    .iconfont {
      font-size: 12px;
      margin-right: 8px;
    }
  }
  .btns+.btns{
    margin-top: 5px;
  }
  .el-select {
    width: 100%;
  }
}
</style>
