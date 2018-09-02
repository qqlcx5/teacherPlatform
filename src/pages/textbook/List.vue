<template>
  <article class="textbook-list">
    <router-link tag="section" :to="{name: 'TextBook_detail', params: {id: item.id}}" class="textbook-list__item shadow" v-for="item in data" :key="item.id">
      <div class="textbook-list__hd">
        <i class="textbook-list__icon"></i>
        <span class="textbook-list__tit">{{item.name}}</span>
      </div>
      <div class="textbook-list__bd">
        <span class="textbook-list__grade">
          <em v-if="item.grade">{{item.grade}}</em>
          <em v-if="item.season">{{item.season}}</em>
          <em v-if="item.type">{{item.type}}</em>
        </span>
        <span class="textbook-list__region">
          <em>{{item.productLine}}</em>
          <em v-if="item.productLine && item.region" style="margin: 0 3px">/</em>
          <em>{{item.region}}</em>
        </span>
      </div>
      <div class="textbook-list__ft">
        <span class="textbook-list__count">共
          <em>{{item.courseCount}}</em>次课</span>
        <span class="textbook-list__year">{{item.year}}</span>
      </div>
    </router-link>
  </article>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>
