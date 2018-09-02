<template>
  <v-qu class="m-paper-qu" :idx="idx" :data="data" :has-score="true" :has-idx="true" :has-analy="showAnaly" :can-opera="true">
    <template slot="btns">
      <span class="m-qu-btns__itm" @click="viewAnaly">{{showAnaly ? '隐藏解析':'显示解析'}}</span>
      <span class="m-qu-btns__itm" @click="setScore">编辑题号分数</span>
      <span class="m-qu-btns__itm" @click="moveUp" v-if="!firstItem">上移</span>
      <span class="m-qu-btns__itm" @click="moveDown" v-if="!lastItem">下移</span>
      <span class="m-qu-btns__itm" @click="remove">删除</span>
    </template>
  </v-qu>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import vQu from '@/components/questions/index'
export default {
  components: {
    vQu
  },
  props: {
    data: Object,
    idx: [String, Number],
    firstItem: Boolean,
    lastItem: Boolean
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
    changeCart() {
      this.isInCart ? this.appearQuCart(this.data.itemId) : this.joinQuCart(this.data.itemId)
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
    setScore() {
      this.$emit('set-score', this.data)
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
