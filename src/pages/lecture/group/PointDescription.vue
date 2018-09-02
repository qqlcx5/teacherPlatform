<template lang="html">
  <div class="point-description">
    <!-- 创建步骤进度条: 编辑描述，总结 -->
    <tr-step :active="defaultActive" :items="steps">
    </tr-step>
    <!-- 讲义试题数据概览 -->
    <tr-lecture-overview
      :lectureId="$route.params.lectureId"
      :lecture-data-source="lectureDataSource"
      @overview-remove-item="overviewRemoveItem"
      @overview-remove-all-item="overviewRemoveAllItem" />
    <!-- 讲义具体的内容 -->

    <div class="content">
      <el-card>
        <div class="lecture-name" style="margin-bottom: 10px;">
          <span>知识精讲</span>
        </div>
        <!-- 编辑描述，总结 -->
        <div style="border: 1px solid #ddd; padding-top: 20px;">
          <div v-for="(item, index) of pointDescribes" :key="item.pointId">
            <el-row type="flex" justify="start" align="middle" :gutter="20">
              <el-col class="point-header">
                <span class="left-image"></span>
                <span class="middle-image">
                  <span class="point-name">{{item.pointName}}</span>
                </span>
                <span class="right-image"></span>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="item.describes && item.describes.length && showTitle(item.describes)" class="baseline">
              <el-col :xs="4" :sm="4" :md="3" :lg="2" :xl="2">
                <div class="title">
                  <p>描述：</p>
                </div>
              </el-col>
              <el-col :xs="20" :sm="20" :md="21" :lg="16" :xl="16">
                <div class="grid-content">
                  <p v-show="des.defaultShow"
                    v-for="des of item.describes"
                    :key="des.describeId">
                    <span v-html="des.displayContent"></span>
                  </p>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="item.audios && item.audios.length && showTitle(item.audios)" class="baseline">
              <el-col :xs="4" :sm="4" :md="3" :lg="2" :xl="2">
                <div class="title">
                  <p>音频解析：</p>
                </div>
              </el-col>
              <el-col :xs="24" :sm="20" :md="21" :lg="16" :xl="16">
                <div v-show="audio.defaultShow"
                  style="color:#20a0ff; line-height: 36px; height: 36px; display: block;display: flex; align-items: center;"
                  v-for="(audio, index) of item.audios" :key="audio.id">
                  <span class="audio-name" slot="reference" style="cursor: pointer; margin-right: 10px;">{{audio.audioName}}</span>
                  <audio controls :src="audio.linkUrl" :ref="`audioPopover${index}`"></audio>
                  <!-- <el-popover placement="right" width="400" trigger="click" @hide="stopAudioPlay">
                    <audio controls :src="audio.linkUrl" :ref="`audioPopover${index}`"></audio>
                    <span class="audio-name" slot="reference">{{audio.audioName}}</span>
                  </el-popover> -->
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="getVideo(item.videos).length > 0" class="baseline">
              <el-col :xs="4" :sm="4" :md="3" :lg="2" :xl="2">
                <div class="title">
                  <p>视频解析：</p>
                </div>
              </el-col>
              <el-col :xs="24" :sm="20" :md="21" :lg="16" :xl="16">
                <div
                  class="video-tab"
                  style="color: #20a0ff; cursor: pointer;line-height:  36px; height: 36px; display: block;"
                  v-for="(video, index) of getVideo(item.videos)" :key="video.id">
                  <span @click.prevent="playVideo(video)">{{video.videoName}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="getKnowledgeVideo(item.videos).length > 0" class="baseline">
              <el-col :xs="4" :sm="4" :md="3" :lg="2" :xl="2">
                <div class="title">
                  <p>知识点讲法：</p>
                </div>
              </el-col>
              <el-col :xs="24" :sm="20" :md="21" :lg="16" :xl="16">
                <div
                  class="video-tab"
                  style="color: #20a0ff; cursor: pointer;line-height:  36px; height: 36px; display: block;"
                  v-for="(video, index) of getKnowledgeVideo(item.videos)" :key="video.id">
                  <span @click.prevent="playVideo(video)">{{video.videoName}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-show="item.summary && item.summary.defaultShow" class="baseline">
              <el-col :xs="4" :sm="4" :md="3" :lg="2" :xl="2">
                <div class="title">
                  <p>知识总结：</p>
                </div>
              </el-col>
              <el-col :xs="24" :sm="20" :md="21" :lg="16" :xl="16">
                <div class="grid-content">
                  <p v-html="item.summary.content"></p>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="10" style=" margin-top: 15px; margin-bottom: 10px;">
              <el-col :xs="24" :sm="20" :md="21" :lg="16" :xl="16">
                <div class="text-left ml-20">
                  <el-button class="edit-btn" icon="el-icon-edit" type="primary" plain size="small" @click.prevent="handleModalVisible($event, true, index)">编辑描述</el-button>
                  <el-button icon="el-icon-plus" type="primary" plain @click.prevent="setSummary($event, item, true)" size="small" v-show="!item.summary.defaultShow">添加知识总结</el-button>
                  <el-button icon="el-icon-delete" type="primary" plain @click.prevent="setSummary($event,item, false)" size="small" v-show="item.summary.defaultShow">删除知识总结</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="button-panel">
          <el-row type="flex" justify="center">
            <el-button size="small" type="primary" @click.prevent="goToExplain">上一步</el-button>
            <el-button v-loading.fullscreen.lock="fullscreenLoading" size="small" type="primary" @click.prevent="submitPointDesc">下一步</el-button>
            <el-button size="small" @click.prevent="goToPageList">取消</el-button>
          </el-row>
        </div>
      </el-card>
    </div>
    <!-- 编辑知识点提要 -->
    <el-dialog
      :visible.sync="modalVisible"
      title="编辑知识点提要"
      class="hi-dialog">
      <div class="">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
          <el-tab-pane label="文字" name="text">
            <div class="describes text-tab">
              <div class="point-desc baseline"
                v-for="(item, index) of pointDescribe.describes"
                :key="item.describeId">
                <el-checkbox v-model="item.defaultShow" :key="item.describeId"></el-checkbox>
                <span v-html="item.displayContent" class="ml-20"></span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="音频" name="audio">
            <el-table :data="pointDescribe.audios" border style="width: 100%" size="mini">
              <el-table-column label="选择" width="60" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.defaultShow"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="audioName" label="文件名称"></el-table-column>
              <el-table-column label="文件归类">
                <span slot-scope="scope">解析</span>
              </el-table-column>
              <el-table-column label="文件大小" width="120">
                <span slot-scope="scope">{{convertFileSize(scope.row.fileLength)}}</span>
              </el-table-column>
            </el-table>
            <!-- <div class="audio-tab" style="color:#20a0ff" v-for="(item, index) of pointDescribe.audios" :key="item.id">

 
              <el-checkbox v-model="item.defaultShow"></el-checkbox>
              <el-popover placement="right" width="400" trigger="click" @hide="stopAudioPlay">
                <audio controls :src="item.linkUrl" :ref="`audioPopover${index}`"></audio>
                <span class="audio-name ml-20" slot="reference">{{item.audioName}}</span>
              </el-popover>
            </div> -->
          </el-tab-pane>
          <el-tab-pane label="视频" name="video">
            <el-table :data="pointDescribe.videos" border style="width: 100%" size="mini">
              <el-table-column label="选择" width="60" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.defaultShow"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="videoName" label="文件名称"></el-table-column>
              <el-table-column label="文件归类">
                <span slot-scope="scope">{{scope.row.useType === 'SPEAK' ? videoType(scope.row.courseTypeId) : '视频解析'}}</span>
              </el-table-column>
              <el-table-column label="文件大小" width="120">
                <span slot-scope="scope">{{convertFileSize(scope.row.fileLength)}}</span>
              </el-table-column>
            </el-table>
            <!-- <div class="video-tab" style="color: #20a0ff; cursor: pointer;" v-for="(item, index) of pointDescribe.videos" :key="item.id">
              <el-checkbox v-model="item.defaultShow"></el-checkbox>
              <span class="ml-20" @click.prevent="playVideo(item)">{{item.videoName}}</span>
            </div> -->
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- dialog-footer -->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleModalClose(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="setDescriptions">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/lecture'
import _ from 'lodash'
import TrStep from '../../layout/lecture/Step.vue'
import TrLectureOverview from './Overview.vue'

export default {
  name: 'PointDescription',
  components: { TrStep, TrLectureOverview },
  mounted () {
    this.fetch()
    this.getOverview()
    this.getDictionary()
  },
  computed: {
    lectureId () {
      return this.$route.params.lectureId
    }
  },
  updated () {
    if (window.MathJax && window.MathJax.Hub) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    }
  },
  data () {
    return {
      steps: [{
        title: '已完成',
        description: '设定知识点'
      }, {
        title: '已完成',
        description: '添加引入,框图'
      }, {
        title: '进行中',
        description: '编辑描述,总结'
      }, {
        title: '未开始',
        description: '添加例题,练习题'
      }, {
        title: '未开始',
        description: '完成'
      }],
      fullscreenLoading: false,
      defaultActive: 2,
      modalVisible: false,
      pointDescribes: [],
      // 针对 pointDescribes 的 element 的 引用作用
      pointDescribe: {},
      describes: [],
      videos: [],
      audios: [],
      refIndex: 0,
      // 概览试题 变量
      lectureDataSource: {
        pointItemOverviewVoList: [],
        duration: 0,
        itemTotal: 0
      },
      activeTab: 'text',
      courseTypeOptions: []
    }
  },
  methods: {
    async getDictionary () {
      let params = {
        type: 'LECTURE',
        needUnchecked: false
      }
      let res = await api.getDictionary(params)
      if (res.success && Array.isArray(res.data)) {
        const record = res.data.find(v => v.key === 'courseTypeId')
        if (record) this.courseTypeOptions = record.list
      }
    },
    getVideo (videos) {
      if (!videos || videos.length === 0) return []
      return videos.filter(v => !v.useType && v.defaultShow)
    },
    getKnowledgeVideo (videos) {
      if (!videos || videos.length === 0) return []
      return videos.filter(v => v.useType === 'SPEAK' && v.defaultShow)
    },
    async fetch () {
      let params = {lectureId: this.lectureId}
      try {
        this.fullscreenLoading = true
        let res = await api.fetch(params)
        if (res.success) {
          this.$message({ message: res.message || '', type: 'success' })
          if (!res.data || !res.data.pointDescribes) {
            return
          }
          let pointDescribes = res.data && res.data.pointDescribes
          this.pointDescribes = _.isArray(pointDescribes) ? _.cloneDeep(pointDescribes) : []
        } else {
          this.$message({ message: res.message || '', type: 'error' })
        }
      } catch (e) {
        this.$message({ message: e.message || '', type: 'error' })
      } finally {
        this.fullscreenLoading = false
      }
    },
    setSummary(event, item, flag) {
      event.currentTarget.blur()
      if (flag && !item.summary.content) {
        this.$message({ message: '该知识点下暂无知识点描述...', type: 'warning' })
      } else {
        item.summary.defaultShow = flag
      }
    },
    handleModalVisible (event, flag, index) {
      event.currentTarget.blur()
      this.pointDescribe = _.cloneDeep(this.pointDescribes[index])
      this.refIndex = index
      this.modalVisible = !!flag
    },
    handleModalClose (flag) {
      this.pointDescribe = {}
      this.modalVisible = !!flag
    },
    setDescriptions () {
      this.pointDescribes[this.refIndex] = this.pointDescribe
      this.refIndex = 0
      this.pointDescribe = {}
      this.handleModalClose(false)
    },
    async submitPointDesc () {
      let pointDescribes = _.map(this.pointDescribes, item => {
        item.describes = _.filter(item.describes, des => des.defaultShow)
        item.audios = _.filter(item.audios, item => item.defaultShow)
        item.videos = _.filter(item.videos, item => item.defaultShow)
        return {
          describeIds: _.map(item.describes, des => des.describeId),
          explainId: item.summary.defaultShow ? item.summary.explainId : '',
          pointId: item.pointId,
          audioIds: _.map(item.audios, audio => audio.defaultShow && audio.id),
          videoIds: _.map(item.videos, video => video.defaultShow && video.id)
        }
      })
      let params = {
        lectureId: this.lectureId,
        pointDescribe: pointDescribes
      }
      try {
        this.fullscreenLoading = true
        let res = await api.updatePointDesc(params)
        if (res.success) {
          this.$message({ type: 'success', message: res.message || '' })
          // 跳转到添加例题练习题页面
          this.goToItems()
        } else {
          this.$message({ type: 'error', message: res.message || '' })
        }
      } catch (e) {
        this.$message({ type: 'error', message: e.message || '' })
      } finally {
        this.fullscreenLoading = false
      }
    },
    goToExplain () {
      history.back(-1)
    },
    goToItems () {
      this.$router.push({
        name: 'lecture_exercises_items',
        params: {
          lectureId: this.lectureId
        },
        query: this.$route.query
      })
    },
    // 返回讲义列表
    goToPageList () {
      let name = this.$route.query.hasOwnProperty('source') ? 'draft' : 'lecture_index'
      this.$router.push({
        name
      })
    },
    // 概览列表删除题目
    async overviewRemoveItem (item) {
      const { pointId } = item
      const { lectureId } = this
      if (!pointId) {
        return this.$message.warning('该题目无id')
      }
      let res = await api.clearItem({lectureId, pointId})
      if (res.success) {
        this.lectureDataSource.pointItemOverviewVoList.splice(this.lectureDataSource.pointItemOverviewVoList.indexOf(item), 1)
        this.getOverview()
      } else {
        this.$message.error('删除题目失败...')
      }
    },
    async overviewRemoveAllItem () {
      if (this.lectureDataSource.itemTotal === 0) {
        return this.$message.info('无可删除的题目')
      }
      const { lectureId } = this
      let res = await api.clearAllItems({ lectureId })
      if (res.success) {
        this.$message.success('清空成功...')
        this.getOverview()
      } else {
        this.$message.error('清空所有题目失败...')
      }
    },
    async getOverview () {
      let res = await api.overview({lectureId: this.$route.params.lectureId})
      if (res.success) {
        this.lectureDataSource = Object.assign({}, res.data || {})
      } else {
        this.$message.error('无法删除')
      }
    },
    handleTabClick (tab, event) {
      this.activeTab = tab.name
      console.log(tab.name)
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
    },
    showTitle (items) {
      return items.some(item => item.defaultShow)
    },
    videoType (courseTypeId) {
      const record = this.courseTypeOptions.find(v => v.code === courseTypeId)
      return record ? record.label : ''
    },
    convertFileSize (size) {
      if (!size) return '-'
      let n = size / 1e6
      n = n.toFixed(2)
      return n + 'MB'
    }
  }
}
</script>

<style lang="less">
  .point-description {
    .content {
      font-size: 14px;
      .point-header.el-col-24 {
        width: inherit !important;
        display: flex;
        .left-image {
          background-repeat: no-repeat;
          background-image: url(../../../assets/images/left.png);
          width: 4px;
          height: 35px;
          position: relative;
          left: -2px;
          top: 2px;
        }
        .middle-image {
          background-repeat: repeat-x;
          background-image: url(../../../assets/images/middle.png);
          position: relative;
          top: 5px;
          left: -2px;
          height: 32px;
          line-height: 32px;
        }
        .right-image {
          background-image: url(../../../assets/images/right.png);
          background-repeat: no-repeat;
          height: 32px;
          width: 30px;
          position: relative;
          top: 5px;
          left: -2px;
        }
      }
      .point-name {
        position: relative;
        // left: -20px;
        font-size: 14px;
        padding: 4px 16px;
        // background: #2f91f1;
        color: #fff;
      }
      .title {
        text-align: right;
      }

      img {
        max-width: 375px !important;
      }
    }
    .button-panel {
      margin-top: 20px;
    }
  }
</style>
