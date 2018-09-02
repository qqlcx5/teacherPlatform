<template>
  <div class="knowledge-question-list">
    <v-question :first-item="index === 0"
      :last-item="index === data.length - 1"
      :idx="item.contentItemInfo.showNo || index + 1"
      :data="item.contentItemInfo"
      v-for="(item, index) in data"
      :key="index"
      @set-score="showDialog($event, item.id)"
      @remove="remove(item.id)"
      @move-down="moveDown"
      @move-up="moveUp"
      :readonly="readonly" />
    <v-set-score-dialog :parent-score="itemParentScore" :childs-score="itemChildsScore"
      :visible.sync="setScoreDialogVisible" v-on="$listeners" @on-set="setScore" />
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
    data: {
      type: Array,
      default: () => []
    },
    removeQu: {
      type: Function,
      default: () => {}
    },
    lectureId: String,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      setScoreDialogVisible: false,
      itemParentScore: {},
      itemChildsScore: [],
      templateId: ''
    }
  },
  methods: {
    getScore(obj) {
      let itemId = obj.itemId
      let itemScore = obj.itemScore
      let showNo = obj.showNo
      return { itemId, itemScore, showNo }
    },
    showDialog(val, templateId) {
      this.templateId = templateId
      this.itemParentScore = this.getScore(val)
      if (val.subItems && val.subItems.length > 0) {
        this.itemChildsScore = val.subItems.map(v => this.getScore(v))
      } else {
        this.itemChildsScore = []
      }
      this.setScoreDialogVisible = true
    },
    async remove(templateId) {
      try {
        await this.$confirm('此操作将删除该条试题,是否继续？')
        await lecture.removeTemplate(templateId)
        let idx = this.data.findIndex(v => {
          return v.id === templateId
        })
        this.data.splice(idx, 1)
        this.$emit('refresh')
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    },
    async moveUp(id) {
      const idx = this.data.findIndex(
        v => v.contentItemInfo && v.contentItemInfo.itemId === id
      )
      if (idx > 0) {
        this.swapItems(this.data, idx, idx - 1)
        await this.sortQu()
        this.$emit('refresh')
      }
    },
    async moveDown(id) {
      const idx = this.data.findIndex(
        v => v.contentItemInfo && v.contentItemInfo.itemId === id
      )
      if (idx < this.data.length - 1) {
        this.swapItems(this.data, idx, idx + 1)
        await this.sortQu()
        this.$emit('refresh')
      }
    },
    // 交换数组元素
    swapItems(arr, sourceIndex, targetIndex) {
      arr[targetIndex] = arr.splice(sourceIndex, 1, arr[targetIndex])[0]
      return arr
    },
    async sortQu() {
      const ids = this.data.map(v => v.id)
      await lecture
        .sortLectureTemplate({
          lectureId: this.lectureId,
          lectureTemplateIds: ids
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    setScore(items, isComplex) {
      if (isComplex) {
        this.setComplex(items)
      } else {
        this.setSimple(items[0])
      }
    },
    async setSimple(item) {
      let params = { templateId: this.templateId, ...item }
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
          parentTemplateId: this.templateId,
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
