<template>
  <el-dialog title="编辑题号分数" :visible.sync="visible" width="500px" :before-close="handleClose" custom-class="m-dialog" class="set-score-dialog" center>
    <div class="sub-title">编辑母题题号分数</div>
    <div class="set-score-box">
      <div class="set-score-item">
        <div>题号<el-input size="mini" class="ipt-idx" v-model="parentScore.showNo"></el-input></div>
        <div>分数<el-input size="mini" class="ipt-score" v-model="parentScore.itemScore" :disabled="childsScore.length > 0" @change="parentScoreChange(parentScore)"></el-input></div>
      </div>
    </div>
    <template v-if="childsScore.length > 0">
      <div class="sub-title" style="margin-top: 20px">编辑子题题号分数</div>
      <div class="set-score-box">
        <div class="set-score-item" v-for="item in childsScore" :key="item.itemId">
          <div>题号<el-input size="mini" class="ipt-idx" v-model="item.showNo"></el-input></div>
          <div>分数<el-input size="mini" class="ipt-score" v-model="item.itemScore" @change="childScoreChange(item)"></el-input></div>
        </div>
      </div>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="small">取 消</el-button>
      <el-button type="primary" size="small" @click="setScore">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { paper } from '@/api'
export default {
  props: {
    visible: Boolean,
    parentScore: {
      type: Object,
      default: () => { return {} }
    },
    childsScore: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async setScore() {
      let result = [this.parentScore, ...this.childsScore]
      if (this.hasEmptyIdxOrScore(result)) return this.$message.error('题号或分数不能为空！')
      if (this.childsScore.length) {
        this.$emit('on-set', result, true)
      } else {
        this.$emit('on-set', result, false)
      }
      // try {
      //   let res = await paper.updateItemScoreAndIdx(this.paperId, result)
      //   if (!res.success) throw res.message
      //   this.$emit('on-success')
      // } catch (e) {
      //   this.$message.error(e)
      // }
    },
    hasEmptyIdxOrScore(arr) {
      return arr.some(v => {
        return !v.itemScore || !v.showNo
      })
    },
    getScore(obj) {
      let itemId = obj.itemId
      let itemScore = obj.itemScore
      let showNo = obj.showNo
      return {itemId, itemScore, showNo}
    },
    childScoreChange(item) {
      item.itemScore = this.formatScore(item.itemScore)
      let total = 0
      this.childsScore.forEach(v => {
        total += v.itemScore * 10
      })
      Object.assign(this.parentScore, {itemScore: total / 10})
    },
    parentScoreChange(item) {
      item.itemScore = this.formatScore(item.itemScore)
    },
    formatScore(num) {
      let n = ~~(num * 10) / 10
      return n
    }
  }
}
</script>

<style lang="less">
.set-score-dialog{
  .sub-title{
    margin-bottom: 5px;
  }
  .set-score-box{
    padding: 10px;
    border: 1px solid #eee;
  }
  .set-score-item{
    display: flex;
    justify-content: space-between;
  }
  .set-score-item + .set-score-item {
    margin-top: 10px;
  }
  .ipt-idx,.ipt-score{
    width: 150px;
    margin-left: 10px;
  }
}
</style>
