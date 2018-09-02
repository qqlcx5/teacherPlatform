<template>
  <v-qu class="m-paper-qu" :class="{'is-selected': isInCart}" :idx="idx" :data="data" :has-score="true" :has-idx="true" :has-analy="showAnaly" :can-opera="canOpera">
    <template slot="btns">
      <span class="m-qu-btns__itm" @click="viewAnaly">{{showAnaly ? '隐藏解析':'显示解析'}}</span>
      <span class="m-qu-btns__itm" v-show="!readonly" @click="showDialog">编辑题号分数</span>
      <span class="m-qu-btns__itm" v-show="!readonly" @click="moveUp" v-if="!isFirst">上移</span>
      <span class="m-qu-btns__itm" v-show="!readonly" @click="moveDown" v-if="!isLast">下移</span>
      <span class="m-qu-btns__itm" v-show="!readonly" @click="remove">删除</span>
      <span class="m-qu-btns__itm" @click="doCorrect" v-if="!readonly && showCorrect">纠错</span>
      <span class="m-qu-btns__itm" @click="changeCart" v-if="!readonly && showJoinBasket">
        <i :class="[isInCart?'el-icon-minus':'el-icon-plus']" style="font-weight: bold;margin-right:5px"></i>{{isInCart?'移出试题篮':'加入试题篮'}}
      </span>
    </template>
  </v-qu>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import vQu from '@/components/questions/index'
import correctDialog from '@/components/correct-dialog'
export default {
  components: {
    vQu
  },
  props: {
    data: Object,
    idx: [String, Number],
    isFirst: Boolean,
    isLast: Boolean,
    readonly: {
      type: Boolean,
      default: false
    },
    canOpera: {
      type: Boolean,
      default: true
    },
    showCorrect: {
      type: Boolean,
      default: true
    },
    showJoinBasket: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showAnaly: this.$route.query.type === 'view'
    }
  },
  watch: {
    isView(val) {
      this.showAnaly = val
    }
  },
  computed: {
    ...mapState({
      quCart: state => state.user.quCart
    }),
    isInCart() {
      if (!this.data.itemId) return false
      return this.quCart.includes(this.data.itemId)
    },
    isView() {
      return this.$route.query.type === 'view'
    }
  },
  methods: {
    ...mapActions(['joinQuCart', 'appearQuCart']),
    viewAnaly() {
      this.showAnaly = !this.showAnaly
    },
    moveUp() {
      this.$emit('move-up', this.data.itemId)
    },
    moveDown() {
      this.$emit('move-down', this.data.itemId)
    },
    remove() {
      this.$emit('remove', this.data.itemId)
    },
    showDialog() {
      this.$emit('showDialog', this.data)
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
.m-paper-qu + .m-paper-qu{
  margin-top: 30px;
}
</style>
