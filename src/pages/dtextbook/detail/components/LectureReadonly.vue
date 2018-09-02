<template lang="html">
  <div class="material">
    <div class="main-content">
      <div class="main-content__detail">
        <v-title v-if="lectureName" :value="lectureName" :can-edit="false" style="margin-bottom: 30px"/>
        <div v-if="templateList.length" v-for="(item, index) in templateList" :key="index">
          <v-custom :data="item" :key="item.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vTitle from '@/components/title'
import vCustom from './custom'

export default {
  name: 'lectureReadonly',
  components: {
    vTitle,
    vCustom
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    lectureName() {
      return this.data && this.data.lectureName
    },
    templateList() {
      return this.data && this.data.lectureTemplateList
    }
  }
}
</script>

<style lang="less">
</style>
