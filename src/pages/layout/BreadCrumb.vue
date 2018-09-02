<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="hi mb-20">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item v-if="!item.meta.noBreadCrumb" v-for="item in list" :key="item.path" :to="{path: item.path}">{{item.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
// import _ from 'lodash'
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      // 这里暂时通过 query 中参数type=draft 来设置路由
      if (this.$route.query && this.$route.query.type === 'draft') {
        // let copyMatched = _.cloneDeep(matched)
        let copyMatched = [...matched]
        copyMatched[1].meta = {
          isMenu: 1,
          title: '草稿箱'
        }
        this.list = copyMatched
      } else {
        this.list = matched
      }
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  }
}
</script>
