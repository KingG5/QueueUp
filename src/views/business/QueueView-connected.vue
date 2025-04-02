<template>
    <div class="queue-management">
      <div class="queue-header">
        <h1>Queue Management</h1>
        <div class="queue-actions">
          <button class="btn btn-primary" @click="showAddClientModal = true">
            <span class="icon">+</span> Add Client
          </button>
          
          <button class="btn btn-success" @click="showOptimizationModal = true">
            <span class="icon">✓</span> Optimize Queue
          </button>
        </div>
      </div>
      
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading queue data...</div>
      </div>
      
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ error }}</div>
        <button class="btn retry-btn" @click="fetchQueueData">Retry</button>
      </div>
      
      <div v-else>
        <div class="queue-stats">
          <div class="stat-pill">
            <span class="label">Waiting:</span>
            <span class="value">{{ waitingClients.length }}</span>
          </div>
          <div class="stat-pill">
            <span class="label">Estimated wait time:</span>
            <span class="value">{{ estimatedWaitTime }} min</span>
          </div>
          <div class="stat-pill">
            <span class="label">Clients served today:</span>
            <span class="value">{{ clientsServedToday }}</span>
          </div>
        </div>
        
        <!-- Use our QueueManager component to handle the queue UI -->
        <QueueManager 
          :business-id="businessId"
          :available-barbers="barbers"
          @add-client="showAddClientModal = true"
          @optimize="showOptimizationModal = true"
        />
      </div>
      
      <!-- Add Client Modal -->
      <div v-if="showAddClientModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Add Client</h2>
            <button class="close-btn" @click="showAddClientModal = false">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label>Client Name</label>
              <input 
                type="text" 
                v-model="newClient.name" 
                placeholder="Client name"
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label>Service</label>
              <select v-model="newClient.service" class="form-control">
                <option value="">Select a service</option>
                <option 
                  v-for="service in services" 
                  :key="service.id" 
                  :value="service.name"
                >
                  {{ service.name }} ({{ service.duration }} min)
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Preferred Barber</label>
              <select v-model="newClient.barber" class="form-control">
                <option value="">No preference</option>
                <option 
                  v-for="barber in activeBarbers" 
                  :key="barber.id" 
                  :value="barber.name"
                >
                  {{ barber.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Priority</label>
              <div class="radio-group">
                <label class="radio">
                  <input type="radio" v-model="newClient.priority" value="normal">
                  Normal
                </label>
                <label class="radio">
                  <input type="radio" v-model="newClient.priority" value="high">
                  Priority
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label>Notes</label>
              <textarea 
                v-model="newClient.notes" 
                placeholder="Additional notes"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn" @click="showAddClientModal = false">Cancel</button>
            <button 
              class="btn btn-primary" 
              @click="addToQueue"
              :disabled="!newClient.name || !newClient.service || isAddingClient"
            >
              <span v-if="isAddingClient" class="spinner"></span>
              <span v-else>Add to Queue</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Optimization Modal -->
      <div v-if="showOptimizationModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Queue Optimization</h2>
            <button class="close-btn" @click="showOptimizationModal = false">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="optimization-info">
              <p>Our AI algorithm has analyzed your current queue and suggests the following adjustments:</p>
              
              <ul class="optimization-changes">
                <li v-for="(change, index) in optimizationChanges" :key="index">
                  <span class="icon">✓</span> {{ change }}
                </li>
              </ul>
              
              <div class="optimization-stats">
                <div class="stat">
                  <span class="label">Current wait time:</span>
                  <span class="value">{{ currentWaitTime }} min</span>
                </div>
                <div class="stat">
                  <span class="label">Optimized wait time:</span>
                  <span class="value improved">{{ optimizedWaitTime }} min</span>
                </div>
                <div class="stat">
                  <span class="label">Improvement:</span>
                  <span class="value improved">{{ waitTimeImprovement }}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn" @click="showOptimizationModal = false">Cancel</button>
            <button 
              class="btn btn-success" 
              @click="applyOptimization"
              :disabled="isOptimizing"
            >
              <span v-if="isOptimizing" class="spinner"></span>
              <span v-else>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { useQueueStore } from '@/stores/queues'
  import { useBarbershopStore } from '@/stores/barbershops'
  import QueueManager from '@/components/business/QueueManager.vue'
  
  export default {
    name: 'QueueView',
    components: {
      QueueManager
    },
    
    setup() {
      const queueStore = useQueueStore()
      const barbershopStore = useBarbershopStore()
      
      // State
      const businessId = ref(1) // In a real app, this would come from auth store
      const showAddClientModal = ref(false)
      const showOptimizationModal = ref(false)
      const isAddingClient = ref(false)
      const isOptimizing = ref(false)
      
      // Form data
      const newClient = ref({
        name: '',
        service: '',
        barber: '',
        priority: 'normal',
        notes: ''
      })
      
      // Optimization data
      const optimizationChanges = ref([
        "Assign Marie Martin to Julie instead of Sophie",
        "Prioritize Emma Petit (loyal customer)",
        "Reorder clients to minimize wait times"
      ])
      const currentWaitTime = ref(28)
      const optimizedWaitTime = ref(22)
      const waitTimeImprovement = ref(21)
      
      // Computed properties
      const isLoading = computed(() => queueStore.isLoading)
      const error = computed(() => queueStore.error)
      const waitingClients = computed(() => queueStore.waitingClients)
      const estimatedWaitTime = computed(() => queueStore.estimatedWaitTime)
      const clientsServedToday = computed(() => queueStore.clientsServed)
      const barbers = computed(() => barbershopStore.getBarbershopBarbers)
      const activeBarbers = computed(() => barbers.value.filter(b => b.isActive))
      const services = computed(() => barbershopStore.getBarbershopServices)
      
      // Methods
      const fetchQueueData = async () => {
        try {
          // Fetch queue data
          await queueStore.fetchQueue(businessId.value)
          
          // Fetch barbers and services if not already loaded
          if (barbers.value.length === 0) {
            await barbershopStore.fetchBarbers(businessId.value)
          }
          
          if (services.value.length === 0) {
            await barbershopStore.fetchServices(businessId.value)
          }
        } catch (error) {
          console.error('Error fetching queue data:', error)
        }
      }
      
      const addToQueue = async () => {
        if (!newClient.value.name || !newClient.value.service) return
        
        try {
          isAddingClient.value = true
          
          // Add client to queue
          await queueStore.addToQueue(businessId.value, newClient.value)
          
          // Reset form and close modal
          resetClientForm()
          showAddClientModal.value = false
        } catch (error) {
          console.error('Error adding client to queue:', error)
        } finally {
          isAddingClient.value = false
        }
      }
      
      const resetClientForm = () => {
        newClient.value = {
          name: '',
          service: '',
          barber: '',
          priority: 'normal',
          notes: ''
        }
      }
      
      const applyOptimization = async () => {
        try {
          isOptimizing.value = true
          
          // In a real app, this would call an API to optimize the queue
          // For now, we'll simulate an API call with a delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Simulate optimization changes
          // Update Marie Martin's barber
          const marieIndex = waitingClients.value.findIndex(client => client.name === 'Marie Martin')
          if (marieIndex !== -1) {
            // In a real app, you would update this in the store with an action
            console.log('Reassigning Marie Martin to Julie')
          }
          
          // Prioritize Emma Petit
          const emmaIndex = waitingClients.value.findIndex(client => client.name === 'Emma Petit')
          if (emmaIndex !== -1) {
            console.log('Prioritizing Emma Petit')
          }
          
          // Close the modal
          showOptimizationModal.value = false
        } catch (error) {
          console.error('Error applying optimization:', error)
        } finally {
          isOptimizing.value = false
        }
      }
      
      // Load queue data on component mount
      onMounted(() => {
        fetchQueueData()
      })
      
      return {
        businessId,
        isLoading,
        error,
        waitingClients,
        estimatedWaitTime,
        clientsServedToday,
        barbers,
        activeBarbers,
        services,
        showAddClientModal,
        showOptimizationModal,
        newClient,
        isAddingClient,
        isOptimizing,
        optimizationChanges,
        currentWaitTime,
        optimizedWaitTime,
        waitTimeImprovement,
        fetchQueueData,
        addToQueue,
        applyOptimization
      }
    }
  }
  </script>
  
  <style scoped>
  .queue-management {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 20px;
  }
  
  .queue-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .queue-header h1 {
    margin: 0;
    font-weight: 600;
    font-size: 24px;
  }
  
  .queue-actions {
    display: flex;
    gap: 10px;
  }
  
  .queue-actions .btn {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .queue-actions .icon {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .queue-stats {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  
  .stat-pill {
    background-color: #f5f5f7;
    border-radius: 20px;
    padding: 8px 15px;
    display: flex;
    align-items: center;
  }
  
  .stat-pill .label {
    color: #6c757d;
    margin-right: 8px;
  }
  
  .stat-pill .value {
    font-weight: 600;
    color: #2c3e50;
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
  
  .retry-btn {
    background-color: #0066ff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
  }
  
  /* Modal styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 12px;
    width: 500px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-header {
    padding: 15px 20px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.4rem;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }
  
  .form-control {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 16px;
    transition: all 0.2s ease;
  }
  
  .form-control:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
  }
  
  .radio-group {
    display: flex;
    gap: 20px;
  }
  
  .radio {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
  
  .btn {
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn-primary {
    background-color: #0066ff;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background-color: #0055d6;
    transform: translateY(-1px);
  }
  
  .btn-success {
    background-color: #34c759;
    color: white;
  }
  
  .btn-success:hover:not(:disabled) {
    background-color: #2db84d;
    transform: translateY(-1px);
  }
  
  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .optimization-info p {
    margin-bottom: 15px;
  }
  
  .optimization-changes {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
  }
  
  .optimization-changes li {
    padding: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .optimization-changes .icon {
    color: #34c759;
  }
  
  .optimization-stats {
    background-color: #f5f5f7;
    border-radius: 10px;
    padding: 15px;
  }
  
  .optimization-stats .stat {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e9ecef;
  }
  
  .optimization-stats .stat:last-child {
    border-bottom: none;
  }
  
  .optimization-stats .label {
    color: #6c757d;
  }
  
  .optimization-stats .value {
    font-weight: 600;
  }
  
  .optimization-stats .value.improved {
    color: #34c759;
  }
  
  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .queue-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    .queue-actions {
      width: 100%;
    }
    
    .queue-actions .btn {
      flex: 1;
    }
    
    .radio-group {
      flex-direction: column;
      gap: 10px;
    }
  }
  </style>