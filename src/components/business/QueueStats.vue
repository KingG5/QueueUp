<template>
    <div class="queue-stats">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Clients in Queue</h3>
          <div class="stat-value">{{ stats.totalWaiting }}</div>
          <div 
            class="stat-change" 
            :class="compareWaiting > 0 ? 'increase' : compareWaiting < 0 ? 'decrease' : ''"
          >
            {{ formatCompare(compareWaiting) }} since yesterday
          </div>
        </div>
        
        <div class="stat-card">
          <h3>Average Wait Time</h3>
          <div class="stat-value">{{ stats.averageWaitTime }} min</div>
          <div 
            class="stat-change" 
            :class="compareWaitTime > 0 ? 'increase' : compareWaitTime < 0 ? 'decrease' : ''"
          >
            {{ formatCompare(compareWaitTime) }} min since yesterday
          </div>
        </div>
        
        <div class="stat-card">
          <h3>Active Barbers</h3>
          <div class="stat-value">{{ activeBarbers }}/{{ totalBarbers }}</div>
          <div class="stat-note" v-if="inactiveBarbers > 0">
            {{ inactiveBarbers }} unavailable
          </div>
        </div>
        
        <div class="stat-card">
          <h3>Clients Served Today</h3>
          <div class="stat-value">{{ stats.clientsServedToday }}</div>
          <div 
            class="stat-change" 
            :class="compareServed > 0 ? 'increase' : compareServed < 0 ? 'decrease' : ''"
          >
            {{ formatCompare(compareServed) }} from average
          </div>
        </div>
      </div>
      
      <div class="hourly-traffic">
        <h3 class="section-title">Hourly Traffic</h3>
        
        <div class="chart-container">
          <div class="chart-bars">
            <div 
              class="chart-bar" 
              v-for="(value, index) in hourlyTraffic" 
              :key="index"
              :style="{ height: calculateBarHeight(value) + '%' }"
            >
              <span class="chart-value">{{ value }}</span>
            </div>
          </div>
          <div class="chart-labels">
            <span v-for="hour in chartLabels" :key="hour">{{ hour }}h</span>
          </div>
        </div>
      </div>
      
      <div class="info-row">
        <div class="upcoming-appointments">
          <h3 class="section-title">Upcoming Appointments</h3>
          
          <div class="appointment-list">
            <div 
              v-for="appointment in upcomingAppointments" 
              :key="appointment.id"
              class="appointment-item"
            >
              <div class="appointment-time">{{ appointment.time }}</div>
              <div class="appointment-info">
                <div class="appointment-name">{{ appointment.clientName }}</div>
                <div class="appointment-service">{{ appointment.service }}</div>
              </div>
              <div class="appointment-barber">{{ appointment.barber }}</div>
            </div>
            
            <div v-if="upcomingAppointments.length === 0" class="empty-list">
              No upcoming appointments
            </div>
          </div>
        </div>
        
        <div class="popular-services">
          <h3 class="section-title">Popular Services</h3>
          
          <div class="service-list">
            <div 
              v-for="service in popularServices" 
              :key="service.name"
              class="service-item"
            >
              <div class="service-name">{{ service.name }}</div>
              <div class="service-bar-container">
                <div 
                  class="service-bar" 
                  :style="{ width: service.percentage + '%' }"
                ></div>
              </div>
              <div class="service-percentage">{{ service.percentage }}%</div>
            </div>
            
            <div v-if="popularServices.length === 0" class="empty-list">
              No service data available
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  
  export default {
    name: 'QueueStats',
    props: {
      stats: {
        type: Object,
        required: true,
        default: () => ({
          totalWaiting: 0,
          averageWaitTime: 0,
          clientsServedToday: 0
        })
      },
      barbers: {
        type: Array,
        default: () => []
      },
      previousDayStats: {
        type: Object,
        default: () => ({
          totalWaiting: 0,
          averageWaitTime: 0,
          clientsServedToday: 0
        })
      },
      averageClientsServed: {
        type: Number,
        default: 0
      },
      hourlyTraffic: {
        type: Array,
        default: () => [10, 15, 25, 40, 60, 75, 65, 45, 30]
      },
      chartLabels: {
        type: Array,
        default: () => [9, 10, 11, 12, 13, 14, 15, 16, 17]
      },
      upcomingAppointments: {
        type: Array,
        default: () => []
      },
      popularServices: {
        type: Array,
        default: () => []
      }
    },
    
    setup(props) {
      // Computed properties for barber stats
      const activeBarbers = computed(() => props.barbers.filter(b => b.isActive).length)
      const totalBarbers = computed(() => props.barbers.length)
      const inactiveBarbers = computed(() => totalBarbers.value - activeBarbers.value)
      
      // Computed properties for comparison with previous day
      const compareWaiting = computed(() => {
        return props.stats.totalWaiting - props.previousDayStats.totalWaiting
      })
      
      const compareWaitTime = computed(() => {
        return props.stats.averageWaitTime - props.previousDayStats.averageWaitTime
      })
      
      const compareServed = computed(() => {
        return props.stats.clientsServedToday - props.averageClientsServed
      })
      
      // Format comparison values
      const formatCompare = (value) => {
        if (value === 0) return 'No change'
        return value > 0 ? `+${value}` : value
      }
      
      // Calculate bar height for chart
      const calculateBarHeight = (value) => {
        const maxValue = Math.max(...props.hourlyTraffic)
        return (value / maxValue) * 100
      }
      
      return {
        activeBarbers,
        totalBarbers,
        inactiveBarbers,
        compareWaiting,
        compareWaitTime,
        compareServed,
        formatCompare,
        calculateBarHeight
      }
    }
  }
  </script>
  
  <style scoped>
  .queue-stats {
    width: 100%;
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
  }
  
  .stat-card h3 {
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
  }
  
  .stat-change.increase {
    color: #28a745;
  }
  
  .stat-change.decrease {
    color: #dc3545;
  }
  
  .stat-note {
    color: #6c757d;
  }
  
  .section-title {
    font-size: 1.2rem;
    margin-bottom: 15px;
    color: #2c3e50;
    font-weight: 500;
  }
  
  .hourly-traffic {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    margin-bottom: 30px;
  }
  
  .chart-container {
    height: 300px;
    padding: 20px 0;
    position: relative;
  }
  
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
  }
  
  .chart-value {
    position: absolute;
    top: -25px;
    font-size: 0.8rem;
    color: #6c757d;
  }
  
  .chart-labels {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
  }
  
  .chart-labels span {
    font-size: 0.8rem;
    color: #6c757d;
  }
  
  .info-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .upcoming-appointments, .popular-services {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  
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
  }
  
  .appointment-item:last-child {
    border-bottom: none;
  }
  
  .appointment-time {
    font-weight: 600;
    min-width: 60px;
  }
  
  .appointment-info {
    flex: 1;
  }
  
  .appointment-name {
    font-weight: 500;
  }
  
  .appointment-service {
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  .appointment-barber {
    color: #4361ee;
    font-weight: 500;
  }
  
  .service-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .service-item {
    display: flex;
    align-items: center;
  }
  
  .service-name {
    min-width: 120px;
  }
  
  .service-bar-container {
    flex: 1;
    height: 8px;
    background-color: #f0f0f0;
    border-radius: 4px;
    margin: 0 10px;
  }
  
  .service-bar {
    height: 100%;
    background-color: #4361ee;
    border-radius: 4px;
  }
  
  .service-percentage {
    font-size: 0.9rem;
    font-weight: 500;
    min-width: 40px;
    text-align: right;
  }
  
  .empty-list {
    padding: 20px;
    text-align: center;
    color: #6c757d;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  @media (max-width: 992px) {
    .info-row {
      grid-template-columns: 1fr;
    }
    
    .upcoming-appointments {
      margin-bottom: 20px;
    }
  }
  
  @media (max-width: 576px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .chart-bar {
      width: 20px;
    }
    
    .chart-value {
      font-size: 0.7rem;
    }
  }
  </style>