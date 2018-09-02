<template lang="html">
  <div class="associate-dialog">
    <el-dialog :close-on-click-modal="false" :lock-scroll="false" title="关联题目" :visible.sync="visible" :before-close="handleClose" custom-class="m-dialog" class="m-add-qu-dialog" center>
      <el-steps class="hi-steps" :active="activeStep" finish-status="success" align-center>
        <el-step title="选择试卷"></el-step>
        <el-step title="选择试题"></el-step>
      </el-steps>
      <div class="paper-wrapper" v-show="activeStep === 0">
        <div class="search-box" style="margin: 10px 0;">
          <v-search-bar @search="handleSearch" v-model="queryPaperParams.searchPaperName" placeholder-text="请输入关键字搜索" class="mr-20" />
        </div>
        <div class="qu-list">
          <v-table
            ref="singleTable"
            class="v-table"
            :data="paperList"
            border
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%"
            :columns="paperColumnsList" />
        </div>
        <div class="text-right mt-20" v-if="paperList.length > 0">
          <el-pagination class="hi" background :current-page="queryPaperParams.currentPage" @current-change="changePage" :page-size="10" layout="total, prev, pager, next" :total="queryPaperParams.pageTotal">
          </el-pagination>
        </div>
      </div>
      <div class="item-wrapper" v-show="activeStep === 1" >
        <div class="qu-list">
          <v-table
            class="v-table"
            :data="itemList"
            border
            style="width: 100%"
            :columns="itemColumnsList"
            size="mini"
            @selection-change="handleSelectionChange" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <span v-show="activeStep === 0">
          <el-button type="primary" size="small" :disabled="!currentPaper" @click="submitPaper">下一步</el-button>
        </span>
        <span v-show="activeStep === 1">
          <el-button type="primary" size="small" @click="preStep">上一步</el-button>
          <el-button type="primary" size="small" @click="submit">确认</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vSearchBar from '@/components/searchBar/Index'
import vTable from '@/components/table'
import { dtextbook } from '@/api'

export default {
  name: 'associate-dialog',
  inject: ['currentChapter', 'textbookId'],
  components: {
    vSearchBar,
    vTable
  },
  props: {
    visible: Boolean
  },
  data() {
    return {
      activeStep: 0,
      paperColumnsList: [
        {
          label: '试卷名称',
          prop: 'paperName',
          'show-overflow-tooltip': true
        },
        {
          label: '创建人',
          align: 'center',
          prop: 'createUser',
          width: 80
        },
        {
          label: '创建时间',
          prop: 'createTime',
          'show-overflow-tooltip': true,
          width: 160
        }
      ],
      itemList: [],
      itemColumnsList: [
        {
          type: 'selection',
          width: 55,
          align: 'center',
          selectable: (row, index) => {
            return !row.addStatus
          }
        },
        {
          label: '题型',
          align: 'center',
          prop: 'itemTypeName',
          width: 80
        },
        {
          label: '题干内容',
          render: (h, params) => {
            return <div domPropsInnerHTML={params.row.itemContent} style="display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical;overflow: hidden;max-height:64px" />
          }
        },
        {
          label: '操作',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('span', [
              h('el-tooltip', {
                props: {
                  effect: 'blue',
                  content: '查看',
                  placement: 'top'
                },
                style: {
                  marginRight: '5px'
                }
              }, [
                h('button', {
                  'class': 'm-table-btn__operate',
                  on: {
                    click: () => {
                      this.view(params.row.itemId)
                    }
                  }
                }, [
                  h('i', {
                    class: 'iconfont icon-See'
                  })
                ])
              ])
              // h('el-tooltip', {
              //   props: {
              //     effect: 'blue',
              //     content: content,
              //     placement: 'top'
              //   }
              // }, [
              //   h('button', {
              //     'class': 'm-table-btn__operate',
              //     on: {
              //       click: () => {
              //         handler(params.row)
              //       }
              //     }
              //   }, [
              //     h('i', {
              //       class: iconClass
              //     })
              //   ])
              // ])
            ])
          }
        }
      ],
      paperList: [],
      queryPaperParams: {
        currentPage: 1,
        pageSize: 10,
        searchPaperName: this.currentChapter.name,
        pageTotal: 0
      },
      currentPaper: null,
      multipleSelection: []
    }
  },
  methods: {
    handleSearch() {
      if (this.activeStep) {
        this.getItemList()
      } else {
        this.getPaperList(this.queryPaperParams)
      }
    },
    handleClose() {
      this.activeStep = 0
      this.$emit('update:visible', !this.visible)
    },
    submitPaper() {
      this.getItemList()
    },
    async getItemList() {
      try {
        if (!this.currentPaper) {
          this.$message.info('请先选择试卷...')
          return null
        }
        let res = await dtextbook.getItemList(this.currentChapter.id, this.currentPaper.paperId)
        this.itemList = res.data
        this.activeStep = 1
      } catch (e) {
        this.$message.error(e)
      }
    },
    async getPaperList(params) {
      try {
        let res = await dtextbook.getPaperList(params)
        this.paperList = res.data.list || []
        this.queryPaperParams.pageTotal = res.data.total || 0
      } catch (e) {
        this.$message.error(e)
      }
    },
    changePage(page) {
      this.queryPaperParams.currentPage = page
      this.getPaperList(this.queryPaperParams)
    },
    handleCurrentChange(val) {
      this.currentPaper = val
    },
    async relateItemsToMatter(itemIds) {
      try {
        let params = {
          textbookChapterId: this.currentChapter.id,
          itemIds: itemIds
        }
        let res = await dtextbook.relateItemsToMatter(params)
        if (res.success) {
          this.activeStep = 0
          this.$message.success(res.message || '成功')
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // delQu() {},
    view(itemId) {
      this.$emit('view-question-detail', itemId)
    },
    async submit() {
      if (this.multipleSelection.length) {
        let itemIds = this.multipleSelection.map(item => item.itemId)
        await this.relateItemsToMatter(itemIds)
      }
      this.$emit('update:visible', false)
      this.$emit('on-success')
    },
    preStep() {
      this.activeStep = 0
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },
  mounted() {
    this.getPaperList(this.queryPaperParams)
  }
}
</script>

<style lang="less">
</style>
