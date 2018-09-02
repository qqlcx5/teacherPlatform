<template>
  <div class="knowledge-question-list">
    <v-question :idx="data.contentItemInfo.showNo"
      :data="data.contentItemInfo"
      :isFirst="isFirst" :isLast="isLast"
      @showDialog="showDialog" @remove="remove"
      @move-down="moveDown" @move-up="moveUp"
      :readonly="readonly" :can-opera="canOpera"
      :show-correct="showCorrect"
      :show-join-basket="showJoinBasket" />
    <v-set-score-dialog v-if="!readonly" :parent-score="itemParentScore" :childs-score="itemChildsScore"
      :visible.sync="setScoreDialogVisible" v-on="$listeners"
      @on-set="setScore" />
  </div>
</template>

<script>
import vQuestion from './item'
import { lecture } from '@/api'

export default {
  components: {
    vQuestion,
    vSetScoreDialog: () => import('./set-score-dialog')
  },
  props: {
    data: Object,
    isFirst: Boolean,
    isLast: Boolean,
    readonly: {
      type: Boolean,
      default: false
    },
    canOpera: {
      type: Boolean,
      default: true
    },
    showCorrect: {
      type: Boolean,
      default: true
    },
    showJoinBasket: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      setScoreDialogVisible: false,
      itemParentScore: {},
      itemChildsScore: []
    }
  },
  methods: {
    getScore(obj) {
      let itemId = obj.itemId
      let itemScore = obj.itemScore
      let showNo = obj.showNo
      return {itemId, itemScore, showNo}
    },
    showDialog(val) {
      this.itemParentScore = this.getScore(val)
      if (val.subItems && val.subItems.length > 0) {
        this.itemChildsScore = val.subItems.map(v => this.getScore(v))
      } else {
        this.itemChildsScore = []
      }
      this.setScoreDialogVisible = true
    },
    async remove() {
      try {
        await this.$confirm('此操作将删除该条试题,是否继续？')
        this.$emit('remove')
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    },
    moveUp(id) {
      this.$emit('moveUp')
    },
    moveDown(id) {
      this.$emit('moveDown')
    },
    setScore(items, isComplex) {
      if (isComplex) {
        this.setComplex(items)
      } else {
        this.setSimple(items[0])
      }
    },
    async setSimple(item) {
      let params = {templateId: this.data.id, ...item}
      try {
        await lecture.showNoAndScore(params)
        this.setScoreDialogVisible = false
        this.$emit('refresh')
      } catch (e) {
        this.$message.error(e.message || '设置失败')
      }
    },
    async setComplex(items) {
      let [parentScore, ...childsScore] = items
      try {
        let params = {
          parentTemplateId: this.data.id,
          parentShowNo: parentScore.showNo,
          itemScores: childsScore
        }
        await lecture.subItemShowNoAndScore(params)
        this.setScoreDialogVisible = false
        this.$emit('refresh')
      } catch (e) {
        this.$message.error(e.message || '设置失败')
      }
    }
  }
}
</script>
