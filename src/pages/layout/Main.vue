<template>
  <div class="container">
    <v-sidebar class="sidebar"/>
    <v-header :class="{'sidebar-open': !!sidebarOpen}"/>
    <section class="main" :class="{'sidebar-open': !!sidebarOpen}">
      <bread-crumb />
      <div class="main-container">
        <keep-alive :include="cachePage">
          <router-view/>
        </keep-alive>
      </div>
    </section>
  </div>
</template>
<script>
import vSidebar from './Sidebar'
import vHeader from './Header'
import BreadCrumb from './BreadCrumb'
export default {
  computed: {
    cachePage() {
      return this.$store.state.app.cachePage
    },
    sidebarOpen() {
      return this.$store.state.app.sidebarOpen
    }
  },
  components: {
    vHeader,
    vSidebar,
    BreadCrumb
  }
}
</script>
<style lang="less">
@import './Layout.less';
</style>
