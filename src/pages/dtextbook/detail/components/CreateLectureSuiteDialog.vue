<template>
  <el-dialog :title="title" :visible.sync="visible" :before-close="handleClose" custom-class="m-dialog" center width="1100px">
    <v-table ref="table" border :data="data" :columns="columns" header-row-class-name="m-table-hd" class="m-table" @selection-change="handleSelectionChange" />
    <div slot="footer" v-if="type === 'create'">
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submit" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import vTable from '@/components/table'
import columns from './lecture-suite-template-columns'
export default {
  components: {
    vTable
  },
  props: {
    visible: Boolean,
    title: String,
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'create'
    },
    create: Function
  },
  data() {
    return {
      columns: columns(this),
      loading: false,
      selectedData: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.checkAll()
        })
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async submit() {
      this.loading = true
      await this.create(this.selectedData)
      this.loading = false
    },
    handleSelectionChange(val) {
      this.selectedData = val
    },
    checkAll() {
      this.data.forEach((v, i) => {
        this.$refs.table.$children[0].toggleRowSelection(this.data[i], true)
      })
    }
  }
}
</script>
