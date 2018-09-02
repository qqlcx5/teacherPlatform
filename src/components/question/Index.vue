<template>
  <section class="m-question" v-mathjax>
    <el-button size="small" class="m-question-correct__btn" v-if="canCorrect" @click="showCorrect(data)">纠错</el-button>
    <div class="item-hover">
      <!-- 在组件中，试题 存在操作 -->
      <slot name="top-button-field">
      </slot>
      <div class="m-question__content">
        <!-- 扩展标签 -->
        <div class="question-item__tagss" v-if="showTag && data.originTagList && data.originTagList.length > 0">
          <span class="question-item__tagss-item" v-for="(item, index) in data.originTagList" :key="index">【{{item.sourceTagName}}】</span>
        </div>
        <div>
          <span style="white-space:nowrap">{{data.showNo}}、</span>
          <span v-html="updateImgSrc(con)"></span>
        </div>
      </div>
      <div class="subItems" v-if="data.subItems && data.subItems.length > 0">
        <question child :data="item" :can-correct="false" :idx="index+1" v-for="(item, index) in data.subItems" :key="item.itemId" />
      </div>
      <div v-else>
        <div class="m-question__options" v-if="hasOptions && data.options && data.options.length">
          <div class="m-question__options-item" v-for="item in data.options" :key="item.id">
            <div class="m-question__options-label">{{item.optionCode+'、'}}</div>
            <div class="m-question__options-con" v-html="updateImgSrc(item.content)"></div>
          </div>
        </div>
        <div class="m-question__analysis" v-show="!data.hiddenDetail">
          <div class="m-question__analysis-item">
            <div class="m-question__analysis-label">难度：</div>
            <div class="m-question__analysis-con">
              <el-rate :value="+data.diffLevelValue" disabled text-color="#ff9900">
              </el-rate>
            </div>
          </div>
          <div class="m-question__analysis-item">
            <div class="m-question__analysis-label">考点：</div>
            <div class="m-question__analysis-con">
              <span>{{data.points}}</span>
            </div>
          </div>
          <div class="m-question__analysis-item" v-if="data.answer">
            <div class="m-question__analysis-label">答案：</div>
            <div class="m-question__analysis-con" v-html="updateImgSrc(data.answer)"></div>
          </div>
          <div class="m-question__analysis-item" v-if="data.detail">
            <div class="m-question__analysis-label">解析：</div>
            <div class="m-question__analysis-con" v-html="updateImgSrc(data.detail)"></div>
          </div>
          <!-- 1.4.2 添加音频视频 -->
          <div class="m-question__analysis-item" v-if="data.audios && data.audios.length">
            <div class="m-question__analysis-label">音频：</div>
            <div class="m-question__analysis-con">
              <div style="color:#20a0ff; line-height: 36px; height: 36px; display: block; display: flex; align-items: center;" v-for="(audio, index) of data.audios" :key="audio.id">
                <span class="audio-name" slot="reference" style="cursor: pointer; margin-right: 10px;">{{audio.audioName}}</span>
                <audio controls :src="audio.linkUrl" :ref="`audioPopover${index}`"></audio>
              </div>
            </div>
          </div>
          <div class="m-question__analysis-item" v-if="data.videos && data.videos.length">
            <div class="m-question__analysis-label">视频：</div>
            <div class="m-question__analysis-con">
              <div style="color: #20a0ff; cursor: pointer;line-height:  36px; height: 36px; display: block;" v-for="(video) of data.videos" :key="video.id">
                <span @click.prevent="playVideo(video)" style="cursor: pointer">{{video.videoName}}</span>
              </div>
            </div>
          </div>
          <!-- 1.4.2 添加音频视频 -->
        </div>
      </div>
      <!-- 在组件中，试题 存在操作 -->
      <slot name="button-field">
      </slot>
    </div>
  </section>
</template>

<script>
import mixin from '@/components/mixins'
import correctDialog from '../../components/correct-dialog'
export default {
  mixins: [mixin],
  name: 'question',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    idx: {
      type: Number
    },
    child: [String],
    showTag: {
      type: Boolean,
      default: false
    },
    canCorrect: Boolean
  },
  data() {
    return {}
  },
  computed: {
    con() {
      let str = ''
      if (this.data.itemScore) str = '(' + this.data.itemScore + '分 ' + ')'
      return str + this.data.content
    },
    hasOptions() {
      return this.data.itemTypeId === 3 || this.data.itemTypeId === 2
    }
  },
  methods: {
    // 音频
    stopAudioPlay(index) {
      if (!this.$refs[`audioPopover${index}`]) {
        return
      }
      this.$refs[`audioPopover${index}`][0].pause()
    },
    playVideo(video) {
      window.open(`/#/video/${video.id}`)
    },
    showCorrect(data) {
      if (data.status === 'AVAILABLE') {
        correctDialog({ visible: true, itemDetail: data })
      } else {
        this.$message.error('该题目未启用，暂无法纠错！')
      }
    }
  }
}
</script>

<style lang="less">
.m-question {
  background: #fff;
  // 导致导致页面空白太多，影响到哪些？
  // white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
  position: relative;
  &:hover {
    .m-question-correct__btn {
      display: block;
    }
  }
  &__content,
  &__options,
  &__analysis {
    padding: 15px;

    &-tag {
      display: flex;
      flex-wrap: wrap;
      margin-left: -7px;
    }
  }
  &__analysis,
  &__options {
    &-item {
      display: flex;
      align-items: baseline;
      & + & {
        margin-top: 10px;
      }
    }
    &-con {
      flex: 1;
      margin-left: 8px;
      overflow: hidden;
    }
  }
  &__analysis {
    background: rgba(218, 235, 255, 0.5);
    border-radius: 4px;
    color: #555;
    margin: 0 15px;
    &-con > span + span {
      margin-left: 10px;
    }
  }

  .subItems {
    margin-left: 16px;
  }
}
.m-question-correct__btn {
  position: absolute;
  right: 0px;
  top: -25px;
  font-size: 14px;
  cursor: pointer;
  display: none;
}

.question-item {
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 6px;
}

.question-item__tagss {
  display: flex;
  flex-wrap: wrap;
}

.question-item__tagss-item {
  padding: 3px 6px;
  background: #d4d3d32e;
  font-size: 12px;
  color: #20a0ff;
  white-space: nowrap;
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
