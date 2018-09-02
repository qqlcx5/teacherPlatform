<template lang="html">
  <div class="table-point" v-mathjax v-if="!data.hidden">
    <v-content-extand style="padding-left: 0;">
      <div class="knowledge-name cat-name">
        <div class="body">
          <i class="lecture-icon iconfont icon-biaoqian1"></i>
          <span style="margin-left: 5px;">{{data.templateName}}</span>
        </div>
      </div>
    </v-content-extand>
    <div style="margin-left: 20px; margin-bottom: 30px;">
      <el-table :data="pointTableVo.lecturePointRequireVos" border style="width: 100%">
        <el-table-column :prop="item.key" :label="item.title" v-for="item in pointTableVo.pointTableHeaders" :key="item.key">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import vContentExtand from '@/components/content-expand'

export default {
  name: 'tablePoint',
  components: { vContentExtand },
  props: {
    data: Object
  },
  data () {
    return {
    }
  },
  methods: {},
  computed: {
    pointTableVo () {
      return this.data.children && this.data.children[0].pointTableVo
    }
  }
}
</script>

<style lang="less">
.table-point{

}
</style>
