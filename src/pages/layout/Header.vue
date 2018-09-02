<template>
  <div class="header">
    <span class="side-collapse" @click="toggle"></span>
    <div class="header__left">
      <select-subject-panel>
        <el-button slot-scope="props" size="mini" style="font-size: 14px;" :disabled="props.disabled">{{props.text}}
          <i class="el-icon-arrow-down"></i>
        </el-button>
      </select-subject-panel>
    </div>
    <div class="header__right">
      <router-link :to="{name: 'Paper_basket'}" class="drafts">
        <i class="iconfont icon-shitilan"></i>
        <el-badge :value="quCartCount" class="item">
          <el-button type="text" size="small" style="color:#5A5E66">试题篮</el-button>
        </el-badge>
      </router-link>
      <router-link :to="{name: 'draft'}" class="drafts"><i class="iconfont icon-drafts"></i>草稿箱</router-link>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userName || '' }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item divided command='logout'>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg" alt="" class="header-avatar">
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import SelectSubjectPanel from '@/components/selectSubjectPanel/Index'
export default {
  name: 'Header',
  computed: {
    ...mapState({
      userName: state => state.user.userSgr.userName,
      quCartCount: state => state.user.quCart.length,
      userSgr: state => state.user.userSgr
    })
  },
  watch: {
    userSgr: {
      handler () {
        this.$store.dispatch('getQuCart')
      },
      deep: true
    },
    '$route' () {
      this.$store.dispatch('getQuCart')
    }
  },
  mounted() {
    this.$store.dispatch('getQuCart')
  },
  methods: {
    ...mapMutations({
      toggle: 'TOGGLE_SIDEBAR'
    }),
    handleCommand(command) {
      switch (command) {
        case 'logout':
          location.href = '/logout'
          break
        default:
          return ''
      }
    }
  },
  components: {
    SelectSubjectPanel
  }
}
</script>
