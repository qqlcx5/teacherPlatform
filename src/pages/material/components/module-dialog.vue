<template lang="html">
  <el-dialog class="hi-dialog edit-module-dialog"
    title="编辑目录"
    :visible="visible"
    width="680px"
    :before-close="handleClose">
    <draggable :list="moduleList" @end="handleDrag" class="module-list">
      <p class="list-group-item" v-for="item of moduleList" :key="item.id">
        <span v-if="!item.edit">{{item.templateName}}</span>
        <el-input
          v-if="item.edit"
          style="width: 84%;"
          placeholder="请输入目录名称"
          v-model="item.templateName"
          clearable
          size="small">
        </el-input>
        <span v-if="!item.edit">
          <el-button type="text" @click="deleteTemplate(item)">删除</el-button>
          <el-button type="text" @click="editModuleName(item)">编辑</el-button>
        </span>
        <span v-if="item.edit">
          <el-button type="text" style="color: #F56C6C;" @click="cancelModuleName(item)">取消</el-button>
          <el-button type="text" style="color: #F56C6C;" @click="handleModuleName(item)">确定</el-button>
        </span>
      </p>
    </draggable>
    <div class="add-actions" style="text-align: center;">
      <el-button size="small" type="warning" icon="el-icon-plus" @click="addCustomTemplate">添加自定义目录</el-button>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click.prevent="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import mixin from '@/components/mixins'
import { lecture } from '@/api'

export default {
  name: 'moduleDialog',
  mixins: [mixin],
  components: { draggable },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: Array
  },
  data () {
    return {
      // 正在编辑的目录
      currentModule: {}
    }
  },
  computed: {
    moduleList() {
      return this.data
    }
  },
  methods: {
    // 添加自定义目录
    addCustomTemplate() {
      this.moduleList.push({templateName: '', edit: true, type: 'CUSTOM'})
    },
    // 编辑目录
    editModuleName(item) {
      item['edit'] = true
      this.currentModule = Object.assign({}, item)
    },
    // 更新目录
    handleModuleName(item) {
      // 这里只能写15个字
      if (this.codePointLength(item.templateName) > 15) {
        this.$message.error('字数最多15个字')
        return null
      }
      // 这里分为 编辑目录 还是 新增目录 根据 id 判断
      if (item.id) {
        this.updateModuleName(item)
      } else {
        this.newModuleName(item)
      }
    },
    // 编辑目录名称
    async updateModuleName(item) {
      let params = {
        templateId: item.id,
        name: item.templateName
      }
      try {
        let res = await lecture.controlTemplateVisible(params)
        if (res.success) {
          item.edit = false
          item = Object.assign(item, res.data)
        }
      } catch (e) {
        this.$message.error(e.message || '')
      }
    },
    // 新建目录名称
    async newModuleName(item) {
      let params = {
        lectureId: this.$route.params.lectureId,
        name: item.templateName
      }
      try {
        let res = await lecture.addCustomTemplate(params)
        if (res.success) {
          item.edit = false
          item = Object.assign(item, res.data)
        }
      } catch (e) {
        this.$message.error(e.message || '')
      }
    },
    // 删除目录模板名称
    async deleteTemplate(item) {
      try {
        await this.$confirm(`讲义中<span style="color: #e6a23c;">【${item.templateName}】</span>关联的素材，试题也会删除，是否继续？`, '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        let res = await lecture.deleteTemplate(item.id)
        if (res.success) {
          this.handleRemoveTemplate(item.id)
        }
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    },
    handleRemoveTemplate(id) {
      let idx = this.moduleList.findIndex(item => item.id === id)
      this.moduleList.splice(idx, 1)
    },
    // 取消编辑状态
    cancelModuleName(item) {
      // 这里根据item.id 来判定 取消 操作
      if (item.id) {
        // 说明目录已存在
        item.templateName = this.currentModule.templateName
        item.edit = false
        this.currentModule = {}
      } else {
        item.templateName = ''
        // 编辑情况 如果是自定义，根据id 来确定位置，然后删除
        // let idx = this.moduleList.indexOf(item)
        this.moduleList.pop()
      }
    },
    // 关闭弹框
    handleClose() {
      this.$emit('close')
    },
    // 确定弹框
    submit() {
      this.$emit('submit', this.moduleList)
    },
    // 拖动结束后触发
    handleDrag(item) {}
  }
}
</script>

<style lang="less">
.list-group-item {
  border: 1px solid #eee;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    padding: 0px;
  }
}
</style>
