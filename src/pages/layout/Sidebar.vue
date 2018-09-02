<template>
  <el-menu :collapse="isCollapse" :router="true" :default-active="defaultActive" 
  class="el-menu-vertical-demo" background-color="#3587ff" text-color="#fff" active-text-color="#ffd04b"
  :default-openeds="opends">
    <template v-for="item in menuList" v-if="item.meta && item.meta.isMenu === 1">
      <el-menu-item :index="item.path" :route="item" :key="item.path" v-if="item.meta.noDropdown">
        <i class="sidebar__icon" :class="['sidebar__icon-'+item.meta.icon]"></i>
        <span slot="title">{{item.meta && item.meta.title}}</span>
      </el-menu-item>
      <el-submenu :index="item.path" :key="item.path" v-else-if="item.children && item.children.length > 0">
        <template slot="title">
          <i class="sidebar__icon" :class="['sidebar__icon-'+item.meta.icon]"></i>
          <span :title="item.path">{{item.meta && item.meta.title}}</span>
        </template>
        <el-menu-item v-if="sub.meta && sub.meta.isMenu === 1" :title="sub.path" :index="sub.path" v-for="sub in item.children" :key="sub.path" :route="sub">
          <i class="sidebar__sub-icon"></i>
          <span>{{sub.meta && sub.meta.title}}</span>
        </el-menu-item>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
export default {
  data () {
    return {
      opends: ['/myCenter']
    }
  },
  computed: {
    menuList() {
      return this.$store.state.permission.routes
    },
    defaultActive() {
      if (this.$route.query && this.$route.query.type === 'draft') {
        return '/draft'
      }
      let matched = this.$route.matched
      if (matched instanceof Array && matched.length > 0) {
        for (let i = matched.length - 1; i >= 0; i--) {
          let _route = matched[i]
          if (_route.meta && _route.meta.isMenu === 1) {
            return _route.path
          }
        }
      }
      return this.$route
    },
    isCollapse() {
      return !!this.$store.state.app.sidebarOpen
    }
  }
}
</script>

<style lang="less">
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
