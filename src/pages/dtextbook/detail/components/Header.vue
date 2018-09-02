<template>
  <section class="tb-detail-header">
    <h3 class="title">
      <i class="iconfont icon-shitilan"></i>
      <span>{{data.name}}</span>
      <em>{{data.gradeName}}</em>
      <em>{{data.subjectName}}</em>
    </h3>
    <div class="tag">
      <span>
        <em>年份：</em>{{data.yearName}}</span>
      <span>
        <em>课程季：</em>{{data.seasonName}}</span>
      <span>
        <em>知识体系：</em>{{data.regionName}}</span>
      <span>
        <em>分级：</em>{{data.textbookLevelName}}</span>
      <span>
        <em>版本：</em>{{data.textbookVersionName}}</span>
      <span>
        <em>产品线：</em>{{data.productName}}</span>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="less">
.tb-detail-header {
  padding: 20px;
  background: #fff;
  border: var(--border);
  & > .title {
    margin: 0;
    display: flex;
    align-items: center;
    font-size: 12px;
    & > em {
      line-height: 1;
      display: inline-block;
      border-radius: 0.8em;
      padding: 0.3em 1em;
      border: var(--border);
      font-style: normal;
      background: #eee;
    }
    & > i {
      color: var(--blue);
    }
    & > * {
      margin-right: 10px;
    }
  }
  & > .tag {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 1;
    margin-top: 15px;
    & > span > em {
      font-style: normal;
      color: var(--gray-light);
    }
  }
}
</style>
