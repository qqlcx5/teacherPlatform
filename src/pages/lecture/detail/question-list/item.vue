<template>
  <v-qu class="m-paper-qu" :idx="idx" :data="data" :class="{'is-selected': isInCart}" :has-score="true" :has-idx="true" :has-analy="showAnaly" :can-opera="true">
    <template slot="btns">
      <span class="m-qu-btns__itm" @click="viewAnaly">{{showAnaly ? '隐藏解析':'显示解析'}}</span>
      <span class="m-qu-btns__itm" @click="setScore" v-if="!isView">编辑题号分数</span>
      <span class="m-qu-btns__itm" @click="moveUp" v-if="!isView && !firstItem">上移</span>
      <span class="m-qu-btns__itm" @click="moveDown" v-if="!isView && !lastItem">下移</span>
      <span class="m-qu-btns__itm" @click="remove" v-if="!isView">删除</span>
      <span class="m-qu-btns__itm" @click="doCorrect" v-if="isView">纠错</span>
      <span class="m-qu-btns__itm" @click="changeCart" v-if="isView">
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
    firstItem: Boolean,
    lastItem: Boolean,
    readonly: {
      type: Boolean,
      default: false
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
    isView() {
      return this.$route.query.type === 'view'
    },
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
    moveUp() {
      this.$emit('move-up', this.data.itemId)
    },
    moveDown() {
      this.$emit('move-down', this.data.itemId)
    },
    remove() {
      this.$emit('remove', this.data)
    },
    setScore() {
      this.$emit('set-score', this.data)
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
