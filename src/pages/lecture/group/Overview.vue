<template lang="html">
  <div class="lecture-overview">
    <div class="overview">
      <el-button size="small" type="primary">讲义概览</el-button>
      <div class="overview-panel">
        <el-table
          stripe
          class="hi"
          size="small"
          max-height="280"
          :data="lectureDataSource.pointItemOverviewVoList"
          style="width: 100%;">
          <el-table-column
            prop="pointName"
            label="已选知识点"
            width="130">
          </el-table-column>
          <el-table-column
            prop="exampleTotal"
            label="例题数"
            width="80">
          </el-table-column>
          <el-table-column
            prop="exerciseTotal"
            label="练习题数"
            width="80">
          </el-table-column>
          <el-table-column
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.prevent="handleDelete(scope.row)">清空</el-button>
            </template>
          </el-table-column>
        </el-table>
        <footer class="overview-footer shadow">
          <span class="w-">合计: {{lectureDataSource.itemTotal}}题</span>
          <span>预计用时: {{lectureDataSource.duration}}分钟</span>
          <span class="cursor-pointer" @click.prevent="clearAllItems">
            <i class="el-icon-delete mr-5" ></i>
            清空所有题目
          </span>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LectureOverview',
  props: {
    lectureDataSource: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    clearAllItems () {
      this.$emit('overview-remove-all-item')
    },
    handleDelete (item) {
      this.$emit('overview-remove-item', item)
    }
  }
}
</script>

<style lang="less">
  .lecture-overview {
    .overview {
      height: 50px;
      z-index: 999;
      position: absolute;
      right: 40px;
      top: 188px;
      margin-top: 4px;
    }

    .overview-panel {
      margin-top: 5px;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 1px 6px rgba(0,0,0,.2);
      position: absolute;
      right: 0px;
      z-index: 900;
      display: none;

      .el-table thead.is-group th {
          background: #f5f7fa;
      }
    }

    .overview-footer {
      justify-content: space-between;
      display: flex;
      border: 1px solid #dddee1;
      height: 30px;
      line-height: 30px;
      padding: 0 20px;

      span:hover {
        color: #57a3f3;
        background-color: transparent;
        border-color: #57a3f3;
      }
    }

    .overview:hover .overview-panel {
      display: block;
    }

    .overview-panel:hover .overview-panel {
      display: block;
    }

    .mr-5 {
      margin-right: 5px;
    }
  }
</style>
