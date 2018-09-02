<template>
  <el-tree class="hi" :render-content="renderContent" :data="data" :props="defaultProps" node-key="nodeId" @node-click="handleNodeClick"></el-tree>
</template>

<script>
import { app } from '@/api'
/* eslint-disable no-unused-vars */
import Item from './item.vue'
/* eslint-enable no-unused-vars */
export default {
  props: ['gradeId'],
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      }
    }
  },
  mounted() {
    this.getKnowledge()
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return <Item content={data.title} class={{'is-leaf': node.isLeaf}}/>
    },
    async getKnowledge(id = '') {
      try {
        let res = await app.knowledgeTree.get(id)
        this.data = res.data.list
      } catch (e) {}
    },
    handleNodeClick(val) {
      this.$emit('change', val)
    }
  },
  watch: {
    gradeId(val) {
      this.getKnowledge(this.gradeId)
    }
  }
}
</script>
