<template>
  <div class="app-container">
    <NavBar />
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/common/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    onMounted(async () => {
      // Check if user is authenticated on app load
      if (localStorage.getItem('token')) {
        try {
          const isAuthenticated = await authStore.checkAuth()
          
          // If we're on the home page and authenticated, redirect to the appropriate page
          if (isAuthenticated && router.currentRoute.value.path === '/') {
            if (authStore.isBusiness) {
              router.push('/dashboard')
            } else {
              router.push('/nearby')
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          // If auth check fails, clear the token
          authStore.logout()
        }
      }
    })
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --primary-color: #0066ff;
  --secondary-color: #34c759;
  --danger-color: #ff3b30;
  --warning-color: #ff9500;
  --bg-color: #f5f7fa;
  --text-color: #333;
  --light-text: #666;
  --border-color: #e0e0e0;
  --card-bg: #ffffff;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 16px;
  line-height: 1.5;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: 100%;
}

a {
  text-decoration: none;
  color: var(--primary-color);
}

button {
  cursor: pointer;
}

input, select, textarea, button {
  font-family: inherit;
  font-size: inherit;
}

/* Common utility classes */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.mb-1 {
  margin-bottom: 0.5rem;
}

.mb-2 {
  margin-bottom: 1rem;
}

.mb-3 {
  margin-bottom: 1.5rem;
}

.mt-1 {
  margin-top: 0.5rem;
}

.mt-2 {
  margin-top: 1rem;
}

.mt-3 {
  margin-top: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
}
</style>