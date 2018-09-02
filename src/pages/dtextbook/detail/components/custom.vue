<template lang="html">
  <div class="custom" v-if="!data.hidden">
    <v-content-extand :show-btn="false" style="padding-left: 0;">
      <div class="knowledge-name cat-name" v-if="!data.hidden">
        <i class="lecture-icon iconfont icon-biaoqian1"></i>
        <span style="margin-left: 5px;">{{data.templateName}}</span>
      </div>
    </v-content-extand>
    <div :class="{'body': data.children }">
      <div class="mb-30" v-for="(item, index) in data.children" :key="data.id">
        <v-content-extand :show-btn="false" v-if="item.contextType === 'REF_HYPER_TEXT'">
          <div class="knowledge-name cat-name" v-mathjax>
            <div class="flex-baseline">
              <span class="dot"></span>
              <div class="textbook-detail-item__content flex-1" v-html="updateImgSrc(item.richText.content)"></div>
            </div>
          </div>
        </v-content-extand>
        <!-- 添加习题 -->
        <vQuestion
          v-if="item.contextType === 'ITEM'"
          :data="item"
          :readonly="true"
          :showAnaly="true" />
      </div>
    </div>
  </div>
</template>

<script>
import vContentExtand from '@/components/content-expand'
import mixin from '@/components/mixins'
import vQuestion from '@/pages/lecture/groupLecture/question'

export default {
  name: 'custom',
  components: {
    vQuestion,
    vContentExtand
  },
  mixins: [mixin],
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less">
.custom {
  .body {
    background: rgb(248, 248, 248);
    border: 1px solid #eee;
    padding: 40px 0;

    .m-qu-analy {
      background: rgb(209, 225, 249);
      border: 1px solid rgb(154, 193, 251);
    }
  }

  .ml-20 {
    margin-left: 20px;
  }
  .mb-20 {
    margin-bottom: 20px;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .mb-30{
    margin-bottom: 30px;
  }
  .flex-baseline {
    display: flex;
    align-items: baseline;
  }
  .flex-1 {
    flex: 1;
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: block;
    background: #3587ff;
    margin-right: 10px;
  }
}
</style>
