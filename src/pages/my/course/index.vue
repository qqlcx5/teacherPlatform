<template lang="html">
  <div class="course-list">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
     <el-tab-pane label="班级课" name="FULLFILL_CLASS">
       <!-- 筛选器 -->
       <search-bar v-model="queryParams.searchKey" v-if="activeName === 'FULLFILL_CLASS'" key="FULLFILL_CLASS" @search="search" class="mb-20" placeholder-text="按课程名称/主讲老师名称搜索"/>
       <topic-selector v-if="activeName === 'FULLFILL_CLASS'" key="FULLFILL_CLASS" @change="changeSelector" type="FULLFILL_CLASS" ref="topicSelector" />
       <el-row :gutter="20">
         <el-col style="margin-bottom: 20px;" :span="6" v-for="item in dataSource" :key="item.id">
           <course-card key="FULLFILL_CLASS" :card-data="item" />
         </el-col>
       </el-row>
       <!-- 分页 -->
       <div class="text-right mt-20" v-if="pageTotal > 0">
         <el-pagination class="hi" background :current-page="queryParams.currentPage" @current-change="changePage" :page-size="queryParams.pageSize" layout="total, prev, pager, next, jumper" :total="pageTotal">
         </el-pagination>
       </div>
     </el-tab-pane>
     <el-tab-pane label="双师" name="DOUBLE_TEACHER">
       <!-- 筛选器 -->
       <search-bar v-model="queryParams2.searchKey" v-if="activeName === 'DOUBLE_TEACHER'" key="DOUBLE_TEACHER" @search="search" class="mb-20" placeholder-text="按课程名称/主讲老师名称搜索"/>
       <topic-selector v-if="activeName === 'DOUBLE_TEACHER'" key="DOUBLE_TEACHER" @change="changeSelector" type="DOUBLE_TEACHER" ref="topicSelector" />
       <el-row :gutter="20" v-if="activeName === 'DOUBLE_TEACHER'">
         <el-col style="margin-bottom: 20px;" :span="6" v-for="item in dataSource" :key="item.id">
           <course-card key="DOUBLE_TEACHER" :card-data="item" />
         </el-col>
       </el-row>
       <!-- 分页 -->
       <div class="text-right mt-20" v-if="pageTotal > 0">
         <el-pagination class="hi" background :current-page="queryParams2.currentPage" @current-change="changePage" :page-size="queryParams2.pageSize" layout="total, prev, pager, next, jumper" :total="pageTotal">
         </el-pagination>
       </div>
     </el-tab-pane>
   </el-tabs>
  </div>
</template>

<script>
import TopicSelector from '@/components/topicSelector/Index'
import SearchBar from '@/components/searchBar/Index'
import CourseCard from './components/card.vue'
import api from '@/api/course.js'
export default {
  name: 'Course',
  components: {
    TopicSelector,
    SearchBar,
    CourseCard
  },
  mounted () {
    if (this.activeName === 'DOUBLE_TEACHER') {
      this.getCourseList(this.queryParams2)
    } else {
      this.getCourseList(this.queryParams)
    }
  },
  data () {
    return {
      selectedResult: {},
      pageTotal: 0,
      searchBtnLoading: false,
      queryParams: {
        pageSize: 8,
        currentPage: 1,
        productLine: 'FULLFILL_CLASS',
        searchKey: ''
      },
      queryParams2: {
        pageSize: 8,
        currentPage: 1,
        productLine: 'DOUBLE_TEACHER',
        searchKey: ''
      },
      activeName: this.getProductLine(),
      dataSource: []
    }
  },
  computed: {
    userSgr() {
      return this.$store.state.user.userSgr
    }
  },
  watch: {
    userSgr(val) {
      if (this.activeName === 'DOUBLE_TEACHER') {
        // this.$refs['topicSelector'].getSelectorData('DOUBLE_TEACHER')
        this.getCourseList(this.queryParams2)
      } else {
        // this.$refs['topicSelector'].getSelectorData('FULLFILL_CLASS')
        this.getCourseList(this.queryParams)
      }
    }
  },
  methods: {
    getProductLine () {
      if (this.$route.query && this.$route.query.type === 'DOUBLE_TEACHER') {
        return 'DOUBLE_TEACHER'
      } else {
        return 'FULLFILL_CLASS'
      }
    },
    changeSelector(val) {
      this.selectedResult = val
      if (this.activeName === 'FULLFILL_CLASS') {
        this.queryParams = {...this.queryParams, ...val}
        this.getCourseList(this.queryParams)
      } else {
        this.queryParams2 = {...this.queryParams2, ...val}
        this.getCourseList(this.queryParams2)
      }
    },
    async getCourseList (params) {
      let res = await api.getCourseList(params)
      if (res.success) {
        this.dataSource = res.data.list
        this.pageTotal = res.data.total
        this.$message.success(res.message || '请求成功...')
      } else {
        this.$message.error(res.message || '请求失败...')
      }
    },
    changePage(currentPage) {
      if (this.activeName === 'FULLFILL_CLASS') {
        this.queryParams.currentPage = currentPage
        this.getCourseList(this.queryParams)
      } else {
        this.queryParams2.currentPage = currentPage
        this.getCourseList(this.queryParams2)
      }
    },
    async search(val) {
      if (this.activeName === 'FULLFILL_CLASS') {
        this.queryParams.searchKey = val
        this.searchBtnLoading = true
        await this.getCourseList(this.queryParams)
        this.searchBtnLoading = false
      } else {
        this.queryParams2.searchKey = val
        this.searchBtnLoading = true
        await this.getCourseList(this.queryParams2)
        this.searchBtnLoading = false
      }
    },
    async handleClick (tab) {
      this.$router.push({
        name: 'courseIndex',
        query: {
          type: tab.name
        }
      })
      if (this.activeName === 'FULLFILL_CLASS') {
        this.initQueryParams('FULLFILL_CLASS')
        await this.getCourseList(this.queryParams)
      } else {
        this.initQueryParams('DOUBLE_TEACHER')
        await this.getCourseList(this.queryParams2)
      }
    },
    initQueryParams (type) {
      if (type === 'FULLFILL_CLASS') {
        this.queryParams = {
          pageSize: 8,
          currentPage: 1,
          productLine: 'FULLFILL_CLASS',
          searchKey: ''
        }
      } else {
        this.queryParams2 = {
          pageSize: 8,
          currentPage: 1,
          productLine: 'DOUBLE_TEACHER',
          searchKey: ''
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.course-list {
  background: #fff;
  padding: 20px;

  .course-card-list {
    display: flex;
  }

  .topic-selector__wrap {
    border: 1px solid #eee;
  }
}
</style>
