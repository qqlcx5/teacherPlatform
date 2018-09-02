<template>
  <div class="tb-detail">
    <v-header :data="commonData"/>
    <v-side :data="chapters" :textbook-id="this.$route.params.id"/>
    <v-main />
  </div>
</template>

<script>
import vHeader from './components/Header'
import vSide from './components/Side'
import vMain from './components/Main'
import { textbook } from '@/api'
export default {
  components: {
    vHeader,
    vSide,
    vMain
  },
  data() {
    return {
      commonData: {},
      chapters: [],
      currentChapter: {
        id: '',
        name: ''
      }
    }
  },
  provide() {
    return {
      currentChapter: this.currentChapter,
      textbookId: this.$route.params.id
    }
  },
  created() {
    this.getChapterDetail()
    // 获得对应的管理的url
    this.$store.dispatch('getManageUrl')
  },
  watch: {
    '$route': 'getChapterDetail'
  },
  methods: {
    async getChapterDetail() {
      try {
        let res = await textbook.getChapterDetail(this.$route.params.id)
        let {chapters, ...commonData} = res.data
        this.commonData = commonData
        if (chapters.length > 0) {
          this.chapters = chapters
          Object.assign(this.currentChapter, this.chapters[0])
        }
      } catch (e) {
        this.$message.error(e)
      }
    }
  }
}
</script>

<style lang="less">
.tb-detail {
  --height: ~'calc(100vh - var(--header-height) - 40px - 33px)';
  height: var(--height);
  display: grid;
  grid-gap: 15px;
  grid-template-rows: 95px 1fr;
  grid-template-columns: 260px 1fr;
  grid-template-areas: 'header header' 'side main';
}
.tb-detail-header {
  grid-area: header;
}
.tb-detail-side {
  grid-area: side;
}
.tb-detail-main {
  grid-area: main;
}
</style>
