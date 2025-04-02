<template>
    <div class="nearby-view">
      <div class="header-container">
        <h1 class="page-title">Find Nearby Barbershops</h1>
        
        <div class="search-container">
          <LocationPicker
            :placeholder="'Search for barbershops near you'"
            @location-selected="handleLocationSelected"
          />
        </div>
      </div>
      
      <div class="filter-container">
        <div class="filter-heading">
          <h2>{{ barbershops.length }} barbershops found</h2>
          <span v-if="selectedLocation" class="location-label">
            <span class="location-icon">📍</span>
            {{ formattedLocation }}
          </span>
        </div>
        
        <div class="filter-options">
          <div class="filter-option">
            <label for="sort-option">Sort by:</label>
            <select id="sort-option" v-model="sortOption" class="select-input">
              <option value="distance">Distance</option>
              <option value="waitTime">Wait Time</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          
          <div class="filter-toggles">
            <label class="toggle-option">
              <input type="checkbox" v-model="showOpenOnly">
              <span>Open Now</span>
            </label>
            
            <label class="toggle-option">
              <input type="checkbox" v-model="showShortWait">
              <span>Short Wait (&lt;15min)</span>
            </label>
          </div>
        </div>
      </div>
      
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">Finding nearby barbershops...</div>
      </div>
      
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ error }}</div>
        <button class="btn retry-btn" @click="fetchBarbershops">Retry</button>
      </div>
      
      <div v-else-if="filteredBarbershops.length === 0" class="empty-container">
        <div class="empty-icon">🔍</div>
        <h3>No barbershops found</h3>
        <p>
          {{ showOpenOnly || showShortWait ? 
            'Try changing your filters or search in a different location' : 
            'No barbershops found in this area. Try searching in a different location.' }}
        </p>
      </div>
      
      <div v-else class="barbershops-grid">
        <BarbershopCard 
          v-for="barbershop in filteredBarbershops" 
          :key="barbershop.id"
          :barbershop="barbershop"
          @join-queue="handleJoinQueue"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { useBarbershopStore } from '@/stores/barbershops'
  import { useLocationStore } from '@/stores/location'
  import BarbershopCard from '@/components/client/BarbershopCard.vue'
  import LocationPicker from '@/components/common/LocationPicker.vue'
  
  export default {
    name: 'NearbyView',
    components: {
      BarbershopCard,
      LocationPicker
    },
    
    setup() {
      const barbershopStore = useBarbershopStore()
      const locationStore = useLocationStore()
      
      // State
      const sortOption = ref('distance')
      const showOpenOnly = ref(false)
      const showShortWait = ref(false)
      const selectedLocation = ref(null)
      
      // Computed properties
      const isLoading = computed(() => barbershopStore.isLoading)
      const error = computed(() => barbershopStore.error)
      const barbershops = computed(() => barbershopStore.getAllBarbershops)
      
      const filteredBarbershops = computed(() => {
        let shops = [...barbershops.value]
        
        // Apply filters
        if (showOpenOnly.value) {
          shops = shops.filter(shop => shop.openNow)
        }
        
        if (showShortWait.value) {
          shops = shops.filter(shop => shop.waitTime < 15)
        }
        
        // Apply sorting
        shops.sort((a, b) => {
          switch (sortOption.value) {
            case 'distance':
              return a.distance - b.distance
            case 'waitTime':
              return a.waitTime - b.waitTime
            case 'rating':
              return b.rating - a.rating
            default:
              return 0
          }
        })
        
        return shops
      })
      
      const formattedLocation = computed(() => {
        if (!selectedLocation.value) return ''
        
        if (selectedLocation.value.type === 'current') {
          return 'Current Location'
        }
        
        return selectedLocation.value.address || `${selectedLocation.value.latitude.toFixed(4)}, ${selectedLocation.value.longitude.toFixed(4)}`
      })
      
      // Methods
      const fetchBarbershops = async () => {
        if (!selectedLocation.value) return
        
        try {
          await barbershopStore.fetchNearbyBarbershops({
            latitude: selectedLocation.value.latitude,
            longitude: selectedLocation.value.longitude
          }, 5) // 5km radius
        } catch (error) {
          console.error('Error fetching barbershops:', error)
        }
      }
      
      const handleLocationSelected = async (location) => {
        if (!location) {
          selectedLocation.value = null
          return
        }
        
        selectedLocation.value = location
        await fetchBarbershops()
      }
      
      const handleJoinQueue = (barbershop) => {
        // Navigate to the barbershop detail page
        window.location.href = `/barbershop/${barbershop.id}`
      }
      
      // On component mount
      onMounted(async () => {
        // Try to get current location on component mount
        try {
          const success = await locationStore.getCurrentLocation()
          
          if (success) {
            selectedLocation.value = {
              type: 'current',
              latitude: locationStore.latitude,
              longitude: locationStore.longitude
            }
            
            await fetchBarbershops()
          }
        } catch (error) {
          console.error('Error getting current location:', error)
        }
      })
      
      return {
        sortOption,
        showOpenOnly,
        showShortWait,
        isLoading,
        error,
        barbershops,
        filteredBarbershops,
        selectedLocation,
        formattedLocation,
        fetchBarbershops,
        handleLocationSelected,
        handleJoinQueue
      }
    }
  }
  </script>
  
  <style scoped>
  .nearby-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header-container {
    margin-bottom: 30px;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
  }
  
  .search-container {
    max-width: 600px;
  }
  
  .filter-container {
    background-color: white;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .filter-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .filter-heading h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }
  
  .location-label {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 14px;
  }
  
  .location-icon {
    margin-right: 6px;
  }
  
  .filter-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
  
  .filter-option {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .filter-option label {
    font-size: 14px;
    color: #666;
  }
  
  .select-input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: white;
  }
  
  .filter-toggles {
    display: flex;
    gap: 16px;
  }
  
  .toggle-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
  }
  
  .barbershops-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }
  
  .loading-container,
  .error-container,
  .empty-container {
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
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .error-message {
    color: #dc3545;
    margin-bottom: 16px;
    font-weight: 500;
  }
  
  .retry-btn {
    background-color: #0066ff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
  }
  
  .empty-container h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    color: #333;
  }
  
  .empty-container p {
    color: #666;
    max-width: 400px;
    margin: 0;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .filter-heading {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .filter-options {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .barbershops-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>