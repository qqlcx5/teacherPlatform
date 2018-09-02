<template lang="html">
  <div class="lecture-finish-show">
    <!-- 创建步骤进度条 -->
    <tr-step :active="defaultActive" :items="steps">
    </tr-step>
    <el-card>
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 70vh;">
        <i class="el-icon-check" style="color: #19be6b; font-size: 2rem;"></i>
        <p style="color: 495060; font-size: 14px;">保存成功</p>
        <p style="color: #80848f;">可在我的讲义中查看</p>
      </div>
      <div class="button-panel">
        <el-row type="flex" justify="center">
          <el-button size="small" type="primary" @click.prevent="preview">预览</el-button>
          <el-button size="small" @click.prevent="goToPageList">完成 返回</el-button>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import TrStep from '../../layout/lecture/Step.vue'
export default {
  name: 'lecture-finish-show',
  components: { TrStep },
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
        title: '已完成',
        description: '添加例题,练习题'
      }, {
        title: '进行中',
        description: '完成'
      }],
      defaultActive: 4
    }
  },
  methods: {
    preview () {
      this.$router.push({
        name: 'lecture_preview',
        params: {
          lectureId: this.$route.params.lectureId
        },
        query: this.$route.query
      })
    },
    goToPageList () {
      // 回到我 的讲义列表 -- bug#4961
      // let name = this.$route.query.hasOwnProperty('source') ? 'draft' : 'lecture_index'
      this.$router.push({
        name: 'lecture_index'
      })
    }
  }
}
</script>

<style lang="less">
</style>
