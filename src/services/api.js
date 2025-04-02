// Base API configuration

// Define base URL - this would be your actual API endpoint in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.queueup.example.com/v1';

// Default headers
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Authentication helper
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Merge default headers with any provided headers and auth token
    const headers = {
      ...defaultHeaders,
      ...getAuthHeader(),
      ...options.headers,
    };
    
    const config = {
      ...options,
      headers,
    };
    
    // For demonstration/MVP, let's log the request
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    // Parse JSON response if available
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // If response is not ok, throw an error
    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
};

// For the MVP, we'll simulate API responses
// In a real application, you would replace these with actual API calls

// Auth API
const authAPI = {
  login: async (credentials) => {
    // Simulate API call for login
    return simulateApiCall(() => {
      if (credentials.email === 'business@example.com' && credentials.password === 'password') {
        return {
          token: 'mock_token_business_123456',
          user: {
            id: 1,
            name: 'Salon Owner',
            email: credentials.email,
            role: 'business',
          }
        };
      } 
      else if (credentials.email === 'client@example.com' && credentials.password === 'password') {
        return {
          token: 'mock_token_client_123456',
          user: {
            id: 2,
            name: 'Client User',
            email: credentials.email,
            role: 'client',
          }
        };
      }
      
      throw new Error('Email ou mot de passe incorrect');
    });
  },
  
  register: async (userData) => {
    // Simulate API call for registration
    return simulateApiCall(() => {
      // In a real app, you would validate the data
      return {
        token: `mock_token_${userData.role || 'client'}_${Date.now()}`,
        user: {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          role: userData.role || 'client',
        }
      };
    });
  },
  
  logout: async () => {
    // Simulate API call for logout
    return simulateApiCall(() => ({ success: true }));
  },
  
  validateToken: async () => {
    // Simulate API call to validate token
    return simulateApiCall(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Invalid token');
      }
      
      // Check if token is a business token or client token
      const isBusinessToken = token.includes('business');
      
      return {
        user: isBusinessToken
          ? {
              id: 1,
              name: 'Salon Owner',
              email: 'business@example.com',
              role: 'business',
            }
          : {
              id: 2,
              name: 'Client User',
              email: 'client@example.com',
              role: 'client',
            }
      };
    });
  }
};

// Queues API
const queuesAPI = {
  getQueue: async (businessId) => {
    // Simulate API call to get queue for a business
    return simulateApiCall(() => {
      return {
        currentQueue: [
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
        ],
        inServiceList: [
          {
            id: 101,
            name: 'Thomas Leroy',
            service: 'Coupe + Barbe',
            startTime: '11:30',
            duration: 20,
            serviceTime: 35,
            barber: 'Antoine',
            startTimestamp: Date.now() - 1000 * 60 * 20
          },
          {
            id: 102,
            name: 'Camille Dubois',
            service: 'Coupe femme',
            startTime: '11:45',
            duration: 15,
            serviceTime: 30,
            barber: 'Sophie',
            startTimestamp: Date.now() - 1000 * 60 * 15
          }
        ],
        completedList: [
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
        ],
        stats: {
          averageWaitTime: 25,
          clientsServedToday: 8,
          totalWaiting: 4
        }
      };
    });
  },
  
  addToQueue: async (businessId, clientData) => {
    // Simulate API call to add a client to the queue
    return simulateApiCall(() => {
      const now = new Date();
      const formattedTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      return {
        id: Date.now(),
        name: clientData.name,
        service: clientData.service,
        waitTime: getServiceWaitTime(clientData.service),
        barber: clientData.barber || null,
        addedTime: formattedTime,
        priority: clientData.priority || 'normal',
        notes: clientData.notes || ''
      };
    });
  },
  
  removeFromQueue: async (businessId, clientId) => {
    // Simulate API call to remove a client from the queue
    return simulateApiCall(() => ({ success: true }));
  },
  
  startService: async (businessId, clientId) => {
    // Simulate API call to start service for a client
    return simulateApiCall(() => ({ success: true }));
  },
  
  completeService: async (businessId, clientId) => {
    // Simulate API call to complete service for a client
    return simulateApiCall(() => ({ success: true }));
  },
  
  joinQueue: async (businessId, clientData) => {
    // Simulate API call for a client to join a queue
    return simulateApiCall(() => {
      return {
        success: true,
        ticketId: `TICKET-${Date.now()}`,
        queueNumber: Math.floor(Math.random() * 10) + 1,
        estimatedWaitTime: Math.floor(Math.random() * 30) + 15,
        timestamp: new Date().toISOString()
      };
    });
  },
  
  checkQueuePosition: async (ticketId) => {
    // Simulate API call to check position in queue
    return simulateApiCall(() => {
      return {
        position: Math.floor(Math.random() * 5) + 1,
        estimatedWaitTime: Math.floor(Math.random() * 20) + 5,
        businessName: "Salon QueueUp",
        serviceName: "Coupe homme",
        status: "waiting"
      };
    });
  }
};

// Barbershops API
const barbershopsAPI = {
  getNearbyBarbershops: async (location, radius) => {
    // Simulate API call to get nearby barbershops
    return simulateApiCall(() => {
      return [
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
      ];
    });
  },
  
  getBarbershopDetails: async (barbershopId) => {
    // Simulate API call to get details of a barbershop
    return simulateApiCall(() => {
      return {
        id: barbershopId,
        name: "Salon QueueUp",
        address: "123 Avenue des Coiffeurs, 75001 Paris",
        rating: 4.8,
        distance: 0.8,
        waitTime: 15,
        peopleInQueue: 4,
        openNow: true,
        photo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGFpciUyMHNhbG9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
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
      };
    });
  },
  
  getBarbers: async (barbershopId) => {
    // Simulate API call to get barbers of a barbershop
    return simulateApiCall(() => {
      return [
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
      ];
    });
  },
  
  getServices: async (barbershopId) => {
    // Simulate API call to get services of a barbershop
    return simulateApiCall(() => {
      return [
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
      ];
    });
  },
  
  updateBusinessProfile: async (businessId, profileData) => {
    // Simulate API call to update business profile
    return simulateApiCall(() => ({ success: true }));
  }
};

// Helper functions
function getServiceWaitTime(service) {
  const times = {
    'Coupe homme': 15,
    'Coupe femme': 30,
    'Barbe': 20,
    'Coloration': 45,
    'Coupe + Barbe': 35
  };
  
  return times[service] || 20;
}

async function simulateApiCall(callback, delay = 800) {
  await new Promise(resolve => setTimeout(resolve, delay));
  try {
    return callback();
  } catch (error) {
    throw error;
  }
}

// Export all API services
export const api = {
  // Direct access to raw API request helper
  request: apiRequest,
  
  // Organized API services
  auth: authAPI,
  queues: queuesAPI,
  barbershops: barbershopsAPI
};

export default api;