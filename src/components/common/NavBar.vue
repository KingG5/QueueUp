<template>
  <nav class="navbar" :class="{ 'navbar-client': isClient, 'navbar-business': isBusiness }">
    <div class="navbar-brand">
      <router-link to="/" class="logo">
        <span class="logo-icon">💇</span>
        <span class="logo-text">QueueUp</span>
      </router-link>
    </div>
    
    <div class="navbar-menu">
      <!-- Common navigation items -->
      <template v-if="isLoggedIn">
        <!-- Client navigation items -->
        <template v-if="isClient">
          <router-link to="/nearby" class="nav-item" active-class="active">
            <span class="icon">📍</span>
            <span class="nav-text">Find Salon</span>
          </router-link>
          <router-link to="/my-queue" class="nav-item" active-class="active">
            <span class="icon">🕒</span>
            <span class="nav-text">My Queue</span>
          </router-link>
        </template>
        
        <!-- Business navigation items -->
        <template v-if="isBusiness">
          <router-link to="/dashboard" class="nav-item" active-class="active">
            <span class="icon">📊</span>
            <span class="nav-text">Dashboard</span>
          </router-link>
          <router-link to="/queue" class="nav-item" active-class="active">
            <span class="icon">👥</span>
            <span class="nav-text">Queue</span>
          </router-link>
          <router-link to="/barbers" class="nav-item" active-class="active">
            <span class="icon">💇</span>
            <span class="nav-text">Barbers</span>
          </router-link>
          <router-link to="/services" class="nav-item" active-class="active">
            <span class="icon">✂️</span>
            <span class="nav-text">Services</span>
          </router-link>
        </template>
      </template>
      
      <!-- Guest navigation items -->
      <template v-else>
        <router-link to="/login" class="nav-item" active-class="active">
          <span class="icon">🔑</span>
          <span class="nav-text">Login</span>
        </router-link>
        <router-link to="/register" class="nav-item" active-class="active">
          <span class="icon">📝</span>
          <span class="nav-text">Register</span>
        </router-link>
      </template>
    </div>
    
    <div class="navbar-user" v-if="isLoggedIn">
      <div class="user-info" @click="toggleUserMenu">
        <span class="user-name">{{ currentUser?.name || 'User' }}</span>
        <img :src="currentUser?.avatar || '/images/default-avatar.jpg'" alt="Avatar" class="user-avatar" />
        
        <div class="user-menu" v-if="showUserMenu">
          <router-link to="/profile" class="menu-item">
            <span class="icon">👤</span>
            Profile
          </router-link>
          
          <div class="menu-divider"></div>
          
          <button class="menu-item logout-btn" @click="handleLogout">
            <span class="icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

export default {
  name: 'NavBar',
  setup() {
    const router = useRouter()
    const showUserMenu = ref(false)
    const authStore = useAuthStore()
    
    // Using storeToRefs to maintain reactivity
    const { isLoggedIn, currentUser, isClient, isBusiness } = storeToRefs(authStore)
    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }
    
    const closeUserMenu = () => {
      showUserMenu.value = false
    }
    
    const handleLogout = async () => {
      await authStore.logout()
      closeUserMenu()
      router.push('/login')
    }
    
    // Close user menu when clicking outside
    const handleClickOutside = (event) => {
      const userInfo = document.querySelector('.user-info')
      if (userInfo && !userInfo.contains(event.target) && showUserMenu.value) {
        closeUserMenu()
      }
    }
    
    // Add/remove event listener for clicks outside menu
    window.addEventListener('click', handleClickOutside)
    
    // Cleanup event listener when component is unmounted
    onUnmounted(() => {
      window.removeEventListener('click', handleClickOutside)
    })
    
    return {
      showUserMenu,
      isLoggedIn,
      currentUser,
      isClient,
      isBusiness,
      toggleUserMenu,
      closeUserMenu,
      handleLogout
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-client {
  background-color: #f8f9fa;
}

.navbar-business {
  background-color: #edf2ff;
}

.navbar-brand .logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 700;
  font-size: 20px;
  color: #0066ff;
}

.logo-icon {
  margin-right: 8px;
  font-size: 24px;
}

.navbar-menu {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin: 0 4px;
  color: #666;
  text-decoration: none;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-item .icon {
  margin-right: 8px;
}

.nav-item:hover {
  background-color: #f5f5f7;
  color: #333;
}

.nav-item.active {
  background-color: rgba(0, 102, 255, 0.1);
  color: #0066ff;
}

.navbar-user {
  margin-left: 24px;
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.user-info:hover {
  background-color: #f5f5f7;
}

.user-name {
  font-weight: 500;
  margin-right: 12px;
  color: #333;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.user-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 10;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
}

.menu-item .icon {
  margin-right: 12px;
}

.menu-item:hover {
  background-color: #f5f5f7;
}

.menu-divider {
  height: 1px;
  background-color: #eee;
  margin: 8px 0;
}

.logout-btn {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #ff3b30;
}

.logout-btn:hover {
  background-color: #fff2f2;
}

@media (max-width: 768px) {
  .nav-text {
    display: none;
  }
  
  .nav-item {
    padding: 8px 12px;
  }
  
  .nav-item .icon {
    margin-right: 0;
  }
  
  .user-name {
    display: none;
  }
}
</style>