<template>
  <div class="question-item shadow">
    <div class="question-item__content" v-html="`${index}、<em class='question-item__type'>[${data.itemType}]</em>${data.content}`">
    </div>
    <div v-if="data.subItems && data.subItems.length > 0">
      <question-item :data="item" :index="index+1" v-for="(item, index) in data.subItems" :key="item.itemId"/>
    </div>
    <template v-else>
      <div class="question-item__extra" v-if="data.options && data.options.length > 0">
        <div class="question-item-cho">
          <dl class="question-item-cho__item" v-for="item in data.options" :key="item.id">
            <dt class="">{{item.optionCode}}.</dt>
            <dd class="" v-html="item.content"></dd>
          </dl>
        </div>
      </div>
      <div class="question-item__extend">
        <div class="question-item__tags">
          <span v-for="item in data.tags" :key="item">{{item}}</span>
        </div>
        <div class="question-item__view-anslysis">
          <span @click="viewAnswer(data)"><i class="el-icon-arrow-down"></i>查看解析</span>
        </div>
      </div>
      <div class="question-item__analysis" v-if="data.selected">
        <dl class="question-item__analysis-item">
          <dt>难度：</dt>
          <dd>{{data.diffLevelValue}}</dd>
        </dl>
        <dl class="question-item__analysis-item">
          <dt>考点：</dt>
          <dd>{{data.points}}</dd>
        </dl>
        <dl class="question-item__analysis-item" v-if="data.answer">
          <dt>答案：</dt>
          <dd>{{data.answer}}</dd>
        </dl>
        <dl class="question-item__analysis-item" v-if="data.detail">
          <dt>解析：</dt>
          <dd>{{data.detail}}</dd>
        </dl>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'question-item',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    index: Number
  },
  methods: {
    viewAnswer(item) {
      this.$set(item, 'selected', !item.selected)
    }
  }
}
</script>
