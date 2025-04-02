import { defineStore } from 'pinia'

export const useQueueStore = defineStore('queues', {
  state: () => ({
    currentQueue: [],
    inServiceList: [],
    completedList: [],
    queueStats: {
      averageWaitTime: 0,
      clientsServedToday: 0,
      totalWaiting: 0
    },
    isLoading: false,
    error: null
  }),
  
  getters: {
    waitingClients: (state) => state.currentQueue,
    clientsInService: (state) => state.inServiceList,
    completedClients: (state) => state.completedList,
    queueLength: (state) => state.currentQueue.length,
    estimatedWaitTime: (state) => state.queueStats.averageWaitTime,
    clientsServed: (state) => state.queueStats.clientsServedToday,
  },
  
  actions: {
    async fetchQueue(businessId) {
      try {
        this.isLoading = true
        this.error = null
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        this.currentQueue = [
          { 
            id: 1, 
            name: 'Jean Dupont', 
            service: 'Coupe homme', 
            waitTime: 15, 
            barber: 'Antoine',
            addedTime: '10:30',
            priority: 'normal',
            notes: ''
          },
          { 
            id: 2, 
            name: 'Marie Martin', 
            service: 'Coupe femme', 
            waitTime: 30, 
            barber: 'Sophie',
            addedTime: '10:45',
            priority: 'normal',
            notes: ''
          },
          { 
            id: 3, 
            name: 'Lucas Bernard', 
            service: 'Barbe', 
            waitTime: 20, 
            barber: 'Lucas',
            addedTime: '11:00',
            priority: 'normal',
            notes: ''
          },
          { 
            id: 4, 
            name: 'Emma Petit', 
            service: 'Coloration', 
            waitTime: 45, 
            barber: null,
            addedTime: '11:15',
            priority: 'high',
            notes: 'Client fidèle'
          }
        ]
        
        this.inServiceList = [
          {
            id: 101,
            name: 'Thomas Leroy',
            service: 'Coupe + Barbe',
            startTime: '11:30',
            duration: 20,
            serviceTime: 35, // Total expected service time
            barber: 'Antoine',
            startTimestamp: Date.now() - 1000 * 60 * 20 // Started 20 minutes ago
          },
          {
            id: 102,
            name: 'Camille Dubois',
            service: 'Coupe femme',
            startTime: '11:45',
            duration: 15,
            serviceTime: 30,
            barber: 'Sophie',
            startTimestamp: Date.now() - 1000 * 60 * 15 // Started 15 minutes ago
          }
        ]
        
        this.completedList = [
          {
            id: 201,
            name: 'Philippe Martin',
            service: 'Coupe homme',
            endTime: '10:45',
            totalTime: 20,
            barber: 'Lucas'
          },
          {
            id: 202,
            name: 'Laura Klein',
            service: 'Coloration',
            endTime: '11:15',
            totalTime: 50,
            barber: 'Julie'
          }
        ]
        
        this.queueStats = {
          averageWaitTime: 25,
          clientsServedToday: 8,
          totalWaiting: this.currentQueue.length
        }
        
      } catch (error) {
        this.error = error.message || 'Failed to fetch queue data'
      } finally {
        this.isLoading = false
      }
    },
    
    async addToQueue(clientData) {
      try {
        this.isLoading = true
        this.error = null
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const now = new Date()
        const formattedTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
        
        const id = Math.max(...this.currentQueue.map(c => c.id), 0) + 1
        
        const newClient = {
          id,
          name: clientData.name,
          service: clientData.service,
          waitTime: this.getServiceWaitTime(clientData.service),
          barber: clientData.barber || null,
          addedTime: formattedTime,
          priority: clientData.priority || 'normal',
          notes: clientData.notes || ''
        }
        
        this.currentQueue.push(newClient)
        this.calculateEstimatedWaitTime()
        
        return { success: true, client: newClient }
      } catch (error) {
        this.error = error.message || 'Failed to add client to queue'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async removeFromQueue(clientId) {
      try {
        this.isLoading = true
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.currentQueue = this.currentQueue.filter(client => client.id !== clientId)
        this.calculateEstimatedWaitTime()
        
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Failed to remove client from queue'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async startService(clientId) {
      try {
        this.isLoading = true
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const clientIndex = this.currentQueue.findIndex(client => client.id === clientId)
        if (clientIndex === -1) throw new Error('Client not found')
        
        const client = this.currentQueue[clientIndex]
        if (!client.barber) throw new Error('Barber must be assigned before starting service')
        
        const now = new Date()
        const formattedTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
        const serviceTime = this.getServiceWaitTime(client.service)
        
        // Create in-service record
        const inServiceClient = {
          id: client.id,
          name: client.name,
          service: client.service,
          startTime: formattedTime,
          duration: 0,
          serviceTime: serviceTime,
          barber: client.barber,
          startTimestamp: Date.now()
        }
        
        // Add to in-service list
        this.inServiceList.push(inServiceClient)
        
        // Remove from queue
        this.currentQueue.splice(clientIndex, 1)
        this.calculateEstimatedWaitTime()
        
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Failed to start service'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async completeService(clientId) {
      try {
        this.isLoading = true
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const clientIndex = this.inServiceList.findIndex(client => client.id === clientId)
        if (clientIndex === -1) throw new Error('Client not found in service')
        
        const client = this.inServiceList[clientIndex]
        const now = new Date()
        const formattedTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
        
        // Calculate elapsed time since service started
        const elapsedMinutes = Math.round((Date.now() - client.startTimestamp) / (1000 * 60))
        
        // Create completed record
        const completedClient = {
          id: client.id,
          name: client.name,
          service: client.service,
          endTime: formattedTime,
          totalTime: elapsedMinutes,
          barber: client.barber
        }
        
        // Add to completed list
        this.completedList.unshift(completedClient)
        
        // Remove from in-service
        this.inServiceList.splice(clientIndex, 1)
        
        // Update stats
        this.queueStats.clientsServedToday++
        
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Failed to complete service'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    getServiceWaitTime(service) {
      const times = {
        'Coupe homme': 15,
        'Coupe femme': 30,
        'Barbe': 20,
        'Coloration': 45,
        'Coupe + Barbe': 35
      }
      
      return times[service] || 20
    },
    
    calculateEstimatedWaitTime() {
      if (this.currentQueue.length === 0) {
        this.queueStats.averageWaitTime = 0
        return
      }
      
      const total = this.currentQueue.reduce((sum, client) => sum + client.waitTime, 0)
      this.queueStats.averageWaitTime = Math.round(total / this.currentQueue.length)
      this.queueStats.totalWaiting = this.currentQueue.length
    },
    
    async joinQueue(businessId, clientData) {
      try {
        this.isLoading = true
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // In a real app, this would send the data to the server
        // For demo purposes, we're just returning a successful response
        
        return {
          success: true,
          queueNumber: Math.floor(Math.random() * 10) + 1, // Random position between 1-10
          estimatedWaitTime: Math.floor(Math.random() * 30) + 15, // Random wait time between 15-45 min
          timestamp: new Date().toISOString()
        }
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async checkQueuePosition(ticketId) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock response
        return {
          position: Math.floor(Math.random() * 5) + 1, // Random position between 1-5
          estimatedWaitTime: Math.floor(Math.random() * 20) + 5, // Random wait time between 5-25 min
          businessName: "Salon QueueUp",
          serviceName: "Coupe homme",
          status: "waiting" // or "in-service", "completed", "cancelled"
        }
      } catch (error) {
        throw error
      }
    }
  }
})