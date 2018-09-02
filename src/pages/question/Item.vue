<template>
  <section class="question-item" v-mathjax>
    <div class="question-item__hd">
      <span class="question-item__type">题型：{{data.itemType}}</span>
      <div class="question-item__level">
        <span>难度：</span>
        <el-rate :value="+data.diffLevelValue" disabled text-color="#ff9900">
        </el-rate>
      </div>
      <!-- 在组件中，试题 存在操作 -->
      <slot name="top-button-field">
      </slot>
    </div>
    <div class="question-item__bd">
      <div class="question-item__tagss" v-if="showTag && data.originTagList && data.originTagList.length > 0">
        <span class="question-item__tagss-item" v-for="(item, index) in data.originTagList" :key="index">【{{item.sourceTagName}}】</span>
      </div>
      <div class="question-item__con" v-html="updateImgSrc(data.content)"></div>
      <template v-if="data.subItems && data.subItems.length>0">
        <div class="question-item__child" v-for="(sub, index) in data.subItems" :key="sub.itemId">
          <div class="question-item__con" v-html="`${alToLm(index+1)}、${updateImgSrc(sub.content)}`">
          </div>
          <div class="question-item__options" v-if="(sub.itemTypeId === 2 || sub.itemTypeId === 3) && sub.options && sub.options.length > 0">
            <div class="question-item__options-item" v-for="item in sub.options" :key="item.id">
              <div class="question-item__options-label">{{item.optionCode}}、</div>
              <div class="question-item__options-con" v-html="updateImgSrc(item.content)"></div>
            </div>
          </div>
          <div class="question-item__analysis" v-show="collsape">
            <div class="question-item__analysis-item">
              <div class="question-item__analysis-label">难度:</div>
              <div class="question-item__analysis-con">
                <el-rate :value="+sub.diffLevelValue" disabled text-color="#ff9900">
                </el-rate>
              </div>
            </div>
            <div class="question-item__analysis-item">
              <div class="question-item__analysis-label">考点:</div>
              <div class="question-item__analysis-con">{{sub.points}}</div>
            </div>
            <div class="question-item__analysis-item" v-if="sub.answer">
              <div class="question-item__analysis-label">答案:</div>
              <div class="question-item__analysis-con" v-html="updateImgSrc(sub.answer)"></div>
            </div>
            <div class="question-item__analysis-item baseline" v-if="sub.detail">
              <div class="question-item__analysis-label">解析:</div>
              <div class="question-item__analysis-con" v-html="updateImgSrc(sub.detail)"></div>
            </div>
            <div class="question-item__analysis-item baseline" v-if="sub.audios && sub.audios.length">
              <div class="question-item__analysis-label">音频:</div>
              <div class="question-item__analysis-con">
                <div style="display: flex; align-items: center;" v-for="(audio, index) of sub.audios" :key="audio.id">
                  <!-- <el-popover placement="right" width="400" trigger="click" @hide="stopAudioPlay">
                    <audio controls :src="audio.linkUrl" :ref="`audioPopover${index}`"></audio>
                    <span class="audio-name" style="cursor: pointer" slot="reference">{{audio.audioName}}</span>
                  </el-popover> -->
                  <span class="audio-name" slot="reference" style="cursor: pointer; margin-right: 10px;">{{audio.audioName}}</span>
                  <audio controls :src="audio.linkUrl" :ref="`audioPopover${index}`"></audio>
                </div>
              </div>
            </div>
            <div class="question-item__analysis-item baseline" v-if="sub.videos && sub.videos.length">
              <div class="question-item__analysis-label">视频:</div>
              <div class="question-item__analysis-con">
                <div v-for="video of sub.videos" :key="video.id">
                  <span @click.prevent="playVideo(video)" class="audio-name">{{video.videoName}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="question-item__options" v-if="(data.itemTypeId === 2 || data.itemTypeId === 3) && data.options && data.options.length > 0">
          <div class="question-item__options-item" v-for="item in data.options" :key="item.id">
            <div class="question-item__options-label">{{item.optionCode}}、</div>
            <div class="question-item__options-con" v-html="item.content"></div>
          </div>
        </div>
        <div class="question-item__analysis" v-show="collsape">
          <div class="question-item__analysis-item">
            <div class="question-item__analysis-label">难度:</div>
            <div class="question-item__analysis-con">
              <el-rate :value="+data.diffLevelValue" disabled text-color="#ff9900">
              </el-rate>
            </div>
          </div>
          <div class="question-item__analysis-item">
            <div class="question-item__analysis-label">考点:</div>
            <div class="question-item__analysis-con">{{data.points}}</div>
          </div>
          <div class="question-item__analysis-item" v-if="data.answer">
            <div class="question-item__analysis-label">答案:</div>
            <div class="question-item__analysis-con" v-html="data.answer"></div>
          </div>
          <div class="question-item__analysis-item" v-if="data.detail">
            <div class="question-item__analysis-label">解析:</div>
            <div class="question-item__analysis-con" v-html="data.detail"></div>
          </div>
          <!-- 1.4.2 添加音频视频 -->
          <div class="question-item__analysis-item" v-for="(audio, index) of data.audios" :key="audio.id" v-if="data.audios && data.audios.length">
            <div class="question-item__analysis-label">{{ index === 0 ? '音频:' : ''}}</div>
            <div class="question-item__analysis-con">
              <div style="color:#20a0ff; line-height:  36px; height: 36px; display: block;  display: flex; align-items: center;">
                <!-- <el-popover placement="right" width="400" trigger="click" @hide="stopAudioPlay">
                  <audio controls :src="audio.linkUrl" :ref="`audioPopover${index}`"></audio>
                  <span class="audio-name" slot="reference">{{audio.audioName}}</span>
                </el-popover> -->
                <span class="audio-name" slot="reference" style="cursor: pointer; margin-right: 10px;">{{audio.audioName}}</span>
                <audio controls :src="audio.linkUrl" :ref="`audioPopover${index}`"></audio>
              </div>
            </div>
          </div>
          <div class="question-item__analysis-item" v-for="(video, index) of data.videos" :key="video.id" v-if="data.videos && data.videos.length">
            <div class="question-item__analysis-label">{{index === 0 ? '视频:' : ''}}</div>
            <div class="question-item__analysis-con">
              <div style="color: #20a0ff; cursor: pointer;line-height:  36px; height: 36px; display: block;">
                <span @click.prevent="playVideo(video)">{{video.videoName}}</span>
              </div>
            </div>
          </div><!-- 1.4.2 添加音频视频 -->
        </div>
      </template>
    </div>
    <div class="question-item__ft text-right">
      <span class="question-item__collsape" @click="view">
        {{collsape?'收起详情': '展开详情'}}<i :class="[collsape?'el-icon-arrow-up':'el-icon-arrow-down']"></i></span>
    </div>
  </section>
</template>

<script>
import utils from '../../utils'
import mixin from '@/components/mixins'
export default {
  mixins: [mixin],
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showTag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      collsape: false
    }
  },
  methods: {
    view() {
      this.collsape = !this.collsape
    },
    alToLm(index) {
      return utils.intToRoman(index)
    },
    // 音频
    stopAudioPlay (index) {
      if (!this.$refs[`audioPopover${index}`]) {
        return
      }
      this.$refs[`audioPopover${index}`][0].pause()
    },
    playVideo (video) {
      window.open(`/#/video/${video.id}`)
    }
  }
}
</script>
<style lang="less">
@import url(../../assets/less/variables.less);
.question-item{
  border: 1px solid @baseBorderColor;
  background: #fff;
  border-radius: @borderRadiusLarge;

  &__tagss{
    display: flex;
    flex-wrap: wrap;
  }
  &__tagss-item{
    padding: 3px 6px;
    background: #d4d3d32e;
    font-size: 12px;
    color: #20a0ff;
    white-space: nowrap;
    margin-bottom: 10px;
    margin-right: 10px;
  }
  &__hd{
    position: relative;
    height: 50px;
    line-height: 50px;
    background: #ecf5ff;
    padding: 0 25px;
    border-bottom: 1px solid @baseBorderColor;
  }
  &__type,&__level{
    color: #386088;
    font-size: 16px;
    margin-right: 20px;
    display: inline-flex;
    align-items: center;
  }
  &__bd{
    padding: 25px 25px 0 25px;
  }
  &__ft{
    padding: 10px 25px 25px 25px;
  }
  &__collsape{
    cursor: pointer;
    color: @blue;
  }
  &__tags{
    margin-bottom: 15px;
    &-item{
      margin-right: 7px;
      display: inline-block;
    }
  }
  &__con, &__options{
    margin-bottom: 20px;
  }
  &__options, &__analysis{
    &-item{
      display: flex;
      align-items: baseline;
      padding: 5px 0;
    }
    &-label{
      margin-right: 8px;
    }
    &-con{
      flex: 1;
    }
  }
  &__analysis{
    background: #f8f8f8;
    border-radius: 5px;
    padding: 20px;
    &-label{
      width: 40px;
    }
  }
  &__child{
    padding: 0 20px;
    &:not(:last-child){
      margin-bottom: 30px;
    }
  }
  .audio-name{
    color: @blue;
    cursor: pointer;
  }
  .pl-58 {
    padding-left: 58px;
  }
}
</style>
