<template>
    <div class="location-picker">
      <div class="location-input">
        <span class="location-icon">📍</span>
        <input 
          type="text" 
          v-model="addressInput" 
          placeholder="Enter your location" 
          @focus="showOptions = true"
          @keydown.enter="searchLocation"
        />
        <button v-if="addressInput" class="clear-btn" @click="clearInput">✕</button>
      </div>
      
      <div v-if="showOptions" class="location-options">
        <div class="location-option" @click="useCurrentLocation">
          <span class="option-icon">📱</span>
          <span>Use my current location</span>
        </div>
        <div class="location-divider"></div>
        <div 
          v-for="(suggestion, index) in suggestions" 
          :key="index" 
          class="location-option"
          @click="selectSuggestion(suggestion)"
        >
          <span class="option-icon">📍</span>
          <span>{{ suggestion }}</span>
        </div>
      </div>
      
      <div v-if="isLoading" class="location-loading">
        <div class="spinner"></div>
        <span>Finding your location...</span>
      </div>
      
      <div v-if="error" class="location-error">
        <span class="error-icon">⚠️</span>
        <span>{{ error }}</span>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch, onMounted, onUnmounted } from 'vue'
  import { useLocationStore } from '@/stores/location'
  
  export default {
    name: 'LocationPicker',
    props: {
      initialValue: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: 'Enter your location'
      }
    },
    
    emits: ['location-selected'],
    
    setup(props, { emit }) {
      const locationStore = useLocationStore()
      
      const addressInput = ref(props.initialValue)
      const showOptions = ref(false)
      const isLoading = ref(false)
      const error = ref('')
      const suggestions = ref([
        'Paris, France',
        'Lyon, France',
        'Marseille, France',
        'Bordeaux, France',
        'Strasbourg, France'
      ])
      
      // Handle clicking outside the component to close options
      const handleClickOutside = (event) => {
        const picker = document.querySelector('.location-picker')
        if (picker && !picker.contains(event.target)) {
          showOptions.value = false
        }
      }
      
      // Add the event listener when mounted
      onMounted(() => {
        document.addEventListener('click', handleClickOutside)
      })
      
      // Clean up the event listener when unmounted
      onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside)
      })
      
      // Use the current geolocation
      const useCurrentLocation = async () => {
        showOptions.value = false
        isLoading.value = true
        error.value = ''
        
        try {
          const success = await locationStore.getCurrentLocation()
          
          if (success) {
            addressInput.value = 'Current Location'
            emit('location-selected', {
              type: 'current',
              latitude: locationStore.latitude,
              longitude: locationStore.longitude
            })
          } else {
            error.value = locationStore.error || 'Unable to get your location'
          }
        } catch (err) {
          error.value = 'Error accessing your location'
          console.error(err)
        } finally {
          isLoading.value = false
        }
      }
      
      // Search for a location by address
      const searchLocation = async () => {
        if (!addressInput.value.trim()) return
        
        showOptions.value = false
        isLoading.value = true
        error.value = ''
        
        try {
          const location = await locationStore.geocodeAddress(addressInput.value)
          
          emit('location-selected', {
            type: 'search',
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.formatted_address
          })
        } catch (err) {
          error.value = 'Error finding this location'
          console.error(err)
        } finally {
          isLoading.value = false
        }
      }
      
      // Select a suggestion
      const selectSuggestion = async (suggestion) => {
        addressInput.value = suggestion
        showOptions.value = false
        await searchLocation()
      }
      
      // Clear the input
      const clearInput = () => {
        addressInput.value = ''
        showOptions.value = false
        emit('location-selected', null)
      }
      
      return {
        addressInput,
        showOptions,
        isLoading,
        error,
        suggestions,
        useCurrentLocation,
        searchLocation,
        selectSuggestion,
        clearInput
      }
    }
  }
  </script>
  
  <style scoped>
  .location-picker {
    position: relative;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .location-input {
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px 16px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .location-icon {
    margin-right: 10px;
    font-size: 18px;
    color: #666;
  }
  
  .location-input input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    background: transparent;
  }
  
  .clear-btn {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 16px;
    padding: 0 5px;
  }
  
  .clear-btn:hover {
    color: #666;
  }
  
  .location-options {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
    overflow: hidden;
  }
  
  .location-option {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .location-option:hover {
    background-color: #f5f5f7;
  }
  
  .option-icon {
    margin-right: 12px;
    font-size: 16px;
    color: #666;
  }
  
  .location-divider {
    height: 1px;
    background-color: #eee;
    margin: 4px 0;
  }
  
  .location-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
    color: #666;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #ddd;
    border-top: 2px solid #0066ff;
    border-radius: 50%;
    margin-right: 10px;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .location-error {
    margin-top: 12px;
    padding: 8px 12px;
    background-color: #fff2f2;
    border-radius: 6px;
    color: #ff3b30;
    display: flex;
    align-items: center;
  }
  
  .error-icon {
    margin-right: 8px;
    font-size: 16px;
  }
  </style>