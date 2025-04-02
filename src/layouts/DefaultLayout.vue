<template>
    <div class="app-layout">
      <Sidebar />
      <div class="content-area">
        <AppNavbar />
        <main class="main-content">
          <slot></slot>
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '@/stores/auth'
  import Sidebar from '@/components/common/Sidebar.vue'
  import AppNavbar from '@/views/AppNavbar.vue'
  
  export default {
    name: 'DefaultLayout',
    components: {
      Sidebar,
      AppNavbar
    },
    setup() {
      const authStore = useAuthStore()
      return { authStore }
    }
  }
  </script>
  
  <!-- Keep the existing style -->