<template>
  <div class="router-view">
    <nav class="subnav-menu">
      <router-link :to="{name: 'draft_lecture'}" tag="span" class="subnav-menu__item" active-class="active">
        <i class="subnav-menu__icon"></i>
        <em class="subnav-menu__txt">我的讲义</em>
      </router-link>
      <router-link :to="{name: 'draft_lecture-suite'}" tag="span" class="subnav-menu__item" active-class="active">
        <i class="subnav-menu__icon"></i>
        <em class="subnav-menu__txt">讲义套件</em>
      </router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style lang="less">
.subnav-menu {
  margin-bottom: 20px;
  &__item {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    background-color: #fff;
    & + & {
      margin-left: 10px;
    }
  }
  &__icon{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ddd;
    margin-right: 8px;
  }
  &__item.active &__icon{
    background-color: #409eff;
  }
  &__txt{
    font-style: normal;
  }
}
</style>
