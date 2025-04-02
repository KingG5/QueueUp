import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', {
  state: () => ({
    currentLocation: null,
    searchLocation: null,
    searchRadius: 5, // in kilometers
    permissionDenied: false,
    isLoading: false,
    error: null
  }),
  
  getters: {
    hasLocation: (state) => !!state.currentLocation,
    latitude: (state) => state.currentLocation?.latitude,
    longitude: (state) => state.currentLocation?.longitude,
    formattedAddress: (state) => state.searchLocation?.formatted_address || '',
  },
  
  actions: {
    async getCurrentLocation() {
      if (!navigator.geolocation) {
        this.error = "Geolocation is not supported by your browser"
        return false
      }
      
      try {
        this.isLoading = true
        this.error = null
        
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          })
        })
        
        this.currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        
        return true
      } catch (error) {
        if (error.code === 1) {
          this.permissionDenied = true
          this.error = "Location permission denied"
        } else {
          this.error = "Unable to retrieve your location"
        }
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    setSearchLocation(location) {
      this.searchLocation = location
    },
    
    setSearchRadius(radius) {
      this.searchRadius = radius
    },
    
    // Simulate geocoding (address to coordinates)
    async geocodeAddress(address) {
      try {
        this.isLoading = true
        this.error = null
        
        // In a real app, you would call a geocoding API
        // For demo, we'll simulate a response with random coordinates near Paris
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Generate random coordinates in Paris area
        const lat = 48.8566 + (Math.random() - 0.5) * 0.1
        const lng = 2.3522 + (Math.random() - 0.5) * 0.1
        
        const location = {
          latitude: lat,
          longitude: lng,
          formatted_address: address
        }
        
        this.searchLocation = location
        return location
      } catch (error) {
        this.error = "Failed to geocode address"
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    // Calculate distance between two points (haversine formula)
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371 // Earth's radius in kilometers
      const dLat = this.deg2rad(lat2 - lat1)
      const dLon = this.deg2rad(lon2 - lon1)
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const distance = R * c // Distance in km
      return distance
    },
    
    deg2rad(deg) {
      return deg * (Math.PI/180)
    },
    
    // Clear location data
    clearLocationData() {
      this.currentLocation = null
      this.searchLocation = null
      this.error = null
      this.permissionDenied = false
    },
    
    // Find places nearby using the current or search location
    async findNearbyPlaces(placeType = 'barbershop', radius = null) {
      try {
        this.isLoading = true
        this.error = null
        
        // Use either search location or current location
        const location = this.searchLocation || this.currentLocation
        
        if (!location) {
          throw new Error('No location selected')
        }
        
        // Use specified radius or default search radius
        const searchRadius = radius || this.searchRadius
        
        // In a real app, you'd call a Places API like Google Places
        // For demo, we'll just simulate a response
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Generate some fake places within the radius
        const places = this.generateFakePlaces(location, searchRadius, placeType)
        
        return places
      } catch (error) {
        this.error = error.message || 'Failed to find nearby places'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    // Generate fake places for demo purposes
    generateFakePlaces(location, radius, placeType) {
      const places = []
      const numPlaces = 5 + Math.floor(Math.random() * 10) // 5-14 places
      
      const placeNames = {
        barbershop: [
          "Elite Cuts", "Modern Barber", "Classic Shave", "Style Studio", 
          "Gentleman's Grooming", "The Hair Lounge", "Quick Clips", 
          "Urban Stylez", "Sharp Edges", "Royal Cuts"
        ]
      }
      
      for (let i = 0; i < numPlaces; i++) {
        // Generate a random position within the radius
        const r = radius * Math.sqrt(Math.random()) // random radius
        const theta = Math.random() * 2 * Math.PI // random angle
        
        // Convert to cartesian coords
        const dx = r * Math.cos(theta)
        const dy = r * Math.sin(theta)
        
        // Convert to lat/lng (approximate)
        const lat = location.latitude + (dy / 111)
        const lng = location.longitude + (dx / (111 * Math.cos(location.latitude * (Math.PI/180))))
        
        // Calculate actual distance using haversine formula
        const distance = this.calculateDistance(location.latitude, location.longitude, lat, lng)
        
        places.push({
          id: i + 1,
          name: placeNames[placeType][i % placeNames[placeType].length],
          latitude: lat,
          longitude: lng,
          distance: parseFloat(distance.toFixed(1)),
          address: `${Math.floor(Math.random() * 100) + 1} ${['Main St', 'Broadway', 'Park Ave', 'Maple Rd', 'Oak Lane'][Math.floor(Math.random() * 5)]}`,
          rating: (3.5 + Math.random() * 1.5).toFixed(1),
          waitTime: Math.floor(Math.random() * 45) + 5, // 5-50 minutes
          openNow: Math.random() > 0.2 // 80% chance of being open
        })
      }
      
      // Sort by distance
      return places.sort((a, b) => a.distance - b.distance)
    }
  }
})