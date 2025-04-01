<template>
    <nav class="app-navbar" v-if="isAuthenticated">
      <div class="navbar-brand">
        <router-link to="/" class="logo">
          <span class="logo-icon">💇</span>
          <span class="logo-text">QueueUp</span>
        </router-link>
      </div>
      
      <div class="navbar-menu">
        <router-link to="/barbershops" class="nav-item" active-class="active">
          <span>Barbershops</span>
        </router-link>
        
        <router-link to="/my-queue" class="nav-item" active-class="active">
          <span>My Queue</span>
        </router-link>
        
        <!-- Manager-only navigation items -->
        <template v-if="isManager">
          <router-link to="/dashboard" class="nav-item" active-class="active">
            <span>Dashboard</span>
          </router-link>
        </template>
      </div>
      
      <div class="navbar-user">
        <div class="user-info" @click="toggleUserMenu">
          <span class="user-name" v-if="userData">{{ userData.name }}</span>
          <div class="user-avatar">{{ userData ? userData.name.charAt(0).toUpperCase() : 'U' }}</div>
          
          <div class="user-menu" v-if="showUserMenu">
            <router-link to="/profile" class="menu-item">
              Profile
            </router-link>
            
            <div class="menu-divider"></div>
            
            <button class="menu-item logout-btn" @click="logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { getAuth, signOut } from "firebase/auth";
  import { mapState, mapGetters } from 'vuex';
  
  export default {
    name: 'AppNavBar',
    data() {
      return {
        showUserMenu: false
      }
    },
    computed: {
      ...mapState([
        'user',
        'userData'
      ]),
      ...mapGetters([
        'isAuthenticated',
        'isManager'
      ])
    },
    methods: {
      toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
      },
      closeUserMenu() {
        this.showUserMenu = false;
      },
      async logout() {
        try {
          const auth = getAuth();
          await signOut(auth);
          this.$router.push('/login');
        } catch (error) {
          console.error('Error logging out:', error);
        }
      }
    },
    mounted() {
      // Close user menu when clicking outside
      document.addEventListener('click', (event) => {
        const isClickInside = this.$el.contains(event.target);
        if (!isClickInside && this.showUserMenu) {
          this.closeUserMenu();
        }
      });
    },
    beforeDestroy() {
      document.removeEventListener('click', this.closeUserMenu);
    }
  }
  </script>
  
  <style scoped>
  .app-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 24px;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
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
    background-color: #0066ff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
  
  .user-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 200px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
    .user-name {
      display: none;
    }
  }
  </style>