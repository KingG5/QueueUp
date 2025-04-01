<template>
  <div id="app">
    <AppNavBar />
    <router-view/>
  </div>
</template>

<script>
import AppNavBar from '@/components/AppNavBar.vue'

export default {
  components: {
    AppNavBar
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f7;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}
</style>