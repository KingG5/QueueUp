<template>
  <div class="app-container">
    <Sidebar />
    <div class="content-area">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/common/Sidebar.vue';

export default {
  name: 'App',
  components: {
    Sidebar
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f7fa;
  color: #2c3e50;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.content-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f7fa; /* Add a background color to make it visible */
}
</style>
