<template>
  <div class="p-textbook-detail">
    <div class="textbook-detail-side shadow">
      <div class="textbook-detail-side__hd">
        <span>目录</span>
      </div>
      <div class="textbook-detail-side__bd">
        <ul class="menu">
          <li class="menu__item" :class="{'is-active': item.id === currentChapterId }" v-for="(item, index) in chapterList" :key="item.id" @click="selectChaper(item.id)">
            <i class="menu__icon"></i>
            <div class="menu__con" :title="item.chapterName">
              <span class="menu__index">{{index+1}}</span>{{item.chapterName}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="textbook-detail-main shadow">
      <div class="textbook-detail-title">{{lectureName}}</div>
      <textbook-item :id="'step'+item.id" :data="item" v-for="item in chapterDetail" :key="item.id" />
    </div>
    <div class="textbook-detail-extra shadow">
      <div class="steps-nav">
        <div class="steps-nav__item" :class="{'is-active': stepActive === index+1}" v-for="(item,index) in chapterDetail" :key="item.id" @click="scrollStep(index,item.id)">
          <div class="steps-nav__hd">
            <div class="steps-nav__line"></div>
            <div class="steps-nav__icon"></div>
          </div>
          <div class="steps-nav__bd">{{item.templateName}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { textbook } from '@/api'
import textbookItem from './textbookItem'
export default {
  data() {
    return {
      lectureName: '',
      chapterList: [],
      chapterDetail: [],
      currentChapterId: '',
      stepActive: 0
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      await this.getChaperList(this.$route.params.id)
      this.currentChapterId = this.chapterList[0].id
      await this.getChaperDetail(this.currentChapterId)
    },
    async getChaperList(id) {
      try {
        let res = await textbook.chapterList.get(id)
        this.chapterList = res.data.list
      } catch (e) {}
    },
    async getChaperDetail(id) {
      try {
        let res = await textbook.chapterDetail.get(id)
        this.lectureName = res.data.lectureName
        this.chapterDetail = res.data.lectureTemplateList
      } catch (e) {}
    },
    selectChaper(id) {
      this.currentChapterId = id
      this.getChaperDetail(id)
    },
    scrollStep(idx, id) {
      this.stepActive = idx + 1
      this.$nextTick(() => {
        let el = document.querySelector('#step' + id)
        let mEl = document.querySelector('.main')
        mEl.scrollTop = el.offsetTop
      })
    }
  },
  components: {
    textbookItem
  }
}
</script>

<style lang="less">
@import url(./Textbook.less);
</style>
