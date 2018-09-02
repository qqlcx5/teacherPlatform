<template lang="html">
  <div class="exercises-and-pointitems">
    <!-- 创建步骤进度条 -->
    <tr-step :active="defaultActive" :items="steps">
    </tr-step>
    <!-- 讲义试题数据概览 -->
    <tr-lecture-overview
      :lectureId="$route.params.lectureId"
      :lecture-data-source="lectureDataSource"
      @overview-remove-item="overviewRemoveItem"
      @overview-remove-all-item="overviewRemoveAllItem" />
    <!-- 例题， 练习题展示 -->
    <div class="content">
      <el-card>
        <!-- 讲义名称 -->
        <div class="lecture-name">
          <span>{{dataSource.lectureName}}</span>
        </div>
        <div class="lecture-body">
          <!-- 例题 -->
          <div class="point-item-wrapper"
            v-for="(pointItem, index) of dataSource.pointItems"
            :key="pointItem.pointId"
            style="margin-top: 20px;">
            <el-row type="flex" justify="start" align="middle" :gutter="20">
              <el-col class="point-header">
                <span class="left-image"></span>
                <span class="middle-image">
                  <span class="point-name">{{pointItem.pointName}}</span>
                </span>
                <span class="right-image"></span>
              </el-col>
              <div class="ml-20">
                <el-button icon="el-icon-plus" size="small" type="primary"
                  plain @click="handleDialogVisible(true, pointItem, 'EXAMPLE')">
                  添加例题</el-button>
                <el-button icon="el-icon-plus" size="small" type="primary"
                  plain @click="handleDialogVisible(true, pointItem, 'EXERCISES')">
                  添加练习题</el-button>
              </div>
            </el-row>
            <el-row type="flex" justify="start" align="middle">
              <el-col>
                <tr-question
                  class="mb-20 point-item-wrap"
                  :show-tag="true"
                  v-for="(item, itemIndex) in pointItem.itemList"
                  :data="item"
                  :key="item.itemId"
                  :idx="itemIndex+1">
                  <div slot="top-button-field" class="point-buttons">
                    <el-button icon="el-icon-edit"
                      size="small"
                      type="primary"
                      plain
                      :disabled="btnDisabled"
                      @click.stop="toggleFold(item, index, itemIndex)">{{item.hiddenDetail ? '展开' : '收起'}}</el-button>
                    <el-button icon="el-icon-edit"
                      size="small"
                      type="primary"
                      plain
                      @click.stop="editShownoAndScore(item)">编辑题号/分数</el-button>
                    <el-button :class="item.id" icon="el-icon-arrow-up"
                      v-show="itemIndex !== 0"
                      size="small" type="primary"
                      plain
                      :disabled="btnDisabled"
                      @click.stop="moveItemUp($event, item)">上移</el-button>
                    <el-button class="item-move-down"
                      icon="el-icon-arrow-down"
                      v-show="(pointItem.itemList.length - 1) !== itemIndex "
                      size="small" type="primary"
                      plain
                      :disabled="btnDisabled"
                      @click.stop="moveItemDown($event, item)">下移</el-button>
                    <el-button icon="el-icon-delete"
                      size="small"
                      type="primary"
                      plain
                      :disabled="btnDisabled"
                      @click.stop="deleteItem(item)">删除</el-button>
                  </div>
                </tr-question>
              </el-col>
            </el-row>
          </div>
          <!-- 练习题 -->
          <div v-if="dataSource.exercises.length" class="point-item-wrapper">
            <el-row type="flex" justify="start" align="middle">
              <el-col>
                <p class="exercises-header">练习题</p>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start" align="middle">
              <el-col>
                <tr-question
                  :show-tag="true"
                  class="mb-20 point-item-wrap"
                  v-for="(item, index) of dataSource.exercises" :data="item" :key="item.itemId"
                  :idx="index + 1">
                  <div slot="top-button-field" class="point-buttons">
                    <el-button icon="el-icon-edit"
                      size="small"
                      type="primary"
                      plain
                      @click.stop="toggleExercisesFold(item, index)">{{item.hiddenDetail ? '展开' : '收起'}}</el-button>
                    <el-button icon="el-icon-edit" size="small"
                      type="primary" plain
                      @click.stop="editShownoAndScore(item)">编辑题号/分数</el-button>
                    <el-button class="exercises-move-up"
                      icon="el-icon-arrow-up"
                      v-show="index !== 0"
                      size="small"
                      type="primary"
                      plain
                      @click.stop="moveItemUp($event, item, index)">上移</el-button>
                    <el-button
                      class="exercises-move-down"
                      icon="el-icon-arrow-down"
                      v-show="(dataSource.exercises.length - 1) !== index "
                      size="small" type="primary"
                      plain
                      @click.stop="moveItemDown($event, item)">下移</el-button>
                    <el-button
                      size="small"
                      type="primary"
                      icon="el-icon-delete"
                      plain
                      :disabled="btnDisabled"
                      @click.stop="deleteItem(item)">删除</el-button>
                  </div>
                </tr-question>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="button-panel">
          <el-row type="flex" justify="center">
            <el-button size="small" type="primary" @click.prevent="goToPre">上一步</el-button>
            <el-button v-loading.fullscreen.lock="fullscreenLoading" size="small" type="primary" @click.prevent="submit">保存</el-button>
            <el-button size="small" type="primary" @click.prevent="preview">预览</el-button>
            <el-button size="small" @click.prevent="goToPageList">取消</el-button>
          </el-row>
        </div>
      </el-card>
    </div><!-- 例题， 练习题展示 -->
    <!-- dialog for select item -->
    <el-dialog
      :visible.sync="modalVisible"
      title="添加例题"
      class="hi-dialog w-800"
      :lock-scroll="false">
      <div class="">
        <search-bar @search="searchItems" class="mb-20 mr-20"
        :placeholder-text="formData.searchType === 'STEM' ? '请输入题干内容' : '请输入标签名称'" />
        <el-radio v-model="formData.searchType" label="STEM">按题干搜索</el-radio>
        <el-radio v-model="formData.searchType" label="TAG">按标签搜索</el-radio>
        <el-radio v-model="formData.searchType" label="SOURCE_TAG">按来源标签搜索</el-radio>
        <topic-selector @change="changeSelector" type="ITEM" ref="topicSelector" />
        <div class="" style="height: 400px;overflow-y: auto;">
          <el-row type="flex" justify="start" align="middle">
            <el-col>
              <question-item :data="item"
                v-for="(item, index) in dataSource.lectureItemList"
                :key="item.itemId" style="margin-bottom: 20px;">
                <div slot="top-button-field"
                  class="top-button-field"
                  style="text-align: right;">
                  <el-button icon="el-icon-plus" plain
                    :disabled="btnDisabled"
                    v-show="!item.addFlag" size="small" type="primary"
                    @click.prevent="addItem(item)">添加该题</el-button>
                  <el-button icon="el-icon-delete" plain
                    v-show="item.addFlag"
                    size="small"
                    :disabled="btnDisabled"
                    @click.prevent="removeItem(item)">取消该题</el-button>
                </div>
              </question-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" v-show="totalPages > 0" class="dialog-footer" style="text-align: center;">
        <el-button size="small" type="primary" @click="getPrePage" :disabled="isFirstPage">上一页</el-button>
        <span style="padding: 6px 15px; font-size: 12px;">{{dataSource.currentPage}} / {{totalPages}}</span>
        <el-button size="small" type="primary" @click="getNextPage" :disabled="isLastPage">下一页</el-button>
      </div>
    </el-dialog>
    <!-- 编辑题号分数dialog -->
    <showno-score-dialog
      v-if="shownoScoreDialogVisible"
      :visible="shownoScoreDialogVisible"
      :item="currentItem"
      @cancel-score-dialog="cancelScoreDialog"
      @success-score-dialog="successScoreDialog" />
  </div>
