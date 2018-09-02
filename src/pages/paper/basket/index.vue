<template>
  <div style="display:flex;justify-content: center">
    <div class="paper-basket">
      <div class="paper-detail">
        <v-title v-model.trim="paperName" :can-edit="true" style="margin-bottom: 30px" @on-blur="changePaperName"/>
        <div class="paper-empty" v-if="quCart.length === 0">
          <div class="paper-empty__tit">该份试卷没有试题，去添加吧！</div>
          <div class="paper-empty__subtit">你可以从以下入口添加试题</div>
          <div class="paper-empty__jump">
            <router-link :to="{name: 'Question_index'}" class="paper-empty__jump-item"><i class="iconfont icon-tianjia"></i>题库</router-link>
            <router-link :to="{name: 'Paper_index'}" class="paper-empty__jump-item"><i class="iconfont icon-tianjia"></i>试卷库</router-link>
            <router-link :to="{name: 'TextBook_index'}" class="paper-empty__jump-item"><i class="iconfont icon-tianjia"></i>精品教材</router-link>
            <router-link :to="{name: 'LectureLib_index'}" class="paper-empty__jump-item"><i class="iconfont icon-tianjia"></i>讲义库</router-link>            
          </div>
        </div>
        <v-question v-else class="mb-30" :idx="item.showNo || index + 1" :first-item="index===0" :last-item="index===list.length-1" :data="item" v-for="(item, index) in list" :key="item.itemId" @set-score="showDialog" @remove="remove" @move-down="moveDown" @move-up="moveUp" />
      </div>
      <div class="right-box">
        <v-base-box :score="totalScore" :count="itemCount" :base-info="baseInfo" @clear="clear" @change="changePaperBase" @finish="finish" ref="baseBox" @reset-showno-success="resetShowNo"/>
      </div>
    </div>
    <v-dialog :parent-score="itemParentScore" :childs-score="itemChildsScore" :paper-id="paperId" :visible.sync="visible" @on-success="setScoreSuccess"/>
  </div>
</template>

