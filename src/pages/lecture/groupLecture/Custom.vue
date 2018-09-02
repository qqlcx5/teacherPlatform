<template lang="html">
  <div class="custom" v-if="!data.hidden">
    <v-content-extand :show-btn="!isView" style="padding-left: 0;">
      <template slot="btns">
        <span class="m-content-expand__btn" @click="opedAddDesDialog('new')">添加描述</span>
        <span class="m-content-expand__btn" @click="showAddQuDialog">添加试题</span>
        <span class="m-content-expand__btn" v-show="data.children" @click="resetItemShowNo(data.id)">重置题号</span>
      </template>
      <div class="knowledge-name cat-name" v-if="!data.hidden">
        <i class="lecture-icon iconfont icon-biaoqian1"></i>
        <span style="margin-left: 5px;">{{data.templateName}}</span>
      </div>
    </v-content-extand>
    <div :class="{'body': data.children }">
      <div class="mb-30" v-for="(item, index) in data.children" :key="data.id">
        <v-content-extand :show-btn="!isView" v-if="item.contextType === 'REF_HYPER_TEXT'">
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
        <!-- 暂时不用支持IMAGE -->
        <!-- <v-content-extand :show-btn="false" v-if="item.contextType === 'IMAGE'">
          <template slot="btns">
            <span class="m-content-expand__btn">编辑</span>
            <span class="m-content-expand__btn">删除</span>
          </template>
          <div class="knowledge-name cat-name">
            <div class="textbook-detail-item__content mb-20">
              <img :src="updateImgSrc(item.contentImage.url, false)" alt="">
            </div>
          </div>
        </v-content-extand> -->
        <!-- 支持自定义 TEXT -->
        <v-content-extand :show-btn="false" v-if="item.contextType === 'TEXT'">
          <div class="knowledge-name cat-name">
            <div class="textbook-detail-item__content mb-20 flex-baseline">
              <span class="dot"></span>
              <span class="flex-1" v-html="updateImgSrc(item.contentText.text)"></span>
            </div>
          </div>
        </v-content-extand>
        <v-content-extand :show-btn="!isView" v-if="item.contextType === 'HYPER_TEXT'">
          <template slot="btns">
            <div>
              <span class="m-content-expand__btn" @click="opedAddDesDialog('edit', item)">编辑描述</span>
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
          :readonly="isView" />
      </div>
    </div>
    <!-- 弹出框 -->
    <v-add-qu-dialog :lectureId="data.lectureId"
      :visible.sync="addQuDialogVisible"
      @add-qu="addQu" />
    <v-custom-describe-dialog
      :visible.sync="addDesDialogVisible" :data="richText"
      :lectureId="data.lectureId" :status="status" :templateId="data.id"
      @refresh="refresh" />
  </div>
</template>

<script>
import vContentExtand from '@/components/content-expand'
import mixin from '@/components/mixins'
import vQuestion from './question'
import vAddQuDialog from '@/pages/lecture/detail/add-qu-dialog'
import vCustomDescribeDialog from './components/addDescribeDialog.vue'
import { lecture } from '@/api'

export default {
  name: 'custom',
  components: {
    vQuestion,
    vContentExtand,
    vAddQuDialog,
    vCustomDescribeDialog
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
      addDesDialogVisible: false,
      richText: {
        originalContent: '',
        pictureList: []
      },
      status: 'new'
    }
  },
  computed: {
    isView() {
      return this.$route.query.type === 'view'
    }
  },
  methods: {
    showAddQuDialog() {
      this.addQuDialogVisible = true
    },
    // 打开添加描述弹框
    opedAddDesDialog(type, item) {
      this.status = type
      if (type === 'edit') {
        // let {originalContent, pictureList} = item.richText
        // this.richText = {
        //   originalContent,
        //   pictureList
        // }
        this.richText = Object.assign({}, item.richText)
      } else {
        this.richText = {
          originalContent: '',
          pictureList: []
        }
      }
      this.addDesDialogVisible = true
    },
    refresh() {
      this.$emit('refresh')
    },
    async addQu(item) {
      let params = {
        itemId: item.itemId,
        lectureId: this.data.lectureId,
        templateId: this.data.id
      }
      try {
        let res = await lecture.addCustomItem(params)
        if (res.success) {
          this.$message.success(res.message || '添加题目成功')
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
          this.$message.success(res.message || '移除习题成功')
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
        await this.$confirm('确定删除？')
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
        await this.$confirm('确认重置题号？')
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
