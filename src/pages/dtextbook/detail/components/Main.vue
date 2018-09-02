<template>
  <section class="tb-detail-main">
    <v-empty v-if="!currentChapter.id" tip="还没有添加章节，请先添加章节~~" />
    <template v-else>
      <div class="tb-detail-main-btns">
        <span v-for="item in componentData" :class="{'is-active': item.prop === currentComponent}" :key="item.prop" @click="tabClick(item.prop)">{{item.name}}</span>
      </div>
      <div class="tb-detail-main-wrap">
        <component v-bind:is="currentComponent" class="tb-detail-main-content"></component>
      </div>
    </template>
  </section>
</template>

<script>
import componentData from './componentData'
import vEmpty from './Empty'
const generateComponent = () => {
  let obj = {}
  componentData.forEach(v => {
    obj[v.prop] = v.file
  })
  return obj
}

export default {
  components: {
    ...generateComponent(),
    vEmpty
  },
  inject: ['currentChapter'],
  data() {
    return {
      currentComponent: 'jiaoAn',
      componentData
    }
  },
  methods: {
    tabClick(prop) {
      this.currentComponent = prop
    },
    editLecture() {
      this.$router.push({
        name: 'DTextBook_detail_mainTeachingCase',
        params: {
          id: this.$route.params.id,
          chapterId: this.chapterId,
          lectureId: this.lectureId
        }
      })
    }
  }
}
</script>

<style lang="less">
.tb-detail-main {
  background: #fff;
  border: var(--border);
  &-btns {
    display: flex;
    height: 60px;
    align-items: center;
    border-bottom: var(--border);
    padding: 0 20px;
    & > span {
      font-size: 12px;
      padding: 0.4em 1em;
      border: 1px solid var(--blue);
      color: var(--blue);
      border-radius: var(--border-radius-small);
      cursor: pointer;
      &.is-active,
      &:hover {
        background: var(--blue);
        color: #fff;
      }
    }
    & > span + span {
      margin-left: 10px;
    }
  }
  &-wrap {
    margin: 16px 16px 0 16px;
    height: ~'calc(var(--height) - 95px - 15px - 2px - 45px - 33px)';
    // overflow-y: scroll;
    // &::-webkit-scrollbar {
    //   width: 0;
    // }
    display: flex;
  }
  &-actions {
    padding: 5px 0;
    text-align: center;
    border-top: var(--border);
  }
  &-content {
    flex: 1;
  }
}
</style>
