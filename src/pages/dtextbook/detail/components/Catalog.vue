<template>
  <div class="menu">
    <span class="menu-addbtn" @click="showIptBox">
      <i class="el-icon-plus"></i>添加节</span>
    <ul class="menu-list">
      <v-catalog-item :data="item" v-for="(item, index) in data" :key="item.id" :is-last="index === data.length - 1" :can-do.sync="canDo" :on-update="updateChapter" :on-remove="removeChapter" />
      <li class="menu-item-extra" v-if="showIpt">
        <el-input size="mini" :class="{'is-error': isError}" v-model="newChapterName" placeholder="按Enter新建节点" ref="ipt" @blur="createChapter" @keyup.enter.native="onEnter"></el-input>
      </li>
    </ul>
  </div>
</template>

<script>
import vCatalogItem from './CatalogItem'
import { textbook } from '@/api'
export default {
  components: {
    vCatalogItem
  },
  inject: ['currentChapter'],
  props: {
    data: {
      type: Array,
      default: () => []
    },
    textbookId: [Number, String]
  },
  data() {
    return {
      showIpt: false,
      canDo: true,
      isError: false,
      newChapterName: ''
    }
  },
  methods: {
    showIptBox() {
      if (!this.canDo) return
      this.showIpt = true
      this.$nextTick(() => {
        this.newChapterName = ''
        this.$refs.ipt.focus()
      })
    },
    async updateChapter(data) {
      try {
        await textbook.updateTextbookChapter({
          ...data,
          textbookId: this.textbookId
        })
        const record = this.data.find(v => v.id === data.id)
        if (record) record.name = data.name
      } catch (e) {
        this.$message.error(e)
      }
    },
    async removeChapter(data) {
      try {
        await this.$confirm('该操作将删除节点以及节点所关联的数据， 是否继续', {type: 'warning'})
        await textbook.removeTextbookChapter(data.id)
        const idx = this.data.findIndex(v => v.id === data.id)
        idx > -1 && this.data.splice(idx, 1)
        if (this.data.length === 0) {
          Object.assign(this.currentChapter, {id: '', name: ''})
        } else if (data.id === this.currentChapter.id) {
          let currentChapter = this.data[this.data.length - 1]
          Object.assign(this.currentChapter, currentChapter)
        }
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    },
    async createChapter() {
      this.newChapterName = this.newChapterName.trim()
      if (this.newChapterName.length > 50) {
        this.canDo = false
        this.isError = true
        this.$message.error('章节不能为空或章节长度不能大于50个字符！')
      } else if (this.newChapterName.length === 0) {
        this.showIpt = false
      } else {
        try {
          let res = await textbook.createTextbookChapter({
            textbookId: this.textbookId,
            name: this.newChapterName
          })
          this.data.push(res.data)
          this.showIpt = false
        } catch (e) {
          this.$message.error(e)
        }
      }
    },
    onEnter() {
      this.$nextTick(() => {
        this.$refs.ipt.blur()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.menu {
  &-addbtn {
    border: 1px dashed var(--border-color);
    display: block;
    height: 34px;
    line-height: 34px;
    text-align: center;
    font-size: 14px;
    color: var(--blue);
    margin: 0 20px;
    cursor: pointer;
    &:hover {
      background: rgba(240, 246, 255, 1);
    }
  }
  &-list {
    margin: 20px 0;
    padding: 0;
    height: ~'calc(var(--height) - 95px - 15px - 56px - 76px)';
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  &-item-extra {
    padding: 5px 20px;
    .is-error .el-input__inner {
      border-color: var(--red) !important;
    }
  }
}
</style>