</template>

<script>
import api from '@/api/lecture'
import TrStep from '../../layout/lecture/Step.vue'
import TrQuestion from '@/components/question/Index'
import QuestionItem from '@/pages/question/Item'
import TopicSelector from '@/components/topicSelector/Index'
import TrLectureOverview from './Overview.vue'
import SearchBar from '@/components/searchBar/Index'
import shownoScoreDialog from './ShownoScoreDialog.vue'

export default {
  name: 'ExercisesAndPointItems',
  components: { TrStep, TrQuestion, TopicSelector, TrLectureOverview, SearchBar, QuestionItem, shownoScoreDialog },
  mounted () {
    this.fetch()
    this.getOverview()
  },
  computed: {
    lectureId () {
      return this.$route.params.lectureId
    },
    totalPages () {
      if (this.dataSource.total && this.dataSource.pageSize) {
        return Math.ceil(this.dataSource.total / this.dataSource.pageSize)
      }
      return 0
    },
    isFirstPage () {
      return this.dataSource.currentPage === 1
    },
    isLastPage () {
      return this.dataSource.currentPage === Math.ceil(this.dataSource.total / this.dataSource.pageSize)
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
        title: '已完成',
        description: '编辑描述,总结'
      }, {
        title: '进行中',
        description: '添加例题,练习题'
      }, {
        title: '未开始',
        description: '完成'
      }],
      // 概览试题 变量
      lectureDataSource: {
        pointItemOverviewVoList: [],
        duration: 0,
        itemTotal: 0
      },
      fullscreenLoading: false,
      defaultActive: 3,
      dataSource: {
        lectureName: null,
        exercises: [],
        pointItems: [],
        lectureItemList: [],
        selectedPointItem: null,
        type: 'EXAMPLE',
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      // 弹框涉及的参数
      modalVisible: false,
      // 根据 知识点 搜索 题目
      formData: {
        currentPage: 1,
        pageSize: 10,
        searchType: 'STEM',
        lectureId: this.$route.params.lectureId,
        searchKey: '',
        pointId: null
      },
      btnDisabled: false,
      shownoScoreDialogVisible: false,
      currentItem: null
    }
  },
  methods: {
    async fetch () {
      let params = {lectureId: this.lectureId}
      try {
        let res = await api.fetch(params)
        if (res.success) {
          const { exercises, pointItems, lectureName } = res.data
          this.dataSource = Object.assign({}, this.dataSource, { exercises, pointItems, lectureName })
        }
      } catch (e) {
        this.$message({ type: 'error', message: e.message || '' })
      }
    },
    goToPre () {
      const { from } = this.$route.query
      switch (from) {
        case 'setPoint':
          this.$route.query.from = ''
          this.$router.push({
            name: 'lecture_set_point_edit',
            params: {
              lectureId: this.lectureId
            },
            query: this.$route.query
          })
          break
        case 'Explain':
          this.$route.query.from = ''
          this.$router.push({
            name: 'lecture_explain',
            params: {
              lectureId: this.lectureId
            },
            query: this.$route.query
          })
          break
        default:
          history.back(-1)
      }
    },
    async submit () {
      try {
        this.fullscreenLoading = true
        let res = await api.save(this.lectureId)
        if (res.success) {
          this.$message({ type: 'success', message: res.message || '' })
          this.goFinishPage()
        } else {
          this.$message({ type: 'error', message: res.message || '' })
        }
      } catch (e) {
        this.$message({ type: 'error', message: e.message || '' })
      } finally {
        this.fullscreenLoading = false
      }
    },
    async moveItemUp (event, item) {
      this.btnDisabled = true
      event.currentTarget.blur()
      const { templateId } = item
      try {
        let res = await api.moveUp({templateId})
        if (res.success) {
          this.fetch()
        } else {
          this.$message.error(res.message || '')
        }
      } catch (e) {
        this.$message.error(e.message || '')
      } finally {
        this.btnDisabled = false
      }
    },
    async moveItemDown (event, item) {
      this.btnDisabled = true
      event.currentTarget.blur()
      const { templateId } = item
      try {
        let res = await api.moveDown({templateId})
        if (res.success) {
          this.fetch()
        } else {
          this.$message.error(res.message || '')
        }
      } catch (e) {
        this.$message.error(e.message || '')
      } finally {
        this.btnDisabled = false
      }
    },
    async deleteItem (item) {
      this.btnDisabled = true
      const { templateId } = item
      try {
        let res = await api.deleteItem({templateId, lectureId: this.lectureId})
        if (res.success) {
          this.fetch()
          this.getOverview()
        } else {
          this.$message.error(res.message || '')
        }
      } catch (e) {
        this.$message.error(e.message || '')
      } finally {
        this.btnDisabled = false
      }
    },
    // 返回讲义列表
    goToPageList () {
      // 根据路由参数是否存在source 字段来判断返回 草稿箱列表 || 我的讲义列表
      let name = this.$route.query.hasOwnProperty('source') ? 'draft' : 'lecture_index'
      this.$router.push({
        name
      })
    },
    preview () {
      this.$router.push({
        name: 'lecture_preview',
        params: {
          lectureId: this.lectureId
        },
        query: this.$route.query
      })
    },
    goFinishPage () {
      this.$router.push({
        name: 'lecture_finish',
        params: {
          lectureId: this.lectureId
        },
        query: this.$route.query
      })
    },
    handleDialogVisible (flag, pointItem, type) {
      // 收集 添加 取消 试题 需要的参数
      this.$set(this.dataSource, 'selectedPointItem', pointItem)
      this.$set(this.dataSource, 'type', type)
      // 配置搜索条件
      this.$set(this.formData, 'pointId', pointItem.pointId)
      this.$set(this.formData, 'currentPage', 1)
      this.getLectureItemList(this.formData)
      this.modalVisible = !!flag
    },
    searchItems (val) {
      this.formData = Object.assign({}, this.formData, { searchKey: val })
      this.getLectureItemList(this.formData)
    },
    changeSelector (data) {
      this.formData = Object.assign({}, this.formData, {...data})
      this.getLectureItemList(this.formData)
    },
    async getLectureItemList (params) {
      let res = await api.getLectureItemList(params)
      if (res.success) {
        this.dataSource = Object.assign({}, this.dataSource, res.data || {})
        this.$set(this.dataSource, 'lectureItemList', res.data.list || [])
        this.$message.success(res.message || '')
      } else {
        this.$message.error(res.message || '')
      }
    },
    async addItem (item) {
      this.btnDisabled = true
      const { lectureId } = this
      const {
        type,
        selectedPointItem: { pointId }
      } = this.dataSource
      const { itemId } = item
      let res = await api.addItem({ itemId, lectureId, pointId, type })
      if (res.success) {
        this.$message.success(res.message || '')
        item.addFlag = true
        item.templateId = res.data
        this.fetch()
        this.getOverview()
      } else {
        this.$message.error(res.message || '')
      }
      this.btnDisabled = false
    },
    async removeItem (item) {
      this.btnDisabled = true
      const { templateId } = item
      let res = await api.removeItem({ lectureId: this.lectureId, templateId })
      if (res.success) {
        item.addFlag = false
        this.$message.success(res.message || '')
        this.fetch()
      } else {
        this.$message.error(res.message || '')
      }
      this.btnDisabled = false
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
        this.fetch()
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
        this.fetch()
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
    getNextPage () {
      this.formData.currentPage += 1
      this.getLectureItemList(this.formData)
    },
    getPrePage () {
      this.formData.currentPage -= 1
      this.getLectureItemList(this.formData)
    },
    editShownoAndScore (item) {
      this.currentItem = item
      this.shownoScoreDialogVisible = true
    },
    cancelScoreDialog (visible) {
      this.currentItem = null
      this.shownoScoreDialogVisible = false
    },
    successScoreDialog(item) {
      if (item.itemTypeId > 100) {
        let { templateId: parentTemplateId, subItems: itemScores, showNo: parentShowNo } = item
        api.subItemShowNoAndScore({ parentTemplateId, itemScores, parentShowNo }).then(res => {
          this.currentItem = null
          this.shownoScoreDialogVisible = false
          this.$message.success(res.message || '修改成功')
          this.fetch()
        }).catch(error => this.$message.error(error.message || '修改失败'))
      } else {
        let { templateId, showNo, itemScore } = item
        api.showNoAndScore({templateId, showNo, itemScore}).then(res => {
          this.currentItem = null
          this.shownoScoreDialogVisible = false
          this.$message.success(res.message || '修改成功')
          this.fetch()
        }).catch(error => this.$message.error(error.message || '修改失败'))
      }
    },
    toggleFold (item, index, itemIndex) {
      item['hiddenDetail'] = !item['hiddenDetail']
      if (item.itemTypeId > 100) {
        item.subItems.forEach(subItem => {
          subItem['hiddenDetail'] = !subItem['hiddenDetail']
        })
      }
      this.dataSource.pointItems[index].itemList.splice(itemIndex, 1, item)
    },
    toggleExercisesFold (item, itemIndex) {
      item['hiddenDetail'] = !item['hiddenDetail']
      if (item.itemTypeId > 100) {
        item.subItems.forEach(subItem => {
          subItem['hiddenDetail'] = !subItem['hiddenDetail']
        })
      }
      this.dataSource.exercises.splice(itemIndex, 1, item)
    }
  }
}
</script>

