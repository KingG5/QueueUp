<template>
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <div class="date-selector">
          <button class="btn btn-light">Aujourd'hui</button>
          <button class="btn">Cette semaine</button>
          <button class="btn">Ce mois</button>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Clients en attente</h3>
          <div class="stat-value">{{ queueCount }}</div>
          <div class="stat-change increase">+2 depuis hier</div>
        </div>
        
        <div class="stat-card">
          <h3>Temps d'attente moyen</h3>
          <div class="stat-value">{{ averageWaitTime }} min</div>
          <div class="stat-change decrease">-3 min depuis hier</div>
        </div>
        
        <div class="stat-card">
          <h3>Coiffeurs actifs</h3>
          <div class="stat-value">{{ activeBarbers }}/{{ totalBarbers }}</div>
          <div class="stat-note">2 en pause</div>
        </div>
        
        <div class="stat-card">
          <h3>Services aujourd'hui</h3>
          <div class="stat-value">{{ servicesCompleted }}</div>
          <div class="stat-change increase">+8 par rapport à la moyenne</div>
        </div>
      </div>
      
      <div class="dashboard-content">
        <div class="chart-container">
          <h2>Affluence par heure</h2>
          <div class="chart-placeholder">
            <!-- Chart will go here once we add charting library -->
            <div class="chart-bars">
              <div class="chart-bar" v-for="(value, index) in hourlyTraffic" :key="index"
                   :style="{ height: value + '%' }">
                <span class="chart-value">{{ value }}</span>
              </div>
            </div>
            <div class="chart-labels">
              <span v-for="hour in chartLabels" :key="hour">{{ hour }}h</span>
            </div>
          </div>
        </div>
        
        <div class="card upcoming-appointments">
          <h2>Prochains rendez-vous</h2>
          <div class="appointment-list">
            <div class="appointment-item" v-for="appointment in upcomingAppointments" :key="appointment.id">
              <div class="appointment-time">{{ appointment.time }}</div>
              <div class="appointment-info">
                <div class="appointment-name">{{ appointment.clientName }}</div>
                <div class="appointment-service">{{ appointment.service }}</div>
              </div>
              <div class="appointment-barber">{{ appointment.barber }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-row">
        <div class="card popular-services">
          <h2>Services populaires</h2>
          <div class="service-list">
            <div class="service-item" v-for="service in popularServices" :key="service.name">
              <div class="service-name">{{ service.name }}</div>
              <div class="service-bar-container">
                <div class="service-bar" :style="{ width: service.percentage + '%' }"></div>
              </div>
              <div class="service-percentage">{{ service.percentage }}%</div>
            </div>
          </div>
        </div>
        
        <div class="card barber-performance">
          <h2>Performance des coiffeurs</h2>
          <div class="barber-list">
            <div class="barber-item" v-for="barber in barberPerformance" :key="barber.name">
              <div class="barber-info">
                <div class="barber-name">{{ barber.name }}</div>
                <div class="barber-stats">{{ barber.clients }} clients • {{ barber.rating }}/5</div>
              </div>
              <div class="barber-rating">
                <span class="star" v-for="i in 5" :key="i" :class="{ filled: i <= barber.rating }">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardView',
    data() {
      return {
        queueCount: 12,
        averageWaitTime: 24,
        activeBarbers: 4,
        totalBarbers: 6,
        servicesCompleted: 43,
        
        hourlyTraffic: [10, 15, 25, 40, 60, 75, 65, 45, 30],
        chartLabels: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        
        upcomingAppointments: [
          { id: 1, time: '14:30', clientName: 'Thomas Martin', service: 'Coupe homme', barber: 'Antoine' },
          { id: 2, time: '15:00', clientName: 'Laura Dupont', service: 'Coloration', barber: 'Sophie' },
          { id: 3, time: '15:30', clientName: 'Alex Petit', service: 'Barbe', barber: 'Lucas' },
          { id: 4, time: '16:00', clientName: 'Emma Laurent', service: 'Coupe femme', barber: 'Sophie' }
        ],
        
        popularServices: [
          { name: 'Coupe homme', percentage: 45 },
          { name: 'Coupe femme', percentage: 25 },
          { name: 'Barbe', percentage: 18 },
          { name: 'Coloration', percentage: 12 }
        ],
        
        barberPerformance: [
          { name: 'Antoine', clients: 18, rating: 4.8 },
          { name: 'Sophie', clients: 15, rating: 4.9 },
          { name: 'Lucas', clients: 12, rating: 4.5 },
          { name: 'Julie', clients: 10, rating: 4.7 }
        ]
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .dashboard {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h1 {
        margin: 0;
      }
    }
    
    &-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }
    
    &-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }
  }
  
  .date-selector {
    display: flex;
    gap: 10px;
    
    .btn {
      background: transparent;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 6px 12px;
      
      &-light {
        background-color: #f0f4f8;
        color: #4361ee;
      }
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    
    h3 {
      font-size: 0.9rem;
      color: #6c757d;
      margin-bottom: 10px;
      font-weight: 500;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 8px;
    }
    
    .stat-change, .stat-note {
      font-size: 0.85rem;
      
      &.increase {
        color: #28a745;
      }
      
      &.decrease {
        color: #dc3545;
      }
    }
    
    .stat-note {
      color: #6c757d;
    }
  }
  
  .chart-container {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    
    h2 {
      font-size: 1.2rem;
      margin-bottom: 15px;
      color: #2c3e50;
    }
  }
  
  .chart-placeholder {
    height: 300px;
    padding: 20px 0;
    position: relative;
    
    .chart-bars {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      height: 250px;
    }
    
    .chart-bar {
      width: 30px;
      background-color: #4361ee;
      border-radius: 3px 3px 0 0;
      position: relative;
      display: flex;
      justify-content: center;
      
      .chart-value {
        position: absolute;
        top: -25px;
        font-size: 0.8rem;
        color: #6c757d;
      }
    }
    
    .chart-labels {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
      
      span {
        font-size: 0.8rem;
        color: #6c757d;
      }
    }
  }
  
  .card {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    
    h2 {
      font-size: 1.2rem;
      margin-bottom: 15px;
      color: #2c3e50;
    }
  }
  
  .upcoming-appointments {
    .appointment-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .appointment-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    .appointment-time {
      font-weight: 600;
      min-width: 60px;
    }
    
    .appointment-info {
      flex: 1;
      
      .appointment-name {
        font-weight: 500;
      }
      
      .appointment-service {
        font-size: 0.9rem;
        color: #6c757d;
      }
    }
    
    .appointment-barber {
      color: #4361ee;
      font-weight: 500;
    }
  }
  
  .popular-services {
    .service-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .service-item {
      display: flex;
      align-items: center;
      
      .service-name {
        min-width: 120px;
      }
      
      .service-bar-container {
        flex: 1;
        height: 8px;
        background-color: #f0f0f0;
        border-radius: 4px;
        margin: 0 10px;
        
        .service-bar {
          height: 100%;
          background-color: #4361ee;
          border-radius: 4px;
        }
      }
      
      .service-percentage {
        font-size: 0.9rem;
        font-weight: 500;
        min-width: 40px;
        text-align: right;
      }
    }
  }
  
  .barber-performance {
    .barber-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .barber-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    .barber-name {
      font-weight: 500;
    }
    
    .barber-stats {
      font-size: 0.85rem;
      color: #6c757d;
      margin-top: 4px;
    }
    
    .barber-rating {
      .star {
        color: #e0e0e0;
        font-size: 1.2rem;
        
        &.filled {
          color: #ffc107;
        }
      }
    }
  }
  </style>
  