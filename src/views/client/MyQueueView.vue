<template>
    <div class="my-queue-view">
      <div class="content-container">
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">Checking your position in queue...</div>
        </div>
        
        <div v-else-if="error" class="error-container">
          <div class="error-icon">⚠️</div>
          <div class="error-message">{{ error }}</div>
          <button class="btn retry-btn" @click="checkQueuePosition">Retry</button>
          <router-link to="/nearby" class="btn back-btn">Find a Barbershop</router-link>
        </div>
        
        <div v-else-if="!ticketId" class="no-ticket-container">
          <div class="info-icon">ℹ️</div>
          <h2>No Active Queue</h2>
          <p>You don't have an active position in any queue.</p>
          <router-link to="/nearby" class="btn btn-primary">Find a Barbershop</router-link>
        </div>
        
        <template v-else>
          <div class="queue-status-card" :class="getStatusClass()">
            <div class="status-header">
              <h1>Your Queue Status</h1>
              <div class="ticket-number">Ticket #{{ ticketId }}</div>
            </div>
            
            <div class="status-info">
              <div class="barbershop-info">
                <h2>{{ queueInfo.businessName }}</h2>
                <div class="service-name">{{ queueInfo.serviceName }}</div>
              </div>
              
              <div class="status-details">
                <div class="status-item">
                  <div class="status-icon" :class="getStatusClass()">
                    {{ getStatusIcon() }}
                  </div>
                  <div class="status-text">
                    <div class="status-label">Status</div>
                    <div class="status-value">{{ getStatusText() }}</div>
                  </div>
                </div>
                
                <div class="status-item" v-if="queueInfo.status === 'waiting'">
                  <div class="status-icon position">
                    {{ queueInfo.position }}
                  </div>
                  <div class="status-text">
                    <div class="status-label">Your Position</div>
                    <div class="status-value">{{ formatPosition(queueInfo.position) }}</div>
                  </div>
                </div>
                
                <div class="status-item" v-if="queueInfo.status === 'waiting'">
                  <div class="status-icon time">
                    🕒
                  </div>
                  <div class="status-text">
                    <div class="status-label">Estimated Wait</div>
                    <div class="status-value">{{ formatWaitTime(queueInfo.estimatedWaitTime) }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="progress-indicator" v-if="queueInfo.status === 'waiting'">
              <div class="progress-label">
                <span>Back of Line</span>
                <span>Front of Line</span>
              </div>
              <div class="progress-bar">
                <div class="progress-track"></div>
                <div 
                  class="progress-fill" 
                  :style="{ width: progressPercentage + '%' }"
                ></div>
                <div 
                  class="progress-marker" 
                  :style="{ left: progressPercentage + '%' }"
                >
                  You
                </div>
              </div>
            </div>
            
            <div class="notification-settings" v-if="queueInfo.status === 'waiting'">
              <h3>Notifications</h3>
              <div class="notification-options">
                <label class="toggle-option">
                  <input type="checkbox" v-model="notifyOnPhone" @change="updateNotificationSettings">
                  <span>Receive SMS notifications</span>
                </label>
                
                <label class="toggle-option">
                  <input type="checkbox" v-model="notifyWhenClose" @change="updateNotificationSettings">
                  <span>Notify when I'm next in line</span>
                </label>
              </div>
            </div>
            
            <div class="action-buttons">
              <button 
                v-if="queueInfo.status === 'waiting'" 
                class="btn btn-danger"
                @click="confirmLeaveQueue"
              >
                Leave Queue
              </button>
              
              <button 
                v-else-if="queueInfo.status === 'in-service'"
                class="btn btn-primary"
                disabled
              >
                Currently Being Served
              </button>
              
              <button 
                v-else-if="queueInfo.status === 'completed'"
                class="btn btn-success"
                @click="handleDone"
              >
                Done
              </button>
              
              <router-link 
                v-else-if="queueInfo.status === 'cancelled'"
                to="/nearby" 
                class="btn btn-primary"
              >
                Find Another Barbershop
              </router-link>
            </div>
          </div>
          
          <div class="barbershop-location-card" v-if="queueInfo.status === 'waiting'">
            <h3>Getting There</h3>
            <div class="location-map">
              <img src="https://maps.googleapis.com/maps/api/staticmap?center=Paris,France&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7CChamps-Elysees,Paris&key=YOUR_API_KEY" alt="Map">
              <div class="map-overlay">Map preview</div>
            </div>
            <div class="location-details">
              <p class="address">{{ queueInfo.businessName }}</p>
              <a 
                href="#" 
                class="get-directions"
                @click.prevent="openDirections"
              >
                Get Directions
              </a>
            </div>
          </div>
          
          <div class="tips-card" v-if="queueInfo.status === 'waiting'">
            <h3>Tips While You Wait</h3>
            <div class="tips-list">
              <div class="tip-item">
                <div class="tip-icon">☕</div>
                <div class="tip-text">Grab a coffee at a nearby cafe</div>
              </div>
              <div class="tip-item">
                <div class="tip-icon">📱</div>
                <div class="tip-text">Keep your phone handy for notifications</div>
              </div>
              <div class="tip-item">
                <div class="tip-icon">⏱️</div>
                <div class="tip-text">Arrive at least 5 minutes before your turn</div>
              </div>
              <div class="tip-item">
                <div class="tip-icon">🖼️</div>
                <div class="tip-text">Find reference photos for your haircut</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useQueueStore } from '@/stores/queues'
  
  export default {
    name: 'MyQueueView',
    
    setup() {
      const route = useRoute()
      const router = useRouter()
      const queueStore = useQueueStore()
      
      // State
      const ticketId = ref(route.query.ticket || localStorage.getItem('activeTicket') || '')
      const queueInfo = ref({
        position: 0,
        estimatedWaitTime: 0,
        businessName: '',
        serviceName: '',
        status: 'waiting' // waiting, in-service, completed, cancelled
      })
      const notifyOnPhone = ref(true)
      const notifyWhenClose = ref(true)
      const isLoading = ref(false)
      const error = ref('')
      const refreshInterval = ref(null)
      
      // Computed properties
      const progressPercentage = computed(() => {
        // Assume max queue size is 10
        // For a better UX, we don't want to show 0% even if they're last in line
        const maxSize = 10
        const position = queueInfo.value.position
        
        // If position is 1, they're at the front (100%)
        // If position is 10+, they're at the back (0%)
        const percentage = 100 - ((position - 1) / (maxSize - 1) * 100)
        
        // Ensure it's between 5% and 95% for visual reasons
        return Math.min(Math.max(percentage, 5), 95)
      })
      
      // Methods
      const checkQueuePosition = async () => {
        if (!ticketId.value) return
        
        try {
          isLoading.value = true
          error.value = ''
          
          const result = await queueStore.checkQueuePosition(ticketId.value)
          queueInfo.value = result
          
          // Save ticket ID to localStorage if it's active
          if (result.status === 'waiting' || result.status === 'in-service') {
            localStorage.setItem('activeTicket', ticketId.value)
          } else {
            localStorage.removeItem('activeTicket')
          }
        } catch (err) {
          error.value = 'Failed to check queue position. Please try again.'
          console.error('Error checking queue position:', err)
        } finally {
          isLoading.value = false
        }
      }
      
      const getStatusClass = () => {
        const status = queueInfo.value.status
        
        switch(status) {
          case 'waiting':
            return 'status-waiting'
          case 'in-service':
            return 'status-active'
          case 'completed':
            return 'status-complete'
          case 'cancelled':
            return 'status-cancelled'
          default:
            return ''
        }
      }
      
      const getStatusIcon = () => {
        const status = queueInfo.value.status
        
        switch(status) {
          case 'waiting':
            return '⏳'
          case 'in-service':
            return '✂️'
          case 'completed':
            return '✓'
          case 'cancelled':
            return '✗'
          default:
            return '❓'
        }
      }
      
      const getStatusText = () => {
        const status = queueInfo.value.status
        
        switch(status) {
          case 'waiting':
            return 'Waiting'
          case 'in-service':
            return 'Currently Being Served'
          case 'completed':
            return 'Service Completed'
          case 'cancelled':
            return 'Cancelled'
          default:
            return 'Unknown'
        }
      }
      
      const formatPosition = (position) => {
        if (position === 1) return 'You\'re next!'
        if (position === 2) return 'One person ahead of you'
        return `${position - 1} people ahead of you`
      }
      
      const formatWaitTime = (minutes) => {
        if (minutes < 1) return 'Less than a minute'
        if (minutes === 1) return '1 minute'
        
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        
        if (hours > 0) {
          return `${hours} hr${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} min` : ''}`
        }
        
        return `${minutes} minutes`
      }
      
      const updateNotificationSettings = () => {
        // In a real app, this would update notification preferences on the server
        console.log('Notification settings updated:', {
          sms: notifyOnPhone.value,
          nextInLine: notifyWhenClose.value
        })
      }
      
      const confirmLeaveQueue = () => {
        if (confirm('Are you sure you want to leave the queue? This action cannot be undone.')) {
          leaveQueue()
        }
      }
      
      const leaveQueue = () => {
        // In a real app, this would call an API to remove from queue
        localStorage.removeItem('activeTicket')
        queueInfo.value.status = 'cancelled'
      }
      
      const handleDone = () => {
        localStorage.removeItem('activeTicket')
        router.push('/nearby')
      }
      
      const openDirections = () => {
        // In a real app, this would open maps with directions
        window.open(`https://maps.google.com/?q=${queueInfo.value.businessName}`, '_blank')
      }
      
      // Set up periodic queue position checking
      const setupRefreshInterval = () => {
        clearInterval(refreshInterval.value)
        
        // Check position every 30 seconds if waiting
        if (queueInfo.value.status === 'waiting') {
          refreshInterval.value = setInterval(() => {
            checkQueuePosition()
          }, 30000) // 30 seconds
        }
      }
      
      // Initial check and setup on mount
      onMounted(async () => {
        await checkQueuePosition()
        setupRefreshInterval()
      })
      
      // Clean up on unmount
      onBeforeUnmount(() => {
        clearInterval(refreshInterval.value)
      })
      
      return {
        ticketId,
        queueInfo,
        isLoading,
        error,
        notifyOnPhone,
        notifyWhenClose,
        progressPercentage,
        checkQueuePosition,
        getStatusClass,
        getStatusIcon,
        getStatusText,
        formatPosition,
        formatWaitTime,
        updateNotificationSettings,
        confirmLeaveQueue,
        handleDone,
        openDirections
      }
    }
  }
  </script>
  
  <style scoped>
  .my-queue-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .content-container > * {
    margin-bottom: 24px;
  }
  
  .loading-container,
  .error-container,
  .no-ticket-container {
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
  
  .error-icon,
  .info-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .error-message {
    color: #dc3545;
    margin-bottom: 16px;
    font-weight: 500;
  }
  
  .retry-btn,
  .back-btn,
  .btn-primary {
    margin-top: 10px;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    text-decoration: none;
    display: inline-block;
  }
  
  .retry-btn {
    background-color: #0066ff;
    color: white;
    margin-right: 10px;
  }
  
  .back-btn {
    background-color: #f5f5f7;
    color: #333;
  }
  
  .btn-primary {
    background-color: #0066ff;
    color: white;
  }
  
  .no-ticket-container h2 {
    margin-bottom: 8px;
  }
  
  .no-ticket-container p {
    color: #666;
    margin-bottom: 20px;
  }
  
  /* Queue Status Card */
  .queue-status-card {
    background-color: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border-top: 5px solid #0066ff;
  }
  
  .queue-status-card.status-waiting {
    border-top-color: #0066ff;
  }
  
  .queue-status-card.status-active {
    border-top-color: #34c759;
  }
  
  .queue-status-card.status-complete {
    border-top-color: #5856d6;
  }
  
  .queue-status-card.status-cancelled {
    border-top-color: #ff3b30;
  }
  
  .status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .status-header h1 {
    font-size: 22px;
    margin: 0;
  }
  
  .ticket-number {
    padding: 6px 12px;
    background-color: #f5f5f7;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
  }
  
  .status-info {
    margin-bottom: 24px;
  }
  
  .barbershop-info {
    margin-bottom: 20px;
  }
  
  .barbershop-info h2 {
    font-size: 20px;
    margin: 0 0 5px 0;
  }
  
  .service-name {
    color: #666;
  }
  
  .status-details {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .status-item {
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
    flex: 1;
    min-width: 200px;
  }
  
  .status-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 12px;
    font-size: 20px;
    flex-shrink: 0;
  }
  
  .status-icon.status-waiting {
    background-color: rgba(0, 102, 255, 0.1);
    color: #0066ff;
  }
  
  .status-icon.status-active {
    background-color: rgba(52, 199, 89, 0.1);
    color: #34c759;
  }
  
  .status-icon.status-complete {
    background-color: rgba(88, 86, 214, 0.1);
    color: #5856d6;
  }
  
  .status-icon.status-cancelled {
    background-color: rgba(255, 59, 48, 0.1);
    color: #ff3b30;
  }
  
  .status-icon.position {
    background-color: rgba(255, 149, 0, 0.1);
    color: #ff9500;
    font-weight: 700;
  }
  
  .status-icon.time {
    background-color: rgba(88, 86, 214, 0.1);
    color: #5856d6;
  }
  
  .status-text {
    flex: 1;
  }
  
  .status-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
  }
  
  .status-value {
    font-weight: 600;
    color: #333;
  }
  
  /* Progress Bar */
  .progress-indicator {
    margin-bottom: 24px;
  }
  
  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .progress-bar {
    position: relative;
    height: 30px;
    margin: 20px 0;
  }
  
  .progress-track {
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    position: relative;
    z-index: 1;
  }
  
  .progress-fill {
    position: absolute;
    height: 8px;
    background-color: #0066ff;
    border-radius: 4px;
    top: 0;
    left: 0;
    z-index: 2;
  }
  
  .progress-marker {
    position: absolute;
    transform: translateX(-50%);
    background-color: #0066ff;
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 12px;
    bottom: 0;
    z-index: 3;
    white-space: nowrap;
  }
  
  .progress-marker::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 8px;
    background-color: #0066ff;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  /* Notification Settings */
  .notification-settings {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
  }
  
  .notification-settings h3 {
    font-size: 16px;
    margin: 0 0 12px 0;
  }
  
  .notification-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .toggle-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  
  /* Action Buttons */
  .action-buttons {
    display: flex;
    justify-content: center;
  }
  
  .btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    text-align: center;
    text-decoration: none;
    display: inline-block;
  }
  
  .btn-primary {
    background-color: #0066ff;
    color: white;
  }
  
  .btn-danger {
    background-color: #ff3b30;
    color: white;
  }
  
  .btn-success {
    background-color: #34c759;
    color: white;
  }
  
  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  /* Location Card */
  .barbershop-location-card {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .barbershop-location-card h3 {
    font-size: 18px;
    margin: 0 0 16px 0;
  }
  
  .location-map {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  
  .location-map img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .map-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .location-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .address {
    margin: 0;
    color: #666;
  }
  
  .get-directions {
    color: #0066ff;
    text-decoration: none;
    font-weight: 500;
  }
  
  .get-directions:hover {
    text-decoration: underline;
  }
  
  /* Tips Card */
  .tips-card {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .tips-card h3 {
    font-size: 18px;
    margin: 0 0 16px 0;
  }
  
  .tips-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }
  
  .tip-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .tip-icon {
    font-size: 24px;
  }
  
  .tip-text {
    color: #666;
    font-size: 14px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Responsive Styles */
  @media (max-width: 768px) {
    .status-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .status-details {
      flex-direction: column;
    }
    
    .status-item {
      width: 100%;
    }
    
    .tips-list {
      grid-template-columns: 1fr;
    }
  }
  </style>