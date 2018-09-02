<template>
  <div class="topic-selector">
    <div class="topic-selector__itm" v-for="item in list" :key="item.label">
      <div class="topic-selector__label" :style="{width: width}">{{item.label}}</div>
      <el-select clearable class="topic-selector__select" v-model="selectedResult[item.key]" placeholder="请选择" size="mini" @change="change">
        <el-option v-for="child in item.list" :key="child.code" :label="child.label" :value="child.code">
        </el-option>
      </el-select>
    </div>
    <!-- <div class="topic-selector__wrap">
      <item :width="width" @change="change" :data="item" v-model="selectedResult" v-for="item in list" :key="item.label"/>
    </div> -->
  </div>
</template>

<script>
// import Item from './Item.vue'
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '70px'
    }
  },
  data() {
    return {
      selectedResult: {}
    }
  },
  computed: {
    list() {
      return this.$store.state.app.topicSelectOptions
    },
    userSgr() {
      let obj = this.$store.state.user.userSgr
      return obj.periodId + ',' + obj.regionId + ',' + obj.subjectId
    }
  },
  created() {
    this.$store.dispatch('getTopicSelectorData', this.type)
  },
  watch: {
    userSgr(val) {
      this.$store.dispatch('getTopicSelectorData', this.type)
    }
  },
  methods: {
    change(val) {
      // this.selectedResult[val.key] = val.code
      this.$emit('change', this.selectedResult)
    }
  }
}
</script>

<style lang="less">
.topic-selector {
  --label-width: 60px;
  --grid-gap: 20;
  --grid-columns: 6;
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  grid-gap: ~'calc(var(--grid-gap) * 1px)';
  background: #fff;
  padding: 15px;
  border: var(--border);
  margin-bottom: 20px;
  @media (max-width: 1920px) {
    --grid-columns: 6;
  }
  @media (max-width: 1600px) {
    --grid-columns: 5;
  }
  @media (max-width: 1440px) {
    --grid-columns: 4;
  }
  @media (max-width: 1100px) {
    --grid-columns: 3;
  }
  &__itm {
    display: flex;
    align-items: center;
  }
  &__label {
    width: var(--label-width);
    text-align: right;
    padding-right: 10px;
  }
  &__select {
    flex: 1;
  }
}
// @import url('../../assets/less/variables.less');
// .topic-selector {
//   margin-bottom: 20px;
//   &__wrap {
//     border: 1px solid #eee;
//     background-color: #fff;
//     padding: 15px 25px;
//     border-radius: 4px;
//   }
//   &__item {
//     display: flex;
//     align-items: baseline;
//     margin: 0;
//     padding: 10px 0;
//     // border-bottom: 1px dashed @baseBorderColor;
//   }
//   &__con {
//     flex: 1;
//     margin-left: 10px;
//     overflow: hidden;
//   }
//   &__con.is-collapse{
//     height: 30px;
//   }
//   &__key {
//     margin-right: 10px;
//     cursor: pointer;
//     padding: 5px 10px;
//     border-radius: 4px;
//     display: inline-block;
//     &.is-active {
//       color: #fff;
//       background-color: @blue;
//     }
//   }
//   &__more{
//     cursor: pointer;
//   }
// }
</style>
