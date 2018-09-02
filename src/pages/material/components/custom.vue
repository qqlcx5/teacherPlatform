<template lang="html">
  <div class="custom" v-if="!data.hidden">
    <v-content-extand :show-btn="!readonly" style="padding-left: 0;">
      <template slot="btns">
        <span class="m-content-expand__btn" @click="opedAddDesDialog">添加素材</span>
        <span class="m-content-expand__btn" @click="showAddQuDialog">添加试题</span>
      </template>
      <div class="knowledge-name cat-name" v-if="!data.hidden">
        <i class="lecture-icon iconfont icon-biaoqian1"></i>
        <span style="margin-left: 5px;">{{data.templateName}}</span>
      </div>
    </v-content-extand>
    <div :class="{'body': data.children }">
      <div class="mb-30" v-for="(item, index) in data.children" :key="data.id">
        <v-content-extand :show-btn="!readonly" v-if="item.contextType === 'REF_HYPER_TEXT'">
          <template slot="btns">
            <div>
              <span class="m-content-expand__btn" v-if="index > 0" @click="moveUp(item)">上移</span>
              <span class="m-content-expand__btn" v-if="!(index+1 === data.children.length)" @click="moveDown(item)">下移</span>
              <span class="m-content-expand__btn" @click="removeDes(item)">删除</span>
            </div>
          </template>
          <div class="knowledge-name cat-name" v-mathjax>
            <div class="flex-baseline">
              <span class="dot"></span>
              <div class="textbook-detail-item__content flex-1" v-html="updateImgSrc(item.richText.content)"></div>
            </div>
          </div>
        </v-content-extand>
        <!-- 添加习题 -->
        <vQuestion v-if="item.contextType === 'ITEM'" :data="item"
          :isLast="isLast(index, data.children)"
          :isFirst="isFirst(index, data.children)"
          @remove="removeItem(item)" @moveUp="moveUp(item)"
          @moveDown="moveDown(item)" @refresh="refresh"
          :readonly="readonly"
          :show-correct="false"
          :show-join-basket="false" />
      </div>
    </div>
    <!-- 弹出框 -->
    <v-add-qu-dialog
      :visible.sync="addQuDialogVisible"
      @add-qu="addQu" />
    <v-add-text-dialog
      :visible.sync="addTextDialogVisible"
      @add-qu="addText" />
  </div>
</template>

<script>
import vContentExtand from '@/components/content-expand'
import mixin from '@/components/mixins'
import vQuestion from '@/pages/lecture/groupLecture/question'
// import vAddQuDialog from '@/pages/lecture/detail/add-qu-dialog'
import vAddQuDialog from './item-dialog'
import vAddTextDialog from './text-dialog'

import { lecture } from '@/api'

export default {
  name: 'custom',
  inject: ['lectureId'],
  components: {
    vQuestion,
    vContentExtand,
    vAddQuDialog,
    vAddTextDialog
  },
  mixins: [mixin],
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addQuDialogVisible: false,
      addTextDialogVisible: false
    }
  },
  methods: {
    showAddQuDialog() {
      this.addQuDialogVisible = true
    },
    // 打开添加描述弹框
    opedAddDesDialog(type, item) {
      this.addTextDialogVisible = true
    },
    refresh() {
      this.$emit('refresh')
    },
    // 添加双师材料富文本
    async addText(item) {
      let params = {
        richTextId: item.textId,
        lectureId: this.lectureId,
        templateId: this.data.id
      }
      try {
        let res = await lecture.addCustomText(params)
        if (res.success) {
          this.$message.success(res.message || '添加成功')
          this.refresh()
          item.addFlag = true
        }
      } catch (e) {
        this.$message.error(e.message || '请求失败')
      }
    },
    async addQu(item) {
      let params = {
        itemId: item.itemId,
        lectureId: this.lectureId,
        templateId: this.data.id
      }
      try {
        let res = await lecture.addCustomItem(params)
        if (res.success) {
          this.$message.success(res.message || '添加成功')
          this.refresh()
          item.addFlag = true
        }
      } catch (e) {
        this.$message.error(e.message || '请求失败')
      }
    },
    async removeItem(item) {
      try {
        let res = await lecture.deleteTemplate(item.id)
        if (res.success) {
          this.$message.success(res.message || '移除成功')
          this.refresh()
        }
      } catch (e) {
        this.$message.error(e.message || '请求失败')
      }
    },
    async moveDown(item) {
      let parent = this.data
      let swapedIds = []
      let lectureTemplateIds = parent.children.map(child => child.id)
      let idx = lectureTemplateIds.indexOf(item.id)
      if (idx < lectureTemplateIds.length - 1) {
        swapedIds = this.swapItems(lectureTemplateIds, idx, idx + 1)
      }
      let params = {
        lectureId: parent.lectureId,
        lectureTemplateIds: swapedIds
      }
      try {
        let res = await lecture.sortTemplate(params)
        if (res.success) {
          this.$message.success(res.message || '移动成功')
          this.$emit('refresh')
        }
      } catch (e) {
        this.$message.error(e.message || '移动失败')
      }
    },
    async moveUp(item) {
      let parent = this.data
      let swapedIds = []
      let lectureTemplateIds = parent.children.map(child => child.id)
      let idx = lectureTemplateIds.indexOf(item.id)
      if (idx > 0) {
        swapedIds = this.swapItems(lectureTemplateIds, idx, idx - 1)
      }
      let params = {
        lectureId: parent.lectureId,
        lectureTemplateIds: swapedIds
      }
      try {
        let res = await lecture.sortTemplate(params)
        if (res.success) {
          this.$message.success(res.message || '移动成功')
          this.$emit('refresh')
        }
      } catch (e) {
        this.$message.error(e.message || '移动失败')
      }
    },
    // 交换数组元素
    swapItems(arr, sourceIndex, targetIndex) {
      arr[targetIndex] = arr.splice(sourceIndex, 1, arr[targetIndex])[0]
      return arr
    },
    isLast(index, items) {
      return index === items.length - 1
    },
    isFirst(index) {
      return index === 0
    },
    // 删除自定义描述
    async removeDes(item) {
      try {
        await this.$confirm('确定删除？', { type: 'warning' })
        let res = await lecture.deleteTemplate(item.id)
        if (res.success) {
          this.$message.success(res.message || '删除成功')
          this.$emit('refresh')
        }
      } catch (e) {
        e !== 'cancel' && this.$message.error(e.message)
      }
    },
    async resetItemShowNo(id) {
      try {
        await this.$confirm('确认重置题号？', { type: 'warning' })
        let res = await lecture.resetItemShowNo(id)
        if (res.success) {
          this.$message.success(res.message || '删除成功')
          this.$emit('refresh')
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>

<style lang="less">
.custom {
  .body {
    background: rgb(248, 248, 248);
    border: 1px solid #eee;
    padding: 40px 0;

    .m-qu-analy {
      background: rgb(209, 225, 249);
      border: 1px solid rgb(154, 193, 251);
    }
  }

  .ml-20 {
    margin-left: 20px;
  }
  .mb-20 {
    margin-bottom: 20px;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .mb-30{
    margin-bottom: 30px;
  }
  .flex-baseline {
    display: flex;
    align-items: baseline;
  }
  .flex-1 {
    flex: 1;
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: block;
    background: #3587ff;
    margin-right: 10px;
  }
}
</style>
