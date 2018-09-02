<template>
  <div class="chapter-tree fdfdfdfd">
    <el-tree :data="data" :props="defaultProps" :highlight-current="true" :default-expanded-keys="expandKeys" @node-click="handleNodeClick" node-key="id">
      <span class="chapter-tree-node" slot-scope="{ node, data }" :title="data.name">{{getChapterTitle(node, data)}}</span>
    </el-tree>
  </div>
</template>

<script>
import utils from '../../utils'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    expandKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  methods: {
    handleNodeClick(data, node) {
      this.$emit('node-click', data, node)
    },
    getChapterTitle(node, data) {
      let parent = node.parent
      let children = parent.data.children || parent.data
      let index = children.findIndex(v => v.id === data.id)
      index = index + 1
      if (node.isLeaf && node.level > 1) {
        if (index < 10) index = '0' + index
        index = index + '.'
      } else {
        index = utils.numberToChinese(index) + '、'
      }
      return index + data.name
    }
  }
}
</script>

<style lang="less">
.chapter-tree {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #fff;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: hsla(220, 4%, 58%, 0.3);
    display: none;
  }
  &:hover::-webkit-scrollbar-thumb {
    display: block;
  }
  &-node{
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
