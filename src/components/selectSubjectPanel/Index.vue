<template>
  <div>
    <el-popover ref="popover" placement="bottom" width="247" trigger="click" v-model="visible" :disabled="disabled">
      <div class="panel__title">选择{{title}}</div>
      <el-form label-width="80px" size="mini">
        <select-subject-panel-item v-for="item in sgrOptions" @change="change" :current-val="selectResult[item.key]" :key="item.key" :data="item" />
        <el-form-item style="margin-bottom: 0 !important;text-align:center" label-width="0">
          <el-button size="mini" type="primary" @click="update" :loading="loading" :disabled="loading">{{loading?'正在提交...':'确定'}}</el-button>
        </el-form-item>
      </el-form>
    </el-popover>
    <div v-popover:popover>
      <slot :visible="visible" :text="sgrStr" :disabled="disabled"></slot>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SelectSubjectPanelItem from './Item'
export default {
  data() {
    return {
      visible: false,
      loading: false,
      selectResult: {},
      unShowData: [
        'lecture_set_point',
        'lecture_explain',
        'lecture_set_point',
        'lecture_set_point_edit',
        'lecture_description',
        'lecture_exercises_items',
        'lecture_finish',
        'lecture_preview',
        'Paper_basket'
      ]
    }
  },
  computed: {
    ...mapState({
      sgrOptions: state => state.app.sgrOptions,
      userSgr: state => state.user.userSgr
    }),
    sgrStr() {
      let str = ''
      this.sgrOptions.forEach(v => {
        let res = v.list.find(p => p.code === this.userSgr[v.key])
        if (res) {
          str += res.label
        }
      })
      if (!str) str = '请选择'
      return str
    },
    disabled() {
      let routeName = this.$route.name
      return this.unShowData.indexOf(routeName) > -1
    },
    title() {
      var str = ''
      this.sgrOptions.forEach(v => {
        str += v.label
      })
      return str
    }
  },
  created() {
    this.getSgrOptions('BASE')
    this.getUserSgr()
  },
  methods: {
    ...mapActions(['getSgrOptions', 'updateUserSgr', 'getUserSgr']),
    async update() {
      this.loading = true
      try {
        await this.updateUserSgr(this.selectResult)
        this.visible = false
      } catch (err) {
        this.$message.error(err.message)
      }
      this.loading = false
    },
    change(val) {
      this.selectResult = { ...this.selectResult, ...val }
    }
  },
  watch: {
    userSgr(val) {
      this.selectResult = { ...val }
    }
  },
  components: {
    SelectSubjectPanelItem
  }
}
</script>

<style lang="less" scoped>
.panel__title {
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #d8dce5;
}
</style>
