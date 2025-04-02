<template>
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <div class="date-selector">
          <button 
            class="btn" 
            :class="{ 'btn-light': dateRange === 'today' }"
            @click="setDateRange('today')"
          >
            Today
          </button>
          <button 
            class="btn" 
            :class="{ 'btn-light': dateRange === 'week' }"
            @click="setDateRange('week')"
          >
            This Week
          </button>
          <button 
            class="btn" 
            :class="{ 'btn-light': dateRange === 'month' }"
            @click="setDateRange('month')"
          >
            This Month
          </button>
        </div>
      </div>
      
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading dashboard data...</div>
      </div>
      
      <div v-else>
        <!-- Use the QueueStats component to display main metrics -->
        <QueueStats 
          :stats="queueStats"
          :barbers="barbers"
          :previous-day-stats="previousDayStats"
          :average-clients-served="averageClientsServed"
          :hourly-traffic="hourlyTraffic"
          :chart-labels="chartLabels"
          :upcoming-appointments="upcomingAppointments"
          :popular-services="popularServices"
        />
        
        <div class="dashboard-row">
          <div class="card quick-actions">
            <h2>Quick Actions</h2>
            <div class="actions-grid">
              <router-link to="/queue" class="action-card">
                <div class="action-icon">👥</div>
                <div class="action-text">Manage Queue</div>
              </router-link>
              
              <router-link to="/barbers" class="action-card">
                <div class="action-icon">💇</div>
                <div class="action-text">Staff</div>
              </router-link>
              
              <router-link to="/services" class="action-card">
                <div class="action-icon">✂️</div>
                <div class="action-text">Services</div>
              </router-link>
              
              <router-link to="/profile" class="action-card">
                <div class="action-icon">⚙️</div>
                <div class="action-text">Settings</div>
              </router-link>
            </div>
          </div>
          
          <div class="card notification-center">
            <h2>Notifications</h2>
            <div class="notifications-list">
              <div v-for="(notification, index) in notifications" :key="index" class="notification-item">
                <div class="notification-icon" :class="notification.type">
                  {{ getNotificationIcon(notification.type) }}
                </div>
                <div class="notification-content">
                  <div class="notification-message">{{ notification.message }}</div>
                  <div class="notification-time">{{ notification.time }}</div>
                </div>
                <button class="notification-dismiss" @click="dismissNotification(index)">
                  &times;
                </button>
              </div>
              
              <div v-if="notifications.length === 0" class="empty-list">
                No new notifications
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { useQueueStore } from '@/stores/queues'
  import { useBarbershopStore } from '@/stores/barbershops'
  import QueueStats from '@/components/business/QueueStats.vue'
  
  export default {
    name: 'DashboardView',
    components: {
      QueueStats
    },
    
    setup() {
      const queueStore = useQueueStore()
      const barbershopStore = useBarbershopStore()
      
      // State
      const dateRange = ref('today')
      const isLoading = ref(true)
      const businessId = ref(1) // In a real app, this would come from auth store
      const notifications = ref([
        {
          type: 'queue',
          message: 'A new client has joined the queue',
          time: '10 minutes ago'
        },
        {
          type: 'staff',
          message: 'Antoine marked himself as available',
          time: '25 minutes ago'
        },
        {
          type: 'system',
          message: 'Your subscription will renew in 7 days',
          time: '1 hour ago'
        }
      ])
      
      // Mock data for stats - in a real app this would come from API
      const hourlyTraffic = ref([10, 15, 25, 40, 60, 75, 65, 45, 30])
      const chartLabels = ref([9, 10, 11, 12, 13, 14, 15, 16, 17])
      const upcomingAppointments = ref([
        { id: 1, time: '14:30', clientName: 'Thomas Martin', service: 'Coupe homme', barber: 'Antoine' },
        { id: 2, time: '15:00', clientName: 'Laura Dupont', service: 'Coloration', barber: 'Sophie' },
        { id: 3, time: '15:30', clientName: 'Alex Petit', service: 'Barbe', barber: 'Lucas' },
        { id: 4, time: '16:00', clientName: 'Emma Laurent', service: 'Coupe femme', barber: 'Sophie' }
      ])
      const popularServices = ref([
        { name: 'Coupe homme', percentage: 45 },
        { name: 'Coupe femme', percentage: 25 },
        { name: 'Barbe', percentage: 18 },
        { name: 'Coloration', percentage: 12 }
      ])
      const previousDayStats = ref({
        totalWaiting: 10,
        averageWaitTime: 28,
        clientsServedToday: 35
      })
      const averageClientsServed = ref(35)
      
      // Computed properties
      const barbers = computed(() => barbershopStore.getBarbershopBarbers)
      
      const queueStats = computed(() => ({
        totalWaiting: queueStore.queueLength,
        averageWaitTime: queueStore.estimatedWaitTime,
        clientsServedToday: queueStore.clientsServed
      }))
      
      // Methods
      const setDateRange = (range) => {
        dateRange.value = range
        loadDashboardData()
      }
      
      const loadDashboardData = async () => {
        isLoading.value = true
        
        try {
          // Load queue data
          await queueStore.fetchQueue(businessId.value)
          
          // Load barbers and services
          await barbershopStore.fetchBarbers(businessId.value)
          await barbershopStore.fetchServices(businessId.value)
          
          // In a real app, you would also fetch dashboard-specific data based on date range
          // Such as hourly traffic, popular services, etc.
          
          // For demo, we'll just use the mock data above
          
        } catch (error) {
          console.error('Error loading dashboard data:', error)
        } finally {
          isLoading.value = false
        }
      }
      
      const getNotificationIcon = (type) => {
        switch (type) {
          case 'queue':
            return '👥'
          case 'staff':
            return '💇'
          case 'system':
            return '🔔'
          default:
            return '📩'
        }
      }
      
      const dismissNotification = (index) => {
        notifications.value.splice(index, 1)
      }
      
      // Load dashboard data on component mount
      onMounted(() => {
        loadDashboardData()
      })
      
      return {
        dateRange,
        isLoading,
        barbers,
        queueStats,
        hourlyTraffic,
        chartLabels,
        upcomingAppointments,
        popularServices,
        previousDayStats,
        averageClientsServed,
        notifications,
        setDateRange,
        getNotificationIcon,
        dismissNotification
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .dashboard-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
  
  .date-selector {
    display: flex;
    gap: 10px;
  }
  
  .btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    background-color: transparent;
    transition: all 0.2s ease;
  }
  
  .btn-light {
    background-color: rgba(0, 102, 255, 0.1);
    color: #0066ff;
    border-color: #0066ff;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 102, 255, 0.2);
    border-top-color: #0066ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  .loading-text {
    color: #666;
    font-size: 16px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .dashboard-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }
  
  .card {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .card h2 {
    font-size: 18px;
    margin: 0 0 16px 0;
    color: #333;
  }
  
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    text-decoration: none;
    color: #333;
    transition: all 0.2s ease;
  }
  
  .action-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    background-color: #0066ff;
    color: white;
  }
  
  .action-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }
  
  .action-text {
    font-weight: 500;
  }
  
  .notifications-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .notification-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }
  
  .notification-item:hover {
    background-color: #f1f3f5;
  }
  
  .notification-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 12px;
    flex-shrink: 0;
    font-size: 20px;
  }
  
  .notification-icon.queue {
    background-color: rgba(0, 102, 255, 0.1);
    color: #0066ff;
  }
  
  .notification-icon.staff {
    background-color: rgba(52, 199, 89, 0.1);
    color: #34c759;
  }
  
  .notification-icon.system {
    background-color: rgba(255, 149, 0, 0.1);
    color: #ff9500;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-message {
    margin-bottom: 4px;
    font-weight: 500;
  }
  
  .notification-time {
    font-size: 12px;
    color: #666;
  }
  
  .notification-dismiss {
    background: none;
    border: none;
    color: #999;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
  }
  
  .notification-dismiss:hover {
    color: #ff3b30;
  }
  
  .empty-list {
    padding: 20px;
    text-align: center;
    color: #666;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  @media (max-width: 992px) {
    .dashboard-row {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .dashboard-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    .date-selector {
      width: 100%;
    }
    
    .btn {
      flex: 1;
      text-align: center;
    }
  }
  
  @media (max-width: 576px) {
    .actions-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>