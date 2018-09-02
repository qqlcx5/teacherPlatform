<template>
  <div class="lecture-base-ctr">
    <div class="hd">
      <div class="btns">
        <div style="display: flex;">
          <el-button type="primary" size="mini" style="width: 100%;" @click="finishLecture">
            保存
          </el-button>
        </div>
        <div class="ft">
        </div>
      </div>
    </div>
    <div class="bd">
      <span>{{title}}</span>
      <span class="edit" @click.prevent="openDialog">编辑目录</span>
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

export default {
  props: {
    title: [String, Number],
    tree: Array,
    disabled: Boolean
  },
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
  },
  methods: {
    change() {
      this.$emit('change', this.baseInfo)
    },
    openDialog() {
      this.$emit('open-module-dialog')
    },
    handleClose () {
      this.$emit('close-module-dialog')
    },
    checkChange (data) {
      this.$emit('change-property', data)
    },
    getCheckedKeys (items) {
      let arr = []
      items.forEach(item => {
        if (!item.hidden) {
          arr.push(item.id)
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