<style lang="less">
  .exercises-and-pointitems {
    .content {
      font-size: 14px;

      .lecture-name {
        position: relative;
        font-weight: bold;
        text-align: center;
        font-size: 15px;
        top: -8px;
      }

      .lecture-body {
        border: 1px solid #ddd;

        .point-item-wrapper:last-child {
          margin-bottom: 20px;
        }

        .point-item-wrap {
          // padding: 15px;
          margin: 0px 20px 20px;
          padding-top: 50px;

          .point-buttons {
            display: none;
            text-align: right;
            position: relative;
            left: -43px;
            top: -47px;
            height: 0px;

            button {
              border-radius: 0px;
              border-bottom: none;
            }
          }
          .subItems .item-hover {
            border: 1px solid #fff;
          }
        }
        .point-item-wrap > .item-hover {
          padding: 15px;
          border: 1px solid #fff;
          border-radius: 5px;
        }
        .point-item-wrap:hover {
          .item-hover {
            border: 1px solid #5cadff;

            .point-buttons {
              display: block;
            }

            .subItems .item-hover {
              border: 1px solid #fff;
            }
          }
        }
        // .point-item-wrap > .item-hover {
        //   padding: 15px;
        //   border: 1px solid #5cadff;
        //   border-radius: 5px;
        // }

      }

      .button-panel {
        margin-top: 20px;
      }

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
        max-width: 200mm !important;
      }

      .exercises-header {
        margin-left: 20px;
        font-size: 20px;
        font-weight: bold;
      }

      .border-blue {
        border: 1px solid #5cadff;
        border-radius: 5px;
        padding: 15px;
        margin: 50px 20px 20px;
      }
    }
  }

  .top-button-field {
    display: inline-flex;
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .topic-selector__wrap {
    border: 1px solid #eee;
  }
</style>
