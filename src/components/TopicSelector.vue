<template>
  <div class="topic-selector">
    <div class="topic-selector__wrap shadow">
      <dl class="topic-selector__item" v-for="item in list" :key="item.label">
        <dt class="topic-selector__label" :style="{width: labelWidth}">{{item.label}}：</dt>
        <dd ref="keys" class="topic-selector__con" :class="{'is-open': item.isOpened}" v-if="item.list && item.list.length > 0">
          <span class="topic-selector__key" :class="{'is-active': sub.code === selectedResult[item.key]}" v-for="sub in item.list" :key="sub.code" @click="onSelect(item.key, sub.code)">{{sub.label}}</span>
        </dd>
        <dd class="topic-selector__extend" v-if="item.key==='regionId' || item.key==='yearId'">
          <span class="topic-selector__more" @click="open(item)">更多<i :class="[item.isOpened?'el-icon-arrow-up':'el-icon-arrow-down']"></i></span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { app } from '@/api'
export default {
  props: {
    labelWidth: {
      type: String,
      default: '70px'
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedResult: {},
      list: []
    }
  },
  created() {
    this.getSelectorData(this.type)
  },
  methods: {
    // 获取选择器的数据
    async getSelectorData(type) {
      try {
        let res = await app.selector.get(type)
        this.list = res.data
      } catch (e) {
        this.$message.error(e)
      }
    },
    onSelect(key, code) {
      this.$set(this.selectedResult, key, code)
      this.onChange()
    },
    onChange() {
      this.$emit('change', this.selectedResult)
    },
    open(item) {
      this.$set(item, 'isOpened', !item.isOpened)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/less/variables.less');
.topic-selector {
  margin-bottom: 20px;
  &__wrap {
    background-color: #fff;
    padding: 15px 25px;
    border-radius: 4px;
  }
  &__item {
    display: flex;
    align-items: baseline;
    margin: 0;
    padding: 10px 0;
    // border-bottom: 1px dashed @baseBorderColor;
  }
  &__con {
    flex: 1;
    margin-left: 10px;
    height: 30px;
    overflow: hidden;
  }
  &__con.is-open{
    height: auto;
  }
  &__key {
    margin-right: 10px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 4px;
    display: inline-block;
    &.is-active {
      color: #fff;
      background-color: @blue;
    }
  }
  &__more{
    cursor: pointer;
  }
}
</style>
