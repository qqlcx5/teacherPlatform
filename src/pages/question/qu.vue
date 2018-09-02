<template>
  <v-qu class="m-paper-qu" :idx="idx" :data="data" :class="{'is-selected': isInCart}" :has-score="true" :has-idx="true" :has-analy="showAnaly" :can-opera="true">
    <template slot="btns">
      <span class="m-qu-btns__itm" @click="viewAnaly">{{showAnaly ? '隐藏解析':'显示解析'}}</span>
      <span class="m-qu-btns__itm" @click="doCorrect">纠错</span>
      <span class="m-qu-btns__itm" @click="changeCart">
        <i :class="[isInCart?'el-icon-minus':'el-icon-plus']" style="font-weight: bold;margin-right:5px"></i>{{isInCart?'移出试题篮':'加入试题篮'}}
      </span>
    </template>
  </v-qu>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import vQu from '@/components/questions/index'
import correctDialog from '../../components/correct-dialog'
export default {
  components: {
    vQu
  },
  props: {
    data: Object,
    idx: [String, Number]
  },
  data() {
    return {
      showAnaly: false
    }
  },
  computed: {
    ...mapState({
      quCart: state => state.user.quCart
    }),
    isInCart() {
      if (!this.data.itemId) return false
      return this.quCart.includes(this.data.itemId)
    }
  },
  methods: {
    ...mapActions(['joinQuCart', 'appearQuCart']),
    viewAnaly() {
      this.showAnaly = !this.showAnaly
    },
    doCorrect() {
      if (this.data.status === 'AVAILABLE') {
        correctDialog({visible: true, itemDetail: this.data}).$on('success', () => {
          this.$emit('handler-correct')
        })
      } else {
        this.$message.error('该题目未启用，暂无法纠错！')
      }
    },
    changeCart() {
      this.isInCart ? this.appearQuCart(this.data.itemId) : this.joinQuCart(this.data.itemId)
    }
  }
}
</script>

<style lang="less">
.m-paper-qu{
  &.is-selected,&.is-selected.is-hover:hover{
    --text-color-hover: rgb(255,180,62);
    background-color: rgb(255,244,227);
  }
}
</style>
