<template lang="html">
  <div class="showno-score-dialog">
    <el-dialog
      custom-class="hi-dialog"
      center
      title="编辑题号/分数"
      :visible.sync="normalizedVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancel"
      width="50%">
      <div class="dialog-body">
        <template v-if="isSimple">
          <div class="layout-column">
            <span>编辑题号/分数</span>
            <div class="layout parent">
              <div class="layout-align-start-center">
                <span class="w-50">题号：</span>
                <el-input v-model="normalizedItem.showNo" class="w-200" size="small" placeholder="请输入题号" clearable></el-input>
              </div>
              <div class="layout-align-start-center">
                <span class="w-50">分数：</span>
                <el-input type="number" v-model="normalizedItem.itemScore" @blur="changeParentItemScore(normalizedItem.itemScore)" class="w-160" size="small"></el-input>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="layout-column">
            <span>编辑母题题号/分数</span>
            <div class="layout parent">
              <div class="layout-align-start-center">
                <span class="w-50">题号：</span>
                <el-input v-model="normalizedItem.showNo" class="w-200" size="small" placeholder="请输入题号" clearable></el-input>
              </div>
              <div class="layout-align-start-center">
                <span class="w-50">分数：</span>
                <el-input v-model="totalScore" class="w-160" size="small" :disabled="true"></el-input>
              </div>
            </div>
          </div>
          <div class="layout-column mt-10">
            <span>编辑子题题号/分数</span>
            <div class="layout-column parent">
              <template v-for="(sub, index) in subItems">
                <div class="child-item layout flex-1">
                  <div class="layout-align-start-center">
                    <span class="w-50">({{index + 1}}) ：</span>
                    <el-input v-model="sub.showNo" class="w-200" size="small" placeholder="请输入题号" clearable></el-input>
                  </div>
                  <div class="layout-align-start-center">
                    <span class="w-50">({{index + 1}}) ：</span>
                    <el-input type="number" v-model="sub.itemScore" @blur="changeItemScore(sub.itemScore, index)" class="w-160" size="small" min="0" placeholder="请输入分数"></el-input>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" :disabled="disabled" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'ShowNoAndScoreDialog',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    totalScore () {
      let res = 0
      if (this.subItems) {
        this.subItems.forEach(item => {
          res += (+item.itemScore)
        })
      }
      this.normalizedItem.itemScore = res
      return res
    },
    isSimple () {
      if (this.normalizedItem.itemTypeId > 100) {
        return false
      }
      return true
    },
    disabled () {
      if (!this.isSimple) {
        let arr = this.subItems.filter(item => +item.itemScore < 0.1)
        if (arr && arr.length) {
          return true
        }
        return false
      } else {
        if (+this.normalizedItem.itemScore > 0 && this.normalizedItem.showNo.trim()) {
          return false
        }
        return true
      }
    }
  },
  data () {
    return {
      normalizedVisible: this.visible,
      normalizedItem: cloneDeep(this.item),
      subItems: cloneDeep(this.item.subItems)
    }
  },
  methods: {
    submit () {
      this.normalizedItem.subItems = this.subItems
      this.$emit('success-score-dialog', this.normalizedItem)
    },
    cancel () {
      this.normalizedVisible = false
      this.$emit('cancel-score-dialog', false)
    },
    changeItemScore (num, index) {
      let subitem = this.subItems[index]
      if (+num < 0.1 || +num > 99) {
        subitem.itemScore = 1
        return this.$message.warning('分值必须大于0, 小于100')
      }
    },
    changeParentItemScore (num) {
      if (+num < 0.1 || +num > 99) {
        this.normalizedItem.itemScore = 1
        return this.$message.warning('分值必须大于0, 小于100')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .showno-score-dialog {
    .parent {
      padding: 20px;
      border: 1px solid #eee;
      margin-top: 10px;
    }

    .layout {
      display: flex;
    }
    .layout-column {
      display: flex;
      flex-direction: column;
    }
    .flex-1 {
      flex: 1;
    }

    .layout-align-start-center {
      display: flex;
      flex: 1;
      align-items: center;
    }

    .w-50 {
      width: 50px;
    }
    .w-160 {
      width: 160px;
    }
    .w-200 {
      width: 200px;
    }
    .mt-10 {
      margin-top: 10px;
    }
    .mb-20 {
      margin-bottom: 20px;
    }
    .child-item {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
</style>
