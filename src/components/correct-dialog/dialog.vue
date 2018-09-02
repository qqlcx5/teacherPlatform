<template>
  <el-dialog title="题目纠错" :visible.sync="visible" :before-close="handleClose" custom-class="m-dialog" center width="1100px">
    <div class="correct-post">
      <div class="left">
        <div class="correct-post-title is-origin">
          <span>
            <i class="iconfont icon-label"></i>
            <em>题目原题</em>
          </span>
        </div>
        <div class="correct-post-content">
          <v-question :data="itemDetail" v-mathjax :can-opera="false" :has-analy="true"/>
        </div>
      </div>
      <div class="right">
        <div class="correct-post-title is-correct">
          <span>
            <i class="iconfont icon-label"></i>
            <em>纠错详情</em>
          </span>
        </div>
        <div class="correct-post-content">
          <v-form @close="handleClose" @on-success="handleSuccess" :item-id="itemDetail.itemId" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import vForm from './form'
import vQuestion from '../../components/questions'
export default {
  components: {
    vForm,
    vQuestion
  },
  data() {
    return {
      visible: false,
      itemDetail: {}
    }
  },
  methods: {
    handleClose() {
      this.visible = false
    },
    handleSuccess() {
      this.$emit('success')
    }
  }
}
</script>

<style lang="less">
.correct-post {
  display: flex;
  & > .left,
  & > .right {
    // flex: 1;
    width: 505px;
  }
  & > .right {
    margin-left: 40px;
  }
  &-title {
    &.is-origin {
      --cur-color: #eb9e05;
    }
    &.is-correct {
      --cur-color: #fa5555;
    }
    border-bottom: 2px solid var(--cur-color);
    width: 150px;
    display: inline-block;
    & > span {
      border: 2px solid var(--cur-color);
      padding: 3px 30px 3px 8px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 3px;
      & > i {
        vertical-align: middle;
        margin-right: 5px;
        color: var(--cur-color);
      }
      & > em {
        font-size: 12px;
        font-style: normal;
      }
    }
  }
  &-content {
    border: 1px solid #eee;
    margin-top: 15px;
    height: 380px;
    padding: 10px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 10px;
      background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: hsla(220, 4%, 58%, 0.3);
      display: none;
    }
    &:hover::-webkit-scrollbar-thumb {
      display: block;
    }
    .m-qu img{
      max-width: 100% !important;
    }
  }
}
</style>
