<template>
  <div>
    <test />
    <div v-for="n in 100" :key="n">sdfsdfsdfsf</div>
  </div>
</template>
<script>
import test from '@/components/test'
export default {
  components: {
    test
  }
}
</script>
