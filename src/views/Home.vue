<template>
    <div class="home">
      <div class="hero">
        <h1>Welcome to QueueUp</h1>
        <p>Skip the wait, not the quality</p>
        
        <div class="hero-actions">
          <router-link to="/barbershops" class="btn-primary">Find a Barbershop</router-link>
          <router-link to="/my-queue" class="btn-secondary">Check My Queue</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home'
  }
  </script>
  
  <style scoped>
  .home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .hero {
    text-align: center;
    padding: 60px 20px;
  }
  
  .hero h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 16px;
  }
  
  .hero p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 32px;
  }
  
  .hero-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    text-decoration: none;
    font-size: 1rem;
  }
  
  .btn-primary {
    background-color: #0066ff;
    color: white;
  }
  
  .btn-secondary {
    background-color: #f5f5f7;
    color: #333;
    border: 1px solid #ddd;
  }
  
  @media (max-width: 768px) {
    .hero-actions {
      flex-direction: column;
    }
  }
  </style>