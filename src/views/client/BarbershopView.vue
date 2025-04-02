<template>
    <div class="barbershop-view">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading barbershop details...</div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ error }}</div>
        <button class="btn retry-btn" @click="fetchBarbershopDetails">Retry</button>
        <router-link to="/nearby" class="btn back-btn">Back to Search</router-link>
      </div>
      
      <!-- Barbershop details -->
      <div v-else-if="barbershop" class="barbershop-details">
        <div class="barbershop-header" :style="{ backgroundImage: `url(${barbershop.photo})` }">
          <div class="header-overlay">
            <div class="header-content">
              <h1 class="barbershop-name">{{ barbershop.name }}</h1>
              <div class="barbershop-meta">
                <div class="rating">
                  <span class="star-icon">⭐</span>
                  <span>{{ barbershop.rating }}</span>
                </div>
                <div class="status" :class="{ 'open': barbershop.openNow, 'closed': !barbershop.openNow }">
                  {{ barbershop.openNow ? 'Open Now' : 'Closed' }}
                </div>
              </div>
              <div class="barbershop-address">{{ barbershop.address }}</div>
            </div>
          </div>
        </div>
        
        <div class="content-container">
          <div class="main-content">
            <div class="info-section">
              <div class="info-row">
                <div class="info-card">
                  <h3>Wait Time</h3>
                  <div class="info-value">{{ barbershop.waitTime }} min</div>
                </div>
                
                <div class="info-card">
                  <h3>Distance</h3>
                  <div class="info-value">{{ formatDistance(barbershop.distance) }}</div>
                </div>
                
                <div class="info-card">
                  <h3>People in Queue</h3>
                  <div class="info-value">{{ barbershop.peopleInQueue }}</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">About</h2>
              <p class="section-content">{{ barbershop.description }}</p>
            </div>
            
            <div class="section">
              <h2 class="section-title">Hours</h2>
              <div class="hours-list">
                <div 
                  v-for="(hours, day) in barbershop.hours" 
                  :key="day"
                  class="hours-item"
                  :class="{ 'current-day': isCurrentDay(day) }"
                >
                  <div class="day">{{ formatDay(day) }}</div>
                  <div class="time">{{ hours }}</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">Services</h2>
              <div class="services-list">
                <div 
                  v-for="service in services" 
                  :key="service.id"
                  class="service-item"
                  :class="{ 'popular': service.isPopular }"
                >
                  <div class="service-info">
                    <div class="service-name">{{ service.name }}</div>
                    <div v-if="service.isPopular" class="popular-badge">Popular</div>
                  </div>
                  <div class="service-details">
                    <div class="service-description">{{ service.description }}</div>
                    <div class="service-meta">
                      <div class="service-duration">{{ service.duration }} min</div>
                      <div class="service-price">{{ formatPrice(service.price) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">Staff</h2>
              <div class="barbers-list">
                <div 
                  v-for="barber in barbers" 
                  :key="barber.id"
                  class="barber-item"
                  :class="{ 'inactive': !barber.isActive }"
                >
                  <div class="barber-photo">
                    <img :src="barber.photo" :alt="barber.name">
                    <div v-if="!barber.isActive" class="unavailable-badge">Unavailable</div>
                  </div>
                  <div class="barber-details">
                    <div class="barber-name">{{ barber.name }}</div>
                    <div class="barber-rating">
                      <span class="star-icon">⭐</span>
                      <span>{{ barber.rating }}</span>
                    </div>
                    <div class="barber-specialties">
                      <span 
                        v-for="(specialty, index) in barber.specialties" 
                        :key="specialty"
                      >
                        {{ specialty }}{{ index < barber.specialties.length - 1 ? ', ' : '' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">Contact</h2>
              <div class="contact-info">
                <div class="contact-item">
                  <div class="contact-icon">📞</div>
                  <div class="contact-detail">{{ barbershop.phone }}</div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">🌐</div>
                  <div class="contact-detail">
                    <a :href="barbershop.website" target="_blank" rel="noopener noreferrer">{{ barbershop.website }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="sidebar">
            <div class="queue-status-card">
              <QueueCounter 
                :count="barbershop.peopleInQueue"
                :waitTime="barbershop.waitTime"
              />
            </div>
            
            <div v-if="!showJoinQueue" class="action-card">
              <h3>Ready for a haircut?</h3>
              <p>Join the queue now and we'll notify you when it's your turn.</p>
              <button 
                class="btn btn-primary btn-block"
                :disabled="!barbershop.openNow"
                @click="showJoinQueue = true"
              >
                Join the Queue
              </button>
              <div v-if="!barbershop.openNow" class="closed-message">
                Barbershop is currently closed
              </div>
            </div>
            
            <JoinQueueForm 
              v-if="showJoinQueue"
              :barbershopId="barbershopId"
              :services="services"
              :barbers="activeBarbers"
              :peopleInQueue="barbershop.peopleInQueue"
              :estimatedWaitTime="barbershop.waitTime"
              @cancel="showJoinQueue = false"
              @done="handleQueueJoined"
              @joined="handleQueueJoined"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useBarbershopStore } from '@/stores/barbershops'
  import QueueCounter from '@/components/client/QueueCounter.vue'
  import JoinQueueForm from '@/components/client/JoinQueueForm.vue'
  
  export default {
    name: 'BarbershopView',
    components: {
      QueueCounter,
      JoinQueueForm
    },
    
    setup() {
      const route = useRoute()
      const router = useRouter()
      const barbershopStore = useBarbershopStore()
      
      // State
      const barbershopId = parseInt(route.params.id)
      const showJoinQueue = ref(false)
      
      // Computed properties
      const isLoading = computed(() => barbershopStore.isLoading)
      const error = computed(() => barbershopStore.error)
      const barbershop = computed(() => barbershopStore.currentBarbershop)
      const services = computed(() => barbershopStore.getBarbershopServices)
      const barbers = computed(() => barbershopStore.getBarbershopBarbers)
      const activeBarbers = computed(() => barbers.value.filter(b => b.isActive))
      
      // Methods
      const fetchBarbershopDetails = async () => {
        try {
          await barbershopStore.fetchBarbershopDetails(barbershopId)
        } catch (error) {
          console.error('Error fetching barbershop details:', error)
        }
      }
      
      const formatDistance = (distance) => {
        if (distance < 1) {
          return `${Math.round(distance * 1000)} m`
        }
        return `${distance.toFixed(1)} km`
      }
      
      const formatPrice = (price) => {
        return `${price.toFixed(2)} €`
      }
      
      const isCurrentDay = (day) => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const currentDay = days[new Date().getDay()]
        return day === currentDay
      }
      
      const formatDay = (day) => {
        const days = {
          monday: 'Monday',
          tuesday: 'Tuesday',
          wednesday: 'Wednesday',
          thursday: 'Thursday',
          friday: 'Friday',
          saturday: 'Saturday',
          sunday: 'Sunday'
        }
        return days[day] || day
      }
      
      const handleQueueJoined = (queueInfo) => {
        // Navigate to the queue status page
        router.push({
          name: 'myQueue',
          query: {
            ticket: queueInfo.ticketId
          }
        })
      }
      
      // Fetch barbershop details on component mount
      onMounted(() => {
        fetchBarbershopDetails()
      })
      
      return {
        barbershopId,
        barbershop,
        services,
        barbers,
        activeBarbers,
        isLoading,
        error,
        showJoinQueue,
        fetchBarbershopDetails,
        formatDistance,
        formatPrice,
        isCurrentDay,
        formatDay,
        handleQueueJoined
      }
    }
  }
  </script>
  
  <style scoped>
  .barbershop-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-top: 20px;
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
  
  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .error-message {
    color: #dc3545;
    margin-bottom: 16px;
    font-weight: 500;
  }
  
  .retry-btn,
  .back-btn {
    margin-top: 10px;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    border: none;
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
  
  .barbershop-header {
    height: 250px;
    background-size: cover;
    background-position: center;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  
  .header-overlay {
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);
    display: flex;
    align-items: flex-end;
  }
  
  .header-content {
    padding: 24px;
    width: 100%;
    color: white;
  }
  
  .barbershop-name {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .barbershop-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
  }
  
  .rating {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 600;
  }
  
  .star-icon {
    color: #ffcc00;
  }
  
  .status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
  }
  
  .status.open {
    background-color: rgba(52, 199, 89, 0.2);
    color: #34c759;
  }
  
  .status.closed {
    background-color: rgba(255, 59, 48, 0.2);
    color: #ff3b30;
  }
  
  .barbershop-address {
    font-size: 16px;
    opacity: 0.9;
  }
  
  .content-container {
    display: flex;
    gap: 24px;
  }
  
  .main-content {
    flex: 1;
  }
  
  .sidebar {
    width: 350px;
    flex-shrink: 0;
  }
  
  .info-section {
    margin-bottom: 24px;
  }
  
  .info-row {
    display: flex;
    gap: 16px;
  }
  
  .info-card {
    flex: 1;
    background-color: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    text-align: center;
  }
  
  .info-card h3 {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .info-value {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
  
  .section {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }
  
  .section-content {
    color: #666;
    line-height: 1.6;
  }
  
  .hours-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .hours-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .hours-item:last-child {
    border-bottom: none;
  }
  
  .hours-item.current-day {
    font-weight: 600;
    color: #0066ff;
  }
  
  .services-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .service-item {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .service-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  
  .service-item.popular {
    border-left: 3px solid #0066ff;
  }
  
  .service-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .service-name {
    font-weight: 600;
  }
  
  .popular-badge {
    background-color: rgba(0, 102, 255, 0.1);
    color: #0066ff;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 600;
  }
  
  .service-description {
    color: #666;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .service-meta {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
  
  .service-duration {
    color: #666;
  }
  
  .service-price {
    font-weight: 600;
    color: #333;
  }
  
  .barbers-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .barber-item {
    background-color: white;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .barber-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  
  .barber-item.inactive {
    opacity: 0.7;
  }
  
  .barber-photo {
    position: relative;
    height: 150px;
    overflow: hidden;
  }
  
  .barber-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .unavailable-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(255, 59, 48, 0.9);
    color: white;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 600;
  }
  
  .barber-details {
    padding: 12px;
  }
  
  .barber-name {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .barber-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    margin-bottom: 4px;
  }
  
  .barber-specialties {
    font-size: 12px;
    color: #666;
  }
  
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .contact-icon {
    font-size: 18px;
    color: #0066ff;
  }
  
  .contact-detail a {
    color: #0066ff;
    text-decoration: none;
  }
  
  .contact-detail a:hover {
    text-decoration: underline;
  }
  
  .queue-status-card,
  .action-card {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
  }
  
  .action-card h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }
  
  .action-card p {
    color: #666;
    margin-bottom: 16px;
  }
  
  .btn-block {
    display: block;
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .btn-primary {
    background-color: #0066ff;
    color: white;
    border: none;
  }
  
  .btn-primary:hover:not(:disabled) {
    background-color: #0055d6;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 102, 255, 0.2);
  }
  
  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .closed-message {
    text-align: center;
    margin-top: 12px;
    color: #ff3b30;
    font-size: 14px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Responsive styles */
  @media (max-width: 992px) {
    .content-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      order: -1;
      margin-bottom: 24px;
    }
  }
  
  @media (max-width: 768px) {
    .info-row {
      flex-direction: column;
      gap: 12px;
    }
    
    .barbers-list {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }
  }
  
  @media (max-width: 576px) {
    .barbershop-header {
      height: 200px;
    }
    
    .info-card {
      padding: 12px;
    }
    
    .info-value {
      font-size: 20px;
    }
    
    .barbers-list {
      grid-template-columns: 1fr 1fr;
    }
  }
  </style>