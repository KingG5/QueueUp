<template>
    <div class="barbershop-detail">
      <div v-if="loading" class="loading">
        Loading barbershop details...
      </div>
      
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-else class="shop-container">
        <div class="shop-header">
          <button class="back-button" @click="$router.go(-1)">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          
          <img :src="shop.image || '/images/default-shop.jpg'" alt="Barbershop" class="shop-banner" />
          
          <div class="shop-info">
            <h1>{{ shop.name }}</h1>
            <p class="shop-address">{{ shop.address }}</p>
            
            <div class="shop-rating">
              <span class="rating-stars">
                <i 
                  v-for="n in 5" 
                  :key="n" 
                  :class="n <= Math.round(shop.rating) ? 'fas fa-star' : 'far fa-star'"
                ></i>
              </span>
              <span class="rating-value">{{ shop.rating.toFixed(1) }}</span>
              <span class="rating-count">({{ shop.ratingCount }} reviews)</span>
            </div>
            
            <div class="shop-hours">
              <div class="hours-title">Business Hours:</div>
              <div class="hours-list">
                <div v-for="(hours, day) in shop.hours" :key="day" class="hours-item">
                  <span class="day">{{ formatDay(day) }}:</span>
                  <span class="time">{{ hours }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-tabs">
          <div 
            class="tab" 
            :class="{ active: activeTab === 'queue' }" 
            @click="activeTab = 'queue'"
          >
            Current Queue
          </div>
          <div 
            class="tab" 
            :class="{ active: activeTab === 'barbers' }" 
            @click="activeTab = 'barbers'"
          >
            Barbers
          </div>
          <div 
            class="tab" 
            :class="{ active: activeTab === 'services' }" 
            @click="activeTab = 'services'"
          >
            Services
          </div>
        </div>
        
        <div class="tab-content">
          <!-- Queue Tab -->
          <div v-if="activeTab === 'queue'" class="queue-tab">
            <div class="queue-status-card">
              <h3>Current Queue Status</h3>
              <div class="status-info">
                <div class="status-item">
                  <div class="status-value">{{ queueLength }}</div>
                  <div class="status-label">People in Queue</div>
                </div>
                <div class="status-item">
                  <div class="status-value">{{ estimatedWait }}</div>
                  <div class="status-label">Estimated Wait</div>
                </div>
                <div class="status-item">
                  <div class="status-value">{{ nextAvailable }}</div>
                  <div class="status-label">Next Available</div>
                </div>
              </div>
            </div>
            
            <button class="btn-primary join-queue-btn" @click="goToJoinQueue">
              Join This Queue
            </button>
          </div>
          
          <!-- Barbers Tab -->
          <div v-if="activeTab === 'barbers'" class="barbers-tab">
            <div class="barbers-list">
              <div v-for="barber in barbers" :key="barber.id" class="barber-card">
                <img :src="barber.avatar || '/images/default-avatar.jpg'" alt="Barber" class="barber-avatar" />
                <div class="barber-info">
                  <h3>{{ barber.name }}</h3>
                  <p class="barber-title">{{ barber.title }}</p>
                  
                  <div class="barber-services">
                    <span v-for="service in barber.specialties" :key="service" class="specialty-tag">
                      {{ service }}
                    </span>
                  </div>
                  
                  <div class="barber-status" :class="getBarberStatusClass(barber)">
                    <span class="status-indicator"></span>
                    <span class="status-text">{{ getBarberStatusText(barber) }}</span>
                  </div>
                </div>
                
                <button 
                  class="btn-outline join-barber-btn" 
                  @click="goToJoinQueueWithBarber(barber.id)"
                  :disabled="barber.queueLength > 5"
                >
                  Join Queue for {{ barber.name.split(' ')[0] }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Services Tab -->
          <div v-if="activeTab === 'services'" class="services-tab">
            <div class="services-list">
              <div v-for="service in services" :key="service.id" class="service-card">
                <div class="service-info">
                  <h3>{{ service.name }}</h3>
                  <p class="service-description">{{ service.description }}</p>
                  <div class="service-duration">
                    <i class="far fa-clock"></i> {{ service.duration }} min
                  </div>
                </div>
                <div class="service-price">
                  ${{ service.price }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from '@/firebase/config';
  
  export default {
    name: 'BarbershopDetail',
    data() {
      return {
        shop: {
          name: '',
          address: '',
          rating: 0,
          ratingCount: 0,
          hours: {},
          image: ''
        },
        barbers: [],
        services: [],
        queueLength: 0,
        loading: true,
        error: null,
        activeTab: 'queue'
      }
    },
    computed: {
      estimatedWait() {
        const waitMinutes = this.queueLength * 20; // 20 min average per person
        
        if (waitMinutes === 0) return 'No wait';
        if (waitMinutes < 60) return `${waitMinutes} min`;
        
        const hours = Math.floor(waitMinutes / 60);
        const minutes = waitMinutes % 60;
        
        if (minutes === 0) return `${hours} hr`;
        return `${hours} hr ${minutes} min`;
      },
      
      nextAvailable() {
        const now = new Date();
        const waitMinutes = this.queueLength * 20; // 20 min average
        const nextTime = new Date(now.getTime() + waitMinutes * 60000);
        
        // Format time as HH:MM AM/PM
        return nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    },
    async created() {
      const shopId = this.$route.params.id;
      if (!shopId) {
        this.error = "No barbershop ID provided";
        this.loading = false;
        return;
      }
      
      await this.loadBarbershopData(shopId);
    },
    methods: {
      async loadBarbershopData(shopId) {
        try {
          // Load barbershop details
          const shopDoc = await db.collection('barbershops').doc(shopId).get();
          
          if (!shopDoc.exists) {
            this.error = "Barbershop not found";
            this.loading = false;
            return;
          }
          
          this.shop = {
            id: shopDoc.id,
            ...shopDoc.data()
          };
          
          // Load barbers for this shop
          const barbersSnapshot = await db.collection('barbers')
            .where('barbershopId', '==', shopId)
            .get();
            
          this.barbers = [];
          barbersSnapshot.forEach(doc => {
            this.barbers.push({
              id: doc.id,
              ...doc.data(),
              queueLength: 0
            });
          });
          
          // Load services for this shop
          const servicesSnapshot = await db.collection('services')
            .where('barbershopId', '==', shopId)
            .get();
            
          this.services = [];
          servicesSnapshot.forEach(doc => {
            this.services.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          // Get queue information
          await this.getQueueInfo(shopId);
          
          // Get queue length for each barber
          for (let barber of this.barbers) {
            await this.getBarberQueueLength(barber);
          }
        } catch (error) {
          this.error = "Failed to load barbershop data: " + error.message;
        } finally {
          this.loading = false;
        }
      },
      
      async getQueueInfo(shopId) {
        try {
          const snapshot = await db.collection('queues')
            .where('barbershopId', '==', shopId)
            .where('status', '==', 'waiting')
            .get();
            
          this.queueLength = snapshot.size;
        } catch (error) {
          console.error("Error getting queue info:", error);
        }
      },
      
      async getBarberQueueLength(barber) {
        try {
          const snapshot = await db.collection('queues')
            .where('barberId', '==', barber.id)
            .where('status', '==', 'waiting')
            .get();
            
          barber.queueLength = snapshot.size;
        } catch (error) {
          console.error("Error getting barber queue length:", error);
        }
      },
      
      formatDay(day) {
        const days = {
          'monday': 'Monday',
          'tuesday': 'Tuesday',
          'wednesday': 'Wednesday',
          'thursday': 'Thursday',
          'friday': 'Friday',
          'saturday': 'Saturday',
          'sunday': 'Sunday'
        };
        
        return days[day.toLowerCase()] || day;
      },
      
      getBarberStatusClass(barber) {
        if (barber.queueLength === 0) return 'status-available';
        if (barber.queueLength < 3) return 'status-light';
        if (barber.queueLength < 6) return 'status-busy';
        return 'status-full';
      },
      
      getBarberStatusText(barber) {
        if (barber.queueLength === 0) return 'Available now';
        if (barber.queueLength === 1) return '1 person waiting';
        return `${barber.queueLength} people waiting`;
      },
      
      goToJoinQueue() {
        this.$router.push({
          path: '/join-queue',
          query: { shop: this.shop.id }
        });
      },
      
      goToJoinQueueWithBarber(barberId) {
        this.$router.push({
          path: '/join-queue',
          query: { 
            shop: this.shop.id,
            barber: barberId
          }
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .barbershop-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .loading {
    text-align: center;
    padding: 40px 0;
  }
  
  .error-message {
    background-color: #ffeeee;
    color: #cc0000;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 20px;
  }
  
  .shop-container {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .shop-header {
    position: relative;
  }
  
  .back-button {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .shop-banner {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .shop-info {
    padding: 20px;
  }
  
  .shop-info h1 {
    margin: 0 0 10px;
    color: #333;
  }
  
  .shop-address {
    color: #666;
    margin-bottom: 12px;
  }
  
  .shop-rating {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .rating-stars {
    color: #f59e0b;
    margin-right: 8px;
  }
  
  .rating-value {
    font-weight: 600;
    margin-right: 4px;
  }
  
  .rating-count {
    color: #666;
    font-size: 14px;
  }
  
  .shop-hours {
    margin-top: 16px;
  }
  
  .hours-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }
  
  .hours-item {
    display: flex;
    margin-bottom: 4px;
  }
  
  .day {
    width: 100px;
    color: #666;
  }
  
  .time {
    font-weight: 500;
  }
  
  .content-tabs {
    display: flex;
    border-bottom: 1px solid #eee;
  }
  
  .tab {
    flex: 1;
    text-align: center;
    padding: 16px;
    cursor: pointer;
    font-weight: 500;
    color: #666;
    transition: all 0.2s;
  }
  
  .tab.active {
    color: #0066ff;
    border-bottom: 2px solid #0066ff;
  }
  
  .tab-content {
    padding: 20px;
  }
  
  /* Queue Tab Styles */
  .queue-status-card {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .queue-status-card h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #333;
  }
  
  .status-info {
    display: flex;
    justify-content: space-between;
  }
  
  .status-item {
    text-align: center;
    flex: 1;
  }
  
  .status-value {
    font-size: 24px;
    font-weight: 700;
    color: #0066ff;
    margin-bottom: 4px;
  }
  
  .status-label {
    font-size: 14px;
    color: #666;
  }
  
  .join-queue-btn {
    width: 100%;
    margin-top: 16px;
  }
  
  /* Barbers Tab Styles */
  .barbers-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .barber-card {
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
    border-radius: 8px;
    overflow: hidden;
    padding: 16px;
  }
  
  .barber-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 12px;
  }
  
  .barber-info {
    flex: 1;
  }
  
  .barber-info h3 {
    margin: 0 0 4px;
    color: #333;
  }
  
  .barber-title {
    color: #666;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .barber-services {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  
  .specialty-tag {
    background-color: #eee;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 8px;
    margin-bottom: 8px;
  }
  
  .barber-status {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }
  
  .status-available .status-indicator {
    background-color: #10b981;
  }
  
  .status-light .status-indicator {
    background-color: #f59e0b;
  }
  
  .status-busy .status-indicator {
    background-color: #f97316;
  }
  
  .status-full .status-indicator {
    background-color: #ef4444;
  }
  
  .status-available .status-text {
    color: #10b981;
  }
  
  .status-light .status-text {
    color: #f59e0b;
  }
  
  .status-busy .status-text {
    color: #f97316;
  }
  
  .status-full .status-text {
    color: #ef4444;
  }
  
  .join-barber-btn {
    margin-top: 12px;
  }
  
  /* Services Tab Styles */
  .services-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .service-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 16px;
  }
  
  .service-info {
    flex: 1;
  }
  
  .service-info h3 {
    margin: 0 0 8px;
    color: #333;
  }
  
  .service-description {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .service-duration {
    color: #888;
    font-size: 14px;
  }
  
  .service-price {
    font-size: 20px;
    font-weight: 700;
    color: #0066ff;
    margin-left: 20px;
  }
  
  /* Button Styles */
  .btn-primary {
    background-color: #0066ff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-primary:hover {
    background-color: #0052cc;
  }
  
  .btn-outline {
    background-color: transparent;
    color: #0066ff;
    border: 1px solid #0066ff;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-outline:hover {
    background-color: rgba(0, 102, 255, 0.1);
  }
  
  .btn-outline:disabled {
    color: #aaa;
    border-color: #ccc;
    cursor: not-allowed;
  }
  </style>