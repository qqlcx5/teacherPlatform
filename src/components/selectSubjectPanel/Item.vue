<template>
  <el-form-item :label="data.label">
    <el-select v-model="selectVal" placeholder="请选择" style="width: 100%">
      <el-option v-for="item in data.list" :key="item.code" :label="item.label" :value="item.code">
      </el-option>
    </el-select>
    <!-- <el-radio-group v-model="selectVal" style="width: 100%" v-else>
      <el-radio-button :label="item.code" v-for="item in data.list" :key="item.code">{{item.label}}</el-radio-button>
    </el-radio-group> -->
  </el-form-item>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          list: [],
          type: '',
          label: ''
        }
      }
    },
    currentVal: [String, Number]
  },
  computed: {
    selectVal: {
      set (val) {
        let obj = {}
        obj[this.data.key] = val
        this.$emit('change', obj)
      },
      get () {
        return this.currentVal
      }
    }
  }
}
</script>
