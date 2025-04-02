<template>
    <div class="dashboard">
      <AppNavbar />
      <div class="container">
        <h1>Dashboard</h1>
        
        <div class="dashboard-stats">
          <div class="stat-card">
            <h3>Active Queues</h3>
            <p class="stat-value">5</p>
          </div>
          
          <div class="stat-card">
            <h3>Total Visitors</h3>
            <p class="stat-value">127</p>
          </div>
          
          <div class="stat-card">
            <h3>Average Wait Time</h3>
            <p class="stat-value">14 min</p>
          </div>
        </div>
        
        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <ul class="activity-list">
            <li class="activity-item">
              <span class="activity-time">10:45 AM</span>
              <span class="activity-text">New visitor joined Queue #1</span>
            </li>
            <li class="activity-item">
              <span class="activity-time">10:30 AM</span>
              <span class="activity-text">Visitor #12 completed service</span>
            </li>
            <li class="activity-item">
              <span class="activity-time">10:15 AM</span>
              <span class="activity-text">Queue #3 was created</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import AppNavbar from '@/views/AppNavbar.vue';
  
  export default {
    name: 'DashboardView',
    components: {
      AppNavbar
    },
    data() {
      return {
        // Your dashboard data here
      };
    },
    mounted() {
      // Fetch dashboard data on component mount
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    min-height: 100vh;
    background-color: #f5f7fa;
  }
  
  .container {
    padding: 2rem;
  }
  
  h1 {
    margin-bottom: 2rem;
  }
  
  .dashboard-stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    flex: 1;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 0.5rem;
    color: #007bff;
  }
  
  .recent-activity {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  h2 {
    margin-bottom: 1rem;
  }
  
  .activity-list {
    list-style: none;
  }
  
  .activity-item {
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .activity-time {
    font-size: 0.9rem;
    color: #666;
    width: 80px;
  }
  
  .activity-text {
    margin-left: 1rem;
  }
  </style>