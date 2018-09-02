<template>
  <div class="lecture-base-ctr">
    <div class="hd">
      <div class="btns">
        <div style="display: flex;">
          <el-button type="primary" size="mini" style="width: 100%;" :disabled="disabled" @click="finishLecture">
            完成组讲义
          </el-button>
          <el-button type="primary" size="mini" style="width: 100%;" :disabled="disabled" @click="previewLecture">
            预览讲义
          </el-button>
        </div>
        <div class="ft">
          <el-form :model="baseInfo" label-width="80px" size="small">
            <el-form-item class="is-required" :label="item.label" v-for="item in options" :key="item.key">
              <el-select v-model="baseInfo[item.key]" @change="change">
                <el-option :label="child.label" :value="child.code" v-for="child in item.list" :key="child.code"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="bd">
      <span>讲义目录</span>
      <span class="edit" @click.prevent="openLectureModuleDialog">编辑目录</span>
    </div>
    <div class="catalog">
      <el-tree
        :data="tree"
        :check-strictly="true"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        :props="defaultProps"
        @check="checkChange">
      </el-tree>
    </div>
  </div>
</template>

<script>
import { app } from '@/api'

export default {
  props: {
    baseInfo: Object,
    tree: Array,
    disabled: Boolean
  },
  // components: { lectureModuleDialog },
  computed: {
    checkedKeys () {
      return this.getCheckedKeys(this.tree)
    }
  },
  data() {
    return {
      options: [],
      defaultProps: {
        children: 'children',
        label: 'templateName'
      }
    }
  },
  mounted() {
    this.getLectureBaseOptions()
  },
  methods: {
    async getLectureBaseOptions() {
      let res = await app.selector.get('LECTURE', false)
      // TODO: 这里去掉 grade
      res.data.shift()
      if (res.success && res.data) this.options = res.data
    },
    change() {
      this.$emit('change', this.baseInfo)
    },
    openLectureModuleDialog() {
      this.$emit('open-lecture-module', true)
    },
    handleClose () {
      this.editModuleVisile = false
    },
    checkChange (data) {
      this.$emit('change-property', data)
    },
    getCheckedKeys (items) {
      let arr = []
      items.forEach(item => {
        if (item.contextType === 'POINT') {
          if (!item.hidden) {
            arr.push(item.id)
          }
          if (item.children && item.children.length) {
            item.children.forEach(child => {
              if (!child.hidden) {
                arr.push(child.id)
              }
            })
          }
        } else {
          if (!item.hidden) {
            arr.push(item.id)
          }
        }
      })
      return arr
    },
    finishLecture() {
      this.$emit('finish')
    },
    previewLecture() {
      this.$emit('preview')
    }
  }
}
</script>

<style lang="less">
.lecture-base-ctr{
  border: 1px solid #ddd;
  width: 320px;
  background: #fff;
  position: fixed;
  .hd,.catalog {
    padding: 15px;
    max-height: 500px;
    overflow-y: auto;
  }
  .ft{
    padding: 15px 15px 0 15px;

    .el-form .el-form-item:last-child {
      margin-bottom: 0px;
    }
  }
  .bd{
    display: flex;
    justify-content: space-between;
    background: rgb(238, 238, 238);
    padding: 10px 15px;
    display: flex;
    align-items: center;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    span{
      font-size: 16px;
    }

    .edit {
      font-size: 12px;
      color: #409EFF;
      cursor: pointer;
    }
  }
  .total{
    margin-top: 0;
    margin-bottom: 10px;
    span+span{
      margin-left: 20px;
    }
  }
  .btns{
    .el-button{
      padding: 7px 10px;
    }
  }
  .el-select{
    width: 100%;
  }
}
</style>
