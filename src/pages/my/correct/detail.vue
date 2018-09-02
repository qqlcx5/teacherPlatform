<template>
  <div class="p-correct-detail" v-mathjax>
    <div class="step">
      <div class="item is-finish">
        <div class="item-hd">
          <div class="line"></div>
          <div class="txt" @click="test">提错</div>
        </div>
        <div class="item-bd">
          <p>提错人：{{correctInfo.createUser}}</p>
          <p>提错时间：{{correctInfo.createTime}}</p>
          <p v-if="correctInfo.approveStatus === 'CANCELED'">审核状态：{{correctInfo.approveStatusName}}</p>
          <p v-if="correctInfo.approveStatus === 'CANCELED'">撤回时间：{{correctInfo.cancelTime}}</p>
        </div>
      </div>
      <div class="item" v-if="correctInfo.approveStatus !== 'CANCELED'" :class="{'is-finish': correctInfo.approveStatus === 'PASS' || correctInfo.approveStatus === 'NO_PASS' || correctInfo.approveStatus === 'CANCELED'}">
        <div class="item-hd">
          <div class="line"></div>
          <div class="txt">审核</div>
        </div>
        <div class="item-bd">
          <p v-if="correctInfo.approveUser">审核人：{{correctInfo.approveUser}}</p>
          <p v-if="correctInfo.approveStatusName">审核状态：{{correctInfo.approveStatusName}}</p>
          <p v-if="correctInfo.approveTime">审核时间：{{correctInfo.approveTime}}</p>
          <p v-if="correctInfo.approveComment">原因：{{correctInfo.approveComment}}</p>
        </div>
      </div>
      <div class="item" :class="{'is-finish': correctInfo.correctStatus === 'CORRECTED'}" v-if="correctInfo.approveStatus === 'APPROVAL_PENDING' || correctInfo.approveStatus === 'PASS'">
        <div class="item-hd">
          <div class="line"></div>
          <div class="txt">纠错</div>
        </div>
        <div class="item-bd">
          <p v-if="correctInfo.correctUser">纠错人：{{correctInfo.correctUser}}</p>
          <p v-if="correctInfo.correctStatusName">纠错状态：{{correctInfo.correctStatusName}}</p>
          <p v-if="correctInfo.correctTime">纠错时间：{{correctInfo.correctTime}}</p>
        </div>
      </div>
      <div class="item" :class="{'is-finish': correctInfo.correctStatus === 'CORRECTED' || correctInfo.approveStatus === 'CANCELED' || correctInfo.approveStatus === 'NO_PASS'}">
        <div class="item-hd">
          <div class="line"></div>
          <div class="txt">完成</div>
        </div>
      </div>
    </div>
    <div class="correct-content">
      <div class="left">
        <div class="correct-content-title is-origin">
          <span>
            <i class="iconfont icon-label"></i>
            <em>题目原题</em>
          </span>
        </div>
        <div class="correct-content-inner">
          <div class="hd">
            <div>题型：{{questionData.itemType}}</div>
            <div style="margin-left:20px;display:flex;align-items:center"><span>难度：</span>
              <el-rate :value="+questionData.diffLevelValue" disabled>
              </el-rate>
            </div>
          </div>
          <div class="bd">
            <v-question :data="questionData" :can-opera="false" :has-analy="true"/>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="correct-content-title is-correct">
          <span>
            <i class="iconfont icon-label"></i>
            <em>纠错详情</em>
          </span>
        </div>
        <div class="correct-content-inner">
          <div class="hd">纠错类型：{{correctInfo.errorTypeName}}</div>
          <div class="bd" v-html="correctInfo.errorComment"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { correct } from '../../../api'
import correctDialog from '../../../components/correct-dialog'
import vQuestion from '../../../components/questions'
export default {
  components: {
    vQuestion
  },
  data() {
    return {
      questionData: {},
      correctInfo: {}
    }
  },
  created() {
    this.getCorrectDetail(this.$route.params.id)
  },
  methods: {
    test() {
      correctDialog({visible: true, itemDetail: this.questionData})
    },
    async getCorrectDetail(id) {
      try {
        const res = await correct.getCorrectDetail(id)
        if (res.data) {
          const { itemShowDetail, ...correctInfo } = res.data
          this.questionData = itemShowDetail || {}
          this.correctInfo = correctInfo || {}
        }
      } catch (e) {
        this.$message.error(e)
      }
    }
  }
}
</script>

<style lang="less">
.p-correct-detail {
  & > .step {
    display: flex;
    background: #fff;
    border: 1px solid #eee;
    margin-bottom: 20px;
    padding: 25px 100px;
    border-radius: 4px;
    & .item {
      flex: 1;
      &:last-child {
        width: 82px;
        flex: none;
      }
      &.is-finish {
        .item-hd {
          .line {
            background: rgb(64, 158, 255);
          }
          .txt {
            background: rgb(64, 158, 255);
            color: #fff;
          }
        }
      }
      &-hd {
        position: relative;
        .line {
          height: 2px;
          background: #eee;
          top: 15px;
          right: 30px;
          left: 110px;
          position: absolute;
        }
        .txt {
          border: 1px solid #08c;
          color: #08c;
          background: #eff7ff;
          border-radius: 4px;
          height: 30px;
          line-height: 30px;
          width: 80px;
          text-align: center;
        }
      }
      &-bd {
        margin-top: 10px;
        p {
          padding: 0;
          margin: 0;
          font-size: 12px;
        }
      }
    }
  }
}
.correct-content {
  background: #fff;
  padding: 20px 40px;
  border: 1px solid #eee;
  border-radius: 4px;
  display: flex;
  .left,
  .right {
    flex: 1;
  }
  .right {
    margin-left: 40px;
  }
  &-inner {
    flex: 1;
    margin-top: 15px;
    border: 1px solid #eee;
    min-height: ~'calc(100vh - 371px)';
    & > .hd {
      height: 50px;
      line-height: 50px;
      background: #ecf5ff;
      padding: 0 20px;
      white-space: nowrap;
      overflow: hidden;
      display: flex;
    }
    & > .bd {
      padding: 20px;
      & img {
        max-width: 100%;
        display: block;
      }
    }
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
}
</style>
