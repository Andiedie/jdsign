<template>
  <div id="app">
    <index></index>
  </div>
</template>

<script>
import Index from '@/components/Index/Index.vue';

export default {
  name: 'jdsign',
  components: {
    Index
  }
};
</script>

<style>
html, body{
  margin: 0;
  border: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#app {
  height: 100%;
  width: 100%;
}
</style>
