<template>
  <div class="p-lecture-detail" v-loading="loading">
    <div class="lecture-detail-content">
      <div class="lecture-detail-main shadow">
        <div class="lecture-detail-buttons" v-show="chapterDetail.length">
          <el-button style="background-color: #5cadff;" size="small" type="primary" @click="cancel">返回</el-button>
          <el-button style="color: #c07700; background-color: #ffc058;" size="small" @click="gotoDownloadPage">去打印</el-button>
          <a :href="downloadLatexUrl" class="el-button el-button--default el-button--small" style="color: #069d7b; background-color: #63f0d0; text-decoration: none;" size="small" v-show="latexFlag">latex导出</a>
        </div>
        <div class="lecture-detail-title">{{lectureName}}</div>
        <pre-item
          :id="'step'+item.id"
          :data="item"
          v-for="item in chapterDetail"
          :key="item.id"
          v-if="!item.hidden"
          :show-tag="true" />
      </div>
      <div class="lecture-detail-extra shadow">
        <div class="steps-nav">
          <div
            class="steps-nav__item"
            :class="{'is-active': stepActive === index+1}"
            v-for="(item, index) in chapterDetail"
            v-if="!item.hidden"
            :key="item.id"
            @click="scrollStep(index, item.id)">
            <div class="steps-nav__hd">
              <div class="steps-nav__line"></div>
              <div class="steps-nav__icon"></div>
            </div>
            <div class="steps-nav__bd">{{item.templateName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/lecture'
import http from '@/utils/fetch.js'
import PreItem from '../textbook/textbookItem'
export default {
  name: 'lectureDetail',
  data () {
    return {
      lectureName: '',
      chapterDetail: [],
      stepActive: 1,
      latexFlag: false,
      loading: false
    }
  },
  computed: {
    lectureId () {
      return this.$route.params.lectureId
    },
    downloadLatexUrl () {
      return http.defaults.baseURL + `/lecture/${this.$route.params.lectureId}/download/latex`
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    async initData () {
      await this.getChaperDetail(this.lectureId)
    },
    async getChaperDetail (id) {
      try {
        this.loading = true
        let res = await api.showLecture(id)
        this.chapterDetail = this.handleChapterDetail(res.data.lectureTemplateList)
        this.lectureName = res.data.lectureName
        this.latexFlag = res.data.latexFlag
        this.loading = false
      } catch (e) {
        this.$message.error(e)
        this.loading = false
      }
    },
    handleChapterDetail (list) {
      let AUDIOFLAG = true
      let VIDEOFLAG = true
      let VIDEOSPEAKFLAG = true
      list.forEach(item => {
        if (!item.leaf && item.children && item.children.length) {
          this.handleChapterDetail(item.children)
        } else {
          if (item.contextType === 'AUDIO' && item.leaf) {
            if (AUDIOFLAG) {
              item['audioHidden'] = false
              AUDIOFLAG = false
            } else {
              item['audioHidden'] = true
            }
          } else if (item.contextType === 'VIDEO' && item.leaf) {
            if (VIDEOFLAG) {
              item['videoHidden'] = false
              VIDEOFLAG = false
            } else {
              item['videoHidden'] = true
            }
          } else if (item.contextType === 'VIDEO_SPEAK' && item.leaf) {
            if (VIDEOSPEAKFLAG) {
              item['videoSpeakHidden'] = false
              VIDEOSPEAKFLAG = false
            } else {
              item['videoSpeakHidden'] = true
            }
          }
        }
      })
      return list
    },
    selectChaper (id) {
      this.getChaperDetail(id)
    },
    scrollStep (idx, id) {
      this.stepActive = idx + 1
      this.$nextTick(() => {
        let el = document.querySelector('#step' + id)
        let mEl = document.querySelector('.main')
        console.log(id)
        mEl.scrollTop = el.offsetTop
      })
    },
    cancel () {
      this.$router.go(-1)
    },
    gotoDownloadPage () {
      let url = window.location.origin + `/tr/api/lecture/${this.lectureId}/preview`
      window.open(url)
    }
  },
  components: { PreItem }
}
</script>

<style lang="less">
@import url(./../../assets/less/variables.less);
.p-lecture-detail {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  // height: 100%;
  .lecture-detail-title{
    font-size: 18px;
    text-align: center;
  }
  .lecture-detail-content {
    display: flex;
    min-height: 100%;
    // height: 100%;
    width: 1200px;
    margin: 0 auto;
  }
  .lecture-detail-main {
    flex: 1;
    background: #fff;
    margin: 0 20px;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
    .lecture-detail-item__hd
      + .lecture-detail-item
      > .lecture-detail-item__hd {
      text-align: left;
      font-size: 14px;
    }
  }
  .lecture-detail-extra {
    width: 240px;
    background: #fff;
    padding: 20px;
  }

  .lecture-detail-buttons {
    position: relative;
    top: -20px;
    right: 0;
    text-align: right;
  }
  .steps-nav{
    display: flex;
    flex-direction: column;
    position: fixed;
    &__item{
      display: flex;
      flex-basis: 40px;
    }
    &__hd{
      width: 24px;
      position: relative;
    }
    &__line{
      position: absolute;
      height: 100%;
      border-left: 1px solid #add6ff;
      left: 6px;
      top: 0;
    }
    &__icon{
      height: 12px;
      width: 12px;
      background-color: #add6ff;
      border-radius: 50%;
      position: relative;
    }
    &__bd{
      padding: 0px 0px 10px 15px;
      position: relative;
      top: -1px;
      line-height: 1;
      color: #d3d5d9;
      cursor: pointer;
    }
    &__item.is-active{
      .steps-nav__icon{
        background: #3587ff;
      }
      .steps-nav__bd{
        color: #537597;
      }
    }
  }
}
</style>
