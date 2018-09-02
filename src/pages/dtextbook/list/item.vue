<template>
  <div class="tb-item">
    <h3 class="title">
      <i class="iconfont icon-jiaocai"></i>
      {{data.name}}
    </h3>
    <div class="tag">
      <span>{{data.grade}} </span>
      <span>{{data.season}}</span>
      <span>{{data.productLine}}</span>
    </div>
    <div class="footer">
      <span class="count">共{{data.courseCount}}次课</span>
      <span class="year">{{data.year}}</span>
    </div>
    <div class="mask">
      <router-link :to="{name: 'DTextBook_detail', params: {id: data.id}}" tag="span" class="btn is-view">
        <i class="iconfont icon-chakan"></i>
        查看
      </router-link>
      <span class="btn is-edit" @click="edit(data.id)">
        <i class="iconfont icon-bianji"></i>
        编辑
      </span>
      <span class="btn is-del" @click="remove(data.id)">
        <i class="iconfont icon-shanchu"></i>
        删除
      </span>
    </div>
  </div>
</template>

<script>
import { textbook } from '@/api'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    remove(id) {
      this.$emit('remove', 'id')
    },
    async edit(id) {
      try {
        let res = await textbook.editTextbook(id)
        if (res.success) {
          this.$router.push({
            name: 'DTextBook_detail',
            params: { id: id }
          })
        }
      } catch (e) {
        this.$message.error(e)
      }
    }
  }
}
</script>

<style lang="less">
.tb-item {
  padding: 15px;
  background: #fff;
  border: var(--border);
  border-radius: var(--border-radius);
  position: relative;
  & > .title {
    // white-space: nowrap;
    // text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
    font-weight: normal;
    line-height: 1.4;
    height:40px;
    & > .iconfont {
      color: var(--blue);
      margin-right: 5px;
    }
  }
  & > .tag {
    margin-top: 12px;
    & > span {
      display: inline-flex;
      border-radius: 10px;
      height: 20px;
      line-height: 20px;
      border: 1px solid #bcbcbc;
      background: rgba(238, 238, 238, 1);
      padding: 0 10px;
      box-sizing: border-box;
    }
    & > span + span {
      margin-left: 8px;
    }
  }
  & > .footer {
    margin-top: 25px;
    border-top: 1px dashed var(--border-color);
    display: flex;
    justify-content: space-between;
    & > span {
      color: var(--gray-light);
      line-height: 1;
      padding-top: 15px;
    }
  }
  & > .mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    align-items: center;
    justify-content: center;
    display: none;
    & > .btn {
      display: flex;
      flex-direction: column;
      text-align: center;
      margin: 0 5px;
      color: #fff;
      cursor: pointer;
      & > i {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        line-height: 36px;
        text-align: center;
        color: #fff;
        margin-bottom: 5px;
      }
      &.is-view > i {
        background: var(--green);
      }
      &.is-edit > i {
        background: var(--blue);
      }
      &.is-del > i {
        background: var(--red);
      }
    }
  }
  &:hover > .mask {
    display: flex;
  }
}
</style>
