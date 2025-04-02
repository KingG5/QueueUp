import { defineStore } from 'pinia'

export const useBarbershopStore = defineStore('barbershops', {
  state: () => ({
    barbershops: [],
    currentBarbershop: null,
    barbers: [],
    services: [],
    isLoading: false,
    error: null
  }),
  
  getters: {
    getAllBarbershops: (state) => state.barbershops,
    getBarbershopById: (state) => (id) => {
      return state.barbershops.find(shop => shop.id === id)
    },
    getBarbershopServices: (state) => state.services,
    getBarbershopBarbers: (state) => state.barbers,
    isBarberActive: (state) => (barberId) => {
      const barber = state.barbers.find(b => b.id === barberId)
      return barber ? barber.isActive : false
    }
  },
  
  actions: {
    async fetchNearbyBarbershops(location) {
      try {
        this.isLoading = true
        this.error = null
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        this.barbershops = [
          {
            id: 1,
            name: "Salon QueueUp",
            address: "123 Avenue des Coiffeurs, 75001 Paris",
            rating: 4.8,
            distance: 0.8,
            waitTime: 15,
            peopleInQueue: 4,
            openNow: true,
            photo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGFpciUyMHNhbG9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
          },
          {
            id: 2,
            name: "Style Studio",
            address: "45 Rue des Styles, 75002 Paris",
            rating: 4.6,
            distance: 1.2,
            waitTime: 30,
            peopleInQueue: 8,
            openNow: true,
            photo: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhhaXIlMjBzYWxvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
          },
          {
            id: 3,
            name: "Barber Bros",
            address: "78 Boulevard des Frères, 75003 Paris",
            rating: 4.9,
            distance: 1.5,
            waitTime: 25,
            peopleInQueue: 6,
            openNow: true,
            photo: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpcmRyZXNzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
          },
          {
            id: 4,
            name: "Elegant Cuts",
            address: "24 Rue de la Beauté, 75004 Paris",
            rating: 4.5,
            distance: 2.1,
            waitTime: 10,
            peopleInQueue: 2,
            openNow: true,
            photo: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhhaXIlMjBzYWxvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
          },
          {
            id: 5,
            name: "Urban Stylez",
            address: "56 Avenue de la Mode, 75005 Paris",
            rating: 4.3,
            distance: 2.8,
            waitTime: 35,
            peopleInQueue: 9,
            openNow: false,
            photo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGFpciUyMHNhbG9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
          }
        ]
        
      } catch (error) {
        this.error = error.message || 'Failed to fetch barbershops'
      } finally {
        this.isLoading = false
      }
    },
    
    async fetchBarbershopDetails(barbershopId) {
      try {
        this.isLoading = true
        this.error = null
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Find the barbershop in the current list or fetch from API
        const shop = this.barbershops.find(s => s.id === barbershopId)
        
        if (!shop) {
          throw new Error('Barbershop not found')
        }
        
        // Add more details to the shop
        this.currentBarbershop = {
          ...shop,
          description: "Salon de coiffure moderne proposant des services de qualité pour hommes et femmes dans une ambiance conviviale et détendue.",
          phone: "01 23 45 67 89",
          website: "https://www.queueup-salon.com",
          hours: {
            monday: "9:00 - 19:00",
            tuesday: "9:00 - 19:00",
            wednesday: "9:00 - 19:00",
            thursday: "9:00 - 21:00",
            friday: "9:00 - 21:00",
            saturday: "10:00 - 18:00",
            sunday: "Closed"
          }
        }
        
        // Fetch barbers for this barbershop
        await this.fetchBarbers(barbershopId)
        
        // Fetch services for this barbershop
        await this.fetchServices(barbershopId)
        
      } catch (error) {
        this.error = error.message || 'Failed to fetch barbershop details'
      } finally {
        this.isLoading = false
      }
    },
    
    async fetchBarbers(barbershopId) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock data for barbers
        this.barbers = [
          {
            id: 1,
            name: 'Antoine Dupont',
            photo: 'https://randomuser.me/api/portraits/men/32.jpg',
            specialties: ['Coupe homme', 'Barbe'],
            rating: 4.8,
            clientsToday: 8,
            averageTime: 25,
            isActive: true
          },
          {
            id: 2,
            name: 'Sophie Martin',
            photo: 'https://randomuser.me/api/portraits/women/44.jpg',
            specialties: ['Coupe femme', 'Coloration'],
            rating: 4.9,
            clientsToday: 6,
            averageTime: 40,
            isActive: true
          },
          {
            id: 3,
            name: 'Lucas Bernard',
            photo: 'https://randomuser.me/api/portraits/men/22.jpg',
            specialties: ['Coupe homme', 'Barbe', 'Coupe + Barbe'],
            rating: 4.5,
            clientsToday: 7,
            averageTime: 30,
            isActive: false
          },
          {
            id: 4,
            name: 'Julie Lambert',
            photo: 'https://randomuser.me/api/portraits/women/29.jpg',
            specialties: ['Coupe femme', 'Coloration', 'Coiffure événementielle'],
            rating: 4.7,
            clientsToday: 5,
            averageTime: 45,
            isActive: true
          }
        ]
        
      } catch (error) {
        console.error('Failed to fetch barbers:', error)
      }
    },
    
    async fetchServices(barbershopId) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock data for services
        this.services = [
          {
            id: 1,
            name: 'Coupe homme',
            description: 'Coupe et coiffage pour homme, adapté à tous types de cheveux.',
            price: 18,
            duration: 20,
            category: 'Homme',
            isPopular: true
          },
          {
            id: 2,
            name: 'Coupe femme',
            description: 'Coupe et coiffage pour femme, consultation sur le style incluse.',
            price: 28,
            duration: 40,
            category: 'Femme',
            isPopular: true
          },
          {
            id: 3,
            name: 'Taille de barbe',
            description: 'Taille et entretien de la barbe, avec serviette chaude et huiles essentielles.',
            price: 15,
            duration: 15,
            category: 'Homme',
            isPopular: false
          },
          {
            id: 4,
            name: 'Coloration complète',
            description: 'Coloration professionnelle avec des produits de qualité salon.',
            price: 55,
            duration: 60,
            category: 'Coloration',
            isPopular: false
          },
          {
            id: 7,
            name: 'Coupe + barbe',
            description: 'Forfait incluant coupe homme et taille de barbe.',
            price: 30,
            duration: 35,
            category: 'Homme',
            isPopular: true
          }
        ]
        
      } catch (error) {
        console.error('Failed to fetch services:', error)
      }
    },
    
    // Business profile management
    async updateBusinessProfile(businessData) {
      try {
        this.isLoading = true
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Here you would make an API call to update the business profile
        // For now, we'll just return success
        
        return { success: true }
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async updateServices(services) {
      try {
        this.isLoading = true
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Update the services in the store
        this.services = services
        
        return { success: true }
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async updateBarbers(barbers) {
      try {
        this.isLoading = true
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Update the barbers in the store
        this.barbers = barbers
        
        return { success: true }
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})