<script>
import vQuestion from './question'
import vBaseBox from './base-box'
import vDialog from './set-score-dialog'
import vTitle from './title'
import { mapActions, mapState } from 'vuex'
import { paper } from '../../../api'
export default {
  components: {
    vQuestion,
    vBaseBox,
    vTitle,
    vDialog
  },
  data() {
    return {
      list: [],
      itemCount: 0,
      totalScore: 0,
      paperName: 'dfdfdfdf',
      paperId: '',
      baseInfo: {
        gradeId: '',
        productCode: '',
        paperTypeId: '',
        sourceDepartmentId: '',
        yearId: '',
        regionId: ''
      },
      visible: false,
      itemParentScore: {},
      itemChildsScore: []
    }
  },
  computed: {
    ...mapState({
      quCart: state => state.user.quCart
    })
  },
  mounted() {
    this.getPaperBasket()
  },
  methods: {
    ...mapActions(['updateQuCart', 'clearQuCart']),
    async getPaperBasket() {
      try {
        let res = await paper.getPaperBasket()
        if (res.data) {
          this.list = res.data.items || []
          this.itemCount = res.data.itemCount
          this.totalScore = res.data.totalScore
          this.paperName = res.data.paperName
          this.paperId = res.data.paperId
          this.baseInfo.gradeId = res.data.gradeId || ''
          this.baseInfo.productCode = res.data.productCode || ''
          this.baseInfo.paperTypeId = res.data.paperTypeId || ''
          this.baseInfo.sourceDepartmentId = res.data.sourceDepartmentId || ''
          this.baseInfo.yearId = res.data.yearId || ''
          this.baseInfo.regionId = res.data.regionId || ''
        }
      } catch (e) {}
    },
    async sortItemBasket() {
      await paper.sortItemBasket(this.paperId, this.quCart).catch(err => {
        this.$message.error(err)
      })
    },
    async remove(id) {
      const idx = this.list.findIndex(v => v.itemId === id)
      if (idx > -1) {
        await this.$store.dispatch('appearQuCart', id)
        let delItem = this.list.splice(idx, 1)
        this.itemCount = this.itemCount - 1
        this.totalScore = this.totalScore - delItem[0].itemScore
      }
    },
    moveUp(id) {
      const idx = this.list.findIndex(v => v.itemId === id)
      if (idx > 0) {
        this.swapItems(this.list, idx, idx - 1)
        const ids = this.list.map(v => v.itemId)
        this.updateQuCart(ids)
        this.sortItemBasket()
      }
    },
    moveDown(id) {
      const idx = this.list.findIndex(v => v.itemId === id)
      if (idx < this.list.length - 1) {
        this.swapItems(this.list, idx, idx + 1)
        const ids = this.list.map(v => v.itemId)
        this.updateQuCart(ids)
        this.sortItemBasket()
      }
    },
    // 交换数组元素
    swapItems(arr, sourceIndex, targetIndex) {
      arr[targetIndex] = arr.splice(sourceIndex, 1, arr[targetIndex])[0]
      return arr
    },
    // 清空试题
    async clear() {
      if (this.list.length === 0) return
      await this.$confirm('此操作将清空试题篮的数据,是否继续？')
      await this.clearQuCart()
      this.updateQuCart([])
      this.list = []
      this.totalScore = 0
    },
    finish() {
      if (this.list.length === 0) return this.$message.error('试题不能为空！')
      if (!this.paperName) return this.$message.error('试卷名称不能为空！')
      if (this.paperName.length > 100) return this.$message.error('试卷名称长度不能超过100个字符！')
      this.$refs['baseBox'].validatePaper(async () => {
        try {
          await paper.completePaper(this.paperId)
          this.updateQuCart([])
          this.$router.push({name: 'my_paper_detail', params: {id: this.paperId}})
        } catch (e) {
          this.$message.error(e)
        }
      })
    },
    showDialog(val) {
      this.itemParentScore = this.getScore(val)
      if (val.subItems && val.subItems.length > 0) {
        this.itemChildsScore = val.subItems.map(v => this.getScore(v))
      } else {
        this.itemChildsScore = []
      }
      this.visible = true
    },
    getScore(obj) {
      let itemId = obj.itemId
      let itemScore = obj.itemScore
      let showNo = obj.showNo
      return {itemId, itemScore, showNo}
    },
    async setScoreSuccess() {
      await this.getPaperBasket()
      this.visible = false
    },
    changePaperBase() {
      this.$refs['baseBox'].validatePaper(async () => {
        try {
          await paper.updatePaperBaseInfo(this.paperId, {...this.baseInfo})
          this.$message.success('试卷基本信息修改成功！')
        } catch (e) {
          this.$message.error(e)
        }
      })
    },
    async changePaperName() {
      if (!this.paperName) return this.$message.error('试卷名称不能为空！')
      if (this.paperName.length > 100) return this.$message.error('试卷名称长度不能超过100个字符！')
      try {
        await paper.updatePaperBaseInfo(this.paperId, {paperName: this.paperName})
        this.$message.success('试卷基本信息修改成功！')
      } catch (e) {
        this.$message.error(e)
      }
    },
    resetShowNo() {
      this.getPaperBasket()
    }
  }
}
</script>

<style lang="less">
.paper-basket {
  display: inline-flex;
  margin: 0 auto;
  .paper-detail {
    width: 210mm;
    min-height: 297mm;
    padding: 20px;
    background: #fff;
    .paper-empty{
      padding-top: 280px;
      background: url(/static/empty.png) no-repeat center 50px;
      text-align: center;
      &__tit{
        color: #9d9d9d;
        margin-bottom: 10px;
      }
      &__subtit{
        color: #aaa;
        font-size: 12px;
        margin-bottom: 20px;
      }
      &__jump{
        display: inline-flex;
        width: 400px;
        &-item{
          flex: 1;
          text-decoration: none;
          color: rgb(53, 135, 255);
          &>i{
            margin-right: 8px;
          }
        }
      }
    }
  }
  .right-box {
    width: 322px;
    margin-left: 30px;
  }
}
.mb-30{
  margin-bottom: 30px;
}
</style>
