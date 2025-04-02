import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    userRole: null, // 'client', 'business', 'admin'
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    currentUser: (state) => state.user,
    isBusiness: (state) => state.userRole === 'business',
    isClient: (state) => state.userRole === 'client',
    isAdmin: (state) => state.userRole === 'admin',
  },
  
  actions: {
    async login(credentials) {
      try {
        // For now, simulate API call
        // In production, replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800)) // Simulated delay
        
        // Mock successful login
        if (credentials.email === 'business@example.com' && credentials.password === 'password') {
          const userData = {
            id: 1,
            name: 'Salon Owner',
            email: credentials.email,
            role: 'business',
            avatar: '/images/default-avatar.jpg'
          }
          
          const token = 'mock_token_business_123456'
          
          this.setUser(userData)
          this.setToken(token)
          
          return { success: true }
        } 
        else if (credentials.email === 'client@example.com' && credentials.password === 'password') {
          const userData = {
            id: 2,
            name: 'Client User',
            email: credentials.email,
            role: 'client',
            avatar: '/images/default-avatar.jpg'
          }
          
          const token = 'mock_token_client_123456'
          
          this.setUser(userData)
          this.setToken(token)
          
          return { success: true }
        }
        
        throw new Error('Email ou mot de passe incorrect')
      } catch (error) {
        throw error
      }
    },
    
    async register(userData) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock successful registration
        const user = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          role: userData.role || 'client',
          avatar: '/images/default-avatar.jpg'
        }
        
        const token = `mock_token_${user.role}_${Date.now()}`
        
        this.setUser(user)
        this.setToken(token)
        
        return { success: true }
      } catch (error) {
        throw error
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.userRole = null
      localStorage.removeItem('token')
    },
    
    setUser(user) {
      this.user = user
      this.isAuthenticated = true
      this.userRole = user.role
    },
    
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    async checkAuth() {
      // Check if token exists and validate with the server
      // For now, we'll just check if token exists in local storage
      const token = localStorage.getItem('token')
      
      if (!token) {
        this.logout()
        return false
      }
      
      try {
        // In a real app, you would validate the token with your backend
        // For now, we'll just simulate this
        
        // Parse token to get user info (just for demo, don't do this in production)
        const isBusinessToken = token.includes('business')
        
        if (isBusinessToken) {
          this.setUser({
            id: 1,
            name: 'Salon Owner',
            email: 'business@example.com',
            role: 'business',
            avatar: '/images/default-avatar.jpg'
          })
        } else {
          this.setUser({
            id: 2,
            name: 'Client User',
            email: 'client@example.com',
            role: 'client',
            avatar: '/images/default-avatar.jpg'
          })
        }
        
        return true
      } catch (error) {
        this.logout()
        return false
      }
    }
  }
})