<template>
  <div class="textbook-detail-item" v-mathjax>
    <div class="textbook-detail-item__hd" :class="[`${data.contextType}`]" v-if="data.children && data.children.length > 0"><span v-html="data.templateName"></span></div>
    <template v-if="data.leaf">
      <template v-if="data.contextType === 'TEXT' && data.contentText">
        <div class="textbook-detail-item__content" v-html="updateImgSrc(data.contentText.text)"></div>
      </template>
      <template v-if="data.contextType === 'IMAGE' && data.contentImage">
        <div class="textbook-detail-item__content">
          <img :src="updateImgSrc(data.contentImage.url, false)" alt="">
        </div>
      </template>
      <template v-if="data.contextType === 'ITEM' && data.contentItemInfo">
        <question :data="data.contentItemInfo" :idx="data.showNo"/>
      </template>
      <template v-if="data.contextType === 'HYPER_TEXT' && data.pointExplainVo">
        <div class="textbook-detail-item__content" v-html="updateImgSrc(data.pointExplainVo.content)"></div>
      </template>
      <template v-if="data.contextType === 'TABLE_POINT' && data.pointTableVo">
        <el-table :data="data.pointTableVo.lecturePointRequireVos" border style="width: 100%">
          <el-table-column :prop="item.key" :label="item.title" v-for="item in data.pointTableVo.pointTableHeaders" :key="item.key">
          </el-table-column>
        </el-table>
      </template>
      <template v-if="data.contextType === 'DESCRIBE_TEXT' && data.pointDescribeVos">
        <div class="textbook-detail-item__content textbook-detail-item__content-des">
          <div class="textbook-detail-item__content-des-icon">
            <i></i>
          </div>
          <div class="textbook-detail-item__content-des-con" v-html="updateImgSrc(data.pointDescribeVos.displayContent)"></div>
        </div>
      </template>
      <template v-if="data.contextType === 'EXPLAIN_TEXT' && data.pointExplainVo">
        <div class="textbook-detail-item__content" v-html="updateImgSrc(data.pointExplainVo.content)"></div>
      </template>
      <template v-if="data.contextType === 'POINT' && data.templateName">
        <div class="textbook-detail-item__content" v-html="updateImgSrc(data.templateName)"></div>
      </template>
      <template v-if="data.contextType === 'AUDIO' && data.audio">
        <span style="width: 80px; height: 16px; display: inline-block;">{{data.audioHidden ? '' : '音频解析:'}}</span>
        <div class="audio-name" :class="{ 'pl-10': data.audio }" style="display: inline-block">
          <span slot="reference" style="cursor: pointer; margin-right: 10px;display: inline-block;vertical-align:middle">{{data.audio.audioName}}</span>
          <audio controls :src="data.audio.linkUrl" ref="audioPopover" style="vertical-align:middle"></audio>
        </div>
      </template>
      <template v-if="data.contextType === 'VIDEO' && data.video">
        <span style="width: 80px; height: 16px; display: inline-block;">{{data.videoHidden ? '' : '视频解析:'}}</span>
        <span class="audio-name" :class="{ 'pl-10': data.video }"  @click.prevent="playVideo(data.video)">{{data.video.videoName}}</span>
      </template>
      <template v-if="data.contextType === 'VIDEO_SPEAK'">
        <span style="width: 80px; height: 16px; display: inline-block;">{{data.videoSpeakHidden ? '' : '知识点讲法:'}}</span>
        <span class="audio-name" :class="{ 'pl-10': data.video }"  @click.prevent="playVideo(data.video)">{{convertVideoName(data.video.videoName,data.courseTypeId)}}</span>
      </template>
    </template>
    <template v-else>
      <div class="textbook-detail-item__bd" :class="[`${data.contextType}`]">
        <textbook-item :idx="index+1" :data="item" v-for="(item, index) in data.children" :show-tag="showTag" :key="item.id" />
      </div>
    </template>
  </div>
</template>

<script>
import Question from '../question/qu'
import mixin from '@/components/mixins'
export default {
  mixins: [mixin],
  name: 'textbookItem',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    idx: Number,
    showTag: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Question
  },
  methods: {
    // 音频
    stopAudioPlay () {
      this.$refs['audioPopover'].pause()
    },
    playVideo (video) {
      window.open(`/#/video/${video.id}`)
    },
    convertVideoName (videoName, courseTypeId) {
      const list = [
        {code: 10056, label: '新课', dataValue: null},
        {code: 10057, label: '同步课', dataValue: null},
        {code: 10058, label: '一轮复习', dataValue: null},
        {code: 10059, label: '二轮复习', dataValue: null},
        {code: 10060, label: '专题课', dataValue: null}
      ]
      const record = list.find(v => v.code === courseTypeId)
      return record ? videoName + '——' + record.label : videoName
    }
  }
}
</script>

<style lang="less">
@import url(../../assets/less/variables.less);
.textbook-detail-item{
  margin-bottom: 30px;
  .audio-name{
    color: @blue;
    cursor: pointer;
  }
  &__content{
    padding: 20px;
    img{
      max-width: 100%;
    }
    &-des{
      padding: 10px 10px;
      display: flex;
      align-items: baseline;
      &-icon{
        margin-right: 10px;
      }
      &-icon i{
        width: 24px;
        height: 24px;
        background: url(../../assets/images/des_icon.jpg) no-repeat center center;
        display: inline-block;
        vertical-align: middle;
      }
      &-con{
        flex: 1;
      }
    }
  }
  &__hd{
    padding: 15px 0;
    &>span{
      display: inline-flex;
      align-items: center;
      &::before{
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: @blue;
        content: '';
        display: block;
        margin-right: 10px;
      }
    }
  }
  &__hd.POINT{
    &>span{
      padding: 0 60px 0 20px;
      line-height: 30px;
      color: #fff;
      background: url(../../assets/images/t_b.jpg) #3f99ff no-repeat left center;
      &::before{
        display: none;
      }
    }
  }
  &__bd.POINT{
    &>.textbook-detail-item>.textbook-detail-item__hd>span:before{
      display: none;
    }
    &>.textbook-detail-item>.textbook-detail-item__bd{
      padding: 0 10px;
    }
  }
  // &__POINT > .textbook-detail-item__hd>span{
  //   display: inline-block;
  //   padding: 0 60px 0 20px;
  //   line-height: 30px;
  //   color: #fff;
  //   background: url(../../assets/images/t_b.jpg) #3f99ff no-repeat left center;
  // }
  .pl-45 {
    padding-left: 45px;
  }
  .pl-10 {
    padding-left: 10px;
  }
}
</style>
