<template>
  <div class="paper-detail p-paper-detail">
    <h2 class="paper-detail__tit mb-30">{{title}}</h2>
    <v-question class="mb-30" :idx="item.showNo || index + 1" :data="item" v-for="(item, index) in list" :key="item.itemId"/>
    <v-add-qu-dialog :visible.sync="addVisible"/>
    <v-add-knowledge-dialog :visible.sync="visible"/>
  </div>
</template>

<script>
import vQuestion from '../question/qu'
import { paper } from '../../api'
import { mapActions } from 'vuex'
import vAddQuDialog from '@/pages/lecture/detail/add-qu-dialog'
import vAddKnowledgeDialog from '@/pages/lecture/detail/add-knowledge-dialog'
export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      title: '',
      addVisible: false,
      visible: false
    }
  },
  mounted() {
    this.getPaperDetail(this.$route.params.id)
  },
  methods: {
    ...mapActions(['updateQuCart']),
    async getPaperDetail(id) {
      try {
        let res = await paper.detail.get(id)
        if (res.data && res.data.itemInfos) {
          this.list = res.data.itemInfos
          this.title = res.data.paperName
        }
      } catch (e) {}
    },
    remove(id) {
      const idx = this.list.findIndex(v => v.itemId === id)
      if (idx > -1) {
        this.list.splice(idx, 1)
        const ids = this.list.map(v => v.itemId)
        this.updateQuCart(ids)
      }
    },
    moveUp(id) {
      const idx = this.list.findIndex(v => v.itemId === id)
      if (idx > 0) {
        this.swapItems(this.list, idx, idx - 1)
        const ids = this.list.map(v => v.itemId)
        this.updateQuCart(ids)
      }
    },
    moveDown(id) {
      const idx = this.list.findIndex(v => v.itemId === id)
      if (idx < this.list.length - 1) {
        this.swapItems(this.list, idx, idx + 1)
        const ids = this.list.map(v => v.itemId)
        this.updateQuCart(ids)
      }
    },
    // 交换数组元素
    swapItems(arr, sourceIndex, targetIndex) {
      arr[targetIndex] = arr.splice(sourceIndex, 1, arr[targetIndex])[0]
      return arr
    }
  },
  components: {
    vQuestion,
    vAddQuDialog,
    vAddKnowledgeDialog
  }
}
</script>
<style lang="less">
@import url('./paper.less');
.mb-30 {
  margin-bottom: 30px;
}
</style>
