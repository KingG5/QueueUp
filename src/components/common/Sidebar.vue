<template>
    <div class="sidebar">
      <div class="logo">
        <span class="logo-icon">✂️</span>
        <h1>QueueUp</h1>
      </div>
      
      <nav class="menu">
        <router-link to="/" class="menu-item">
          <span class="icon">📊</span>
          <span>Dashboard</span>
        </router-link>
        
        <router-link to="/queue" class="menu-item">
          <span class="icon">👥</span>
          <span>File d'attente</span>
        </router-link>
        
        <router-link to="/barbers" class="menu-item">
          <span class="icon">💇</span>
          <span>Coiffeurs</span>
        </router-link>
        
        <router-link to="/services" class="menu-item">
          <span class="icon">✂️</span>
          <span>Services</span>
        </router-link>
        
        <router-link to="/settings" class="menu-item">
          <span class="icon">⚙️</span>
          <span>Paramètres</span>
        </router-link>
      </nav>
      
      <div class="status-footer">
        <div class="salon-status">
          <span class="status-indicator online"></span>
          <span>Salon ouvert</span>
        </div>
        
        <button class="logout-btn" @click="logout">
          <span class="icon">🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar',
    methods: {
      logout() {
        console.log('Logout clicked');
        // We'll implement actual logout later
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: white;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .logo {
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    
    h1 {
      font-size: 1.5rem;
      margin: 0;
    }
    
    .logo-icon {
      font-size: 1.8rem;
    }
  }
  
  .menu {
    padding: 20px 0;
    flex-grow: 1;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    text-decoration: none;
    color: rgba(255,255,255,0.8);
    gap: 12px;
    
    &:hover, &.router-link-active {
      background-color: rgba(255,255,255,0.1);
      color: white;
    }
    
    .icon {
      font-size: 1.2rem;
    }
  }
  
  .status-footer {
    margin-top: auto;
    padding: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  
  .salon-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
    
    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      
      &.online {
        background-color: #4CAF50;
      }
    }
  }
  
  .logout-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: rgba(220, 53, 69, 0.2);
    color: #dc3545;
    border: none;
    padding: 10px;
    width: 100%;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: rgba(220, 53, 69, 0.3);
    }
  }
  </style>