<template>
    <div class="queue-management">
      <div class="queue-header">
        <h1>File d'attente</h1>
        <div class="queue-actions">
          <button class="btn btn-primary" @click="showAddClientModal = true">
            <span class="icon">+</span> Ajouter un client
          </button>
          
          <button class="btn btn-success" @click="optimizeQueue">
            <span class="icon">✓</span> Optimiser la file d'attente
          </button>
        </div>
      </div>
      
      <div class="queue-stats">
        <div class="stat-pill">
          <span class="label">En attente:</span>
          <span class="value">{{ queueList.length }}</span>
        </div>
        <div class="stat-pill">
          <span class="label">Temps d'attente estimé:</span>
          <span class="value">{{ estimatedWaitTime }} min</span>
        </div>
        <div class="stat-pill">
          <span class="label">Clients servis aujourd'hui:</span>
          <span class="value">{{ clientsServedToday }}</span>
        </div>
      </div>
      
      <div class="queue-container">
        <div class="queue-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'waiting' }"
            @click="activeTab = 'waiting'"
          >
            En attente ({{ queueList.length }})
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'in-service' }"
            @click="activeTab = 'in-service'"
          >
            En service ({{ inServiceList.length }})
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'completed' }"
            @click="activeTab = 'completed'"
          >
            Terminés ({{ completedList.length }})
          </button>
        </div>
        
        <div class="queue-content">
          <!-- Waiting List -->
          <div v-if="activeTab === 'waiting'" class="queue-list">
            <div class="queue-list-header">
              <div class="col-position">#</div>
              <div class="col-client">Client</div>
              <div class="col-service">Service</div>
              <div class="col-time">Temps d'attente</div>
              <div class="col-barber">Coiffeur assigné</div>
              <div class="col-actions">Actions</div>
            </div>
            
            <div 
              v-for="(client, index) in queueList" 
              :key="client.id" 
              class="queue-item"
              :class="{ 'high-wait': client.waitTime > 30, 'priority-client': client.priority === 'high' }"
            >
              <div class="col-position">
                <div class="position-controls">
                  <button 
                    class="position-btn" 
                    @click="moveClientUp(index)" 
                    :disabled="index === 0"
                    aria-label="Déplacer vers le haut"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 7L18 13H6L12 7Z" fill="currentColor"/>
                    </svg>
                  </button>
                  <span class="position-number">{{ index + 1 }}</span>
                  <button 
                    class="position-btn" 
                    @click="moveClientDown(index)" 
                    :disabled="index === queueList.length - 1"
                    aria-label="Déplacer vers le bas"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17L6 11H18L12 17Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="col-client">
                <div class="client-name">{{ client.name }}</div>
                <div class="client-info">
                  Ajouté à {{ client.addedTime }}
                  <span v-if="client.priority === 'high'" class="priority-badge">Prioritaire</span>
                </div>
                <div v-if="client.notes" class="client-notes">{{ client.notes }}</div>
              </div>
              <div class="col-service">{{ client.service }}</div>
              <div class="col-time" :class="getWaitTimeClass(client.waitTime)">
                {{ client.waitTime }} min
              </div>
              <div class="col-barber">
                <select v-model="client.barber" class="barber-select" @change="updateClientBarber(client.id, client.barber)">
                  <option value="">Non assigné</option>
                  <option v-for="barber in availableBarbers" :key="barber.id" :value="barber.name">
                    {{ barber.name }}
                  </option>
                </select>
              </div>
              <div class="col-actions">
                <button 
                  class="btn btn-sm btn-primary"
                  @click="startService(client.id)"
                  :disabled="!client.barber"
                >
                  Servir
                </button>
                <button 
                  class="btn btn-sm btn-danger"
                  @click="removeFromQueue(client.id)"
                >
                  Retirer
                </button>
              </div>
            </div>
            
            <div v-if="queueList.length === 0" class="empty-list">
              La file d'attente est vide.
            </div>
          </div>
          
          <!-- In Service List -->
          <div v-if="activeTab === 'in-service'" class="queue-list">
            <div class="queue-list-header">
              <div class="col-client">Client</div>
              <div class="col-service">Service</div>
              <div class="col-time">Durée</div>
              <div class="col-barber">Coiffeur</div>
              <div class="col-progress">Progression</div>
              <div class="col-actions">Actions</div>
            </div>
            
            <div 
              v-for="client in inServiceList" 
              :key="client.id" 
              class="queue-item"
            >
              <div class="col-client">
                <div class="client-name">{{ client.name }}</div>
                <div class="client-info">Début: {{ client.startTime }}</div>
              </div>
              <div class="col-service">{{ client.service }}</div>
              <div class="col-time">{{ client.duration }} min</div>
              <div class="col-barber">{{ client.barber }}</div>
              <div class="col-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: getProgressPercentage(client) + '%' }"></div>
                </div>
                <div class="progress-text">{{ getProgressPercentage(client) }}%</div>
              </div>
              <div class="col-actions">
                <button 
                  class="btn btn-sm btn-success"
                  @click="completeService(client.id)"
                >
                  Terminer
                </button>
              </div>
            </div>
            
            <div v-if="inServiceList.length === 0" class="empty-list">
              Aucun client en cours de service.
            </div>
          </div>
          
          <!-- Completed List -->
          <div v-if="activeTab === 'completed'" class="queue-list">
            <div class="queue-list-header">
              <div class="col-client">Client</div>
              <div class="col-service">Service</div>
              <div class="col-time">Durée totale</div>
              <div class="col-barber">Coiffeur</div>
              <div class="col-actions">Actions</div>
            </div>
            
            <div 
              v-for="client in completedList" 
              :key="client.id" 
              class="queue-item"
            >
              <div class="col-client">
                <div class="client-name">{{ client.name }}</div>
                <div class="client-info">Terminé à {{ client.endTime }}</div>
              </div>
              <div class="col-service">{{ client.service }}</div>
              <div class="col-time">{{ client.totalTime }} min</div>
              <div class="col-barber">{{ client.barber }}</div>
              <div class="col-actions">
                <button 
                  class="btn btn-sm btn-outline"
                  @click="archiveClient(client.id)"
                >
                  Archiver
                </button>
              </div>
            </div>
            
            <div v-if="completedList.length === 0" class="empty-list">
              Aucun service terminé aujourd'hui.
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add Client Modal -->
      <div v-if="showAddClientModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Ajouter un client</h2>
            <button class="close-btn" @click="showAddClientModal = false">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label>Nom du client</label>
              <input 
                type="text" 
                v-model="newClient.name" 
                placeholder="Nom du client"
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label>Service souhaité</label>
              <select v-model="newClient.service" class="form-control">
                <option value="">Sélectionnez un service</option>
                <option value="Coupe homme">Coupe homme (15 min)</option>
                <option value="Coupe femme">Coupe femme (30 min)</option>
                <option value="Barbe">Barbe (20 min)</option>
                <option value="Coloration">Coloration (45 min)</option>
                <option value="Coupe + Barbe">Coupe + Barbe (35 min)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Préférence de coiffeur</label>
              <select v-model="newClient.barber" class="form-control">
                <option value="">Aucune préférence</option>
                <option v-for="barber in availableBarbers" :key="barber.id" :value="barber.name">
                  {{ barber.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Priorité</label>
              <div class="radio-group">
                <label class="radio">
                  <input type="radio" v-model="newClient.priority" value="normal">
                  Normale
                </label>
                <label class="radio">
                  <input type="radio" v-model="newClient.priority" value="high">
                  Prioritaire
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label>Notes</label>
              <textarea 
                v-model="newClient.notes" 
                placeholder="Notes additionnelles"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn" @click="showAddClientModal = false">Annuler</button>
            <button 
              class="btn btn-primary" 
              @click="addToQueue"
              :disabled="!newClient.name || !newClient.service"
            >
              Ajouter à la file d'attente
            </button>
          </div>
        </div>
      </div>
      
      <!-- Optimization Modal -->
      <div v-if="showOptimizationModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Optimisation de la file d'attente</h2>
            <button class="close-btn" @click="showOptimizationModal = false">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="optimization-info">
              <p>Notre algorithme d'IA a analysé votre file d'attente actuelle et suggère les ajustements suivants:</p>
              
              <ul class="optimization-changes">
                <li v-for="(change, index) in optimizationChanges" :key="index">
                  <span class="icon">✓</span> {{ change }}
                </li>
              </ul>
              
              <div class="optimization-stats">
                <div class="stat">
                  <span class="label">Temps d'attente actuel:</span>
                  <span class="value">{{ currentWaitTime }} min</span>
                </div>
                <div class="stat">
                  <span class="label">Temps d'attente optimisé:</span>
                  <span class="value improved">{{ optimizedWaitTime }} min</span>
                </div>
                <div class="stat">
                  <span class="label">Amélioration:</span>
                  <span class="value improved">{{ waitTimeImprovement }}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn" @click="showOptimizationModal = false">Annuler</button>
            <button class="btn btn-success" @click="applyOptimization">
              Appliquer les changements
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QueueView',
    data() {
      return {
        activeTab: 'waiting',
        showAddClientModal: false,
        showOptimizationModal: false,
        
        availableBarbers: [
          { id: 1, name: 'Antoine', specialties: ['Coupe homme', 'Barbe'] },
          { id: 2, name: 'Sophie', specialties: ['Coupe femme', 'Coloration'] },
          { id: 3, name: 'Lucas', specialties: ['Barbe', 'Coupe homme'] },
          { id: 4, name: 'Julie', specialties: ['Coupe femme', 'Coloration'] }
        ],
        
        queueList: [
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
        
        newClient: {
          name: '',
          service: '',
          barber: '',
          priority: 'normal',
          notes: ''
        },
        
        // Optimization-related data
        optimizationChanges: [
          "Assignation de Marie Martin à Julie au lieu de Sophie",
          "Priorisation de Emma Petit (client fidèle)",
          "Ré-ordonnancement des clients pour minimiser les temps d'attente"
        ],
        currentWaitTime: 28,
        optimizedWaitTime: 22,
        waitTimeImprovement: 21,
        
        estimatedWaitTime: 25,
        clientsServedToday: 8,
        
        // Timer for progress updates
        progressTimer: null
      }
    },
    methods: {
      // New methods for position changing
      moveClientUp(index) {
        if (index === 0) return; // Already at the top
        
        // Swap positions - Vue 3 compatible
        const temp = this.queueList[index];
        this.queueList[index] = this.queueList[index - 1];
        this.queueList[index - 1] = temp;
        
        // Recalculate wait times
        this.calculateEstimatedWaitTime();
      },
      
      moveClientDown(index) {
        if (index === this.queueList.length - 1) return; // Already at the bottom
        
        // Swap positions - Vue 3 compatible
        const temp = this.queueList[index];
        this.queueList[index] = this.queueList[index + 1];
        this.queueList[index + 1] = temp;
        
        // Recalculate wait times
        this.calculateEstimatedWaitTime();
      },
      
      updateClientBarber(clientId, barberName) {
        console.log(`Client ${clientId} assigned to ${barberName}`);
        // Here you would typically update this in your backend
      },
      
      addToQueue() {
        if (!this.newClient.name || !this.newClient.service) return;
        
        const now = new Date();
        const formattedTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const id = Math.max(...this.queueList.map(c => c.id), 0) + 1;
        
        this.queueList.push({
          id,
          name: this.newClient.name,
          service: this.newClient.service,
          waitTime: this.getServiceWaitTime(this.newClient.service),
          barber: this.newClient.barber,
          addedTime: formattedTime,
          priority: this.newClient.priority,
          notes: this.newClient.notes
        });
        
        // Reset form and close modal
        this.newClient = {
          name: '',
          service: '',
          barber: '',
          priority: 'normal',
          notes: ''
        };
        this.showAddClientModal = false;
        
        // Update estimated wait time
        this.calculateEstimatedWaitTime();
      },
      
      removeFromQueue(id) {
        this.queueList = this.queueList.filter(client => client.id !== id);
        this.calculateEstimatedWaitTime();
      },
      
      startService(id) {
        const clientIndex = this.queueList.findIndex(client => client.id === id);
        if (clientIndex === -1) return;
        
        const client = this.queueList[clientIndex];
        const now = new Date();
        const formattedTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        const serviceTime = this.getServiceWaitTime(client.service);
        
        // Move to in-service list
        this.inServiceList.push({
          id: client.id,
          name: client.name,
          service: client.service,
          startTime: formattedTime,
          duration: 0,
          serviceTime: serviceTime, // Total expected service time
          barber: client.barber,
          startTimestamp: Date.now() // Current timestamp
        });
        
        // Remove from queue
        this.queueList.splice(clientIndex, 1);
        this.calculateEstimatedWaitTime();
      },
      
      completeService(id) {
        const clientIndex = this.inServiceList.findIndex(client => client.id === id);
        if (clientIndex === -1) return;
        
        const client = this.inServiceList[clientIndex];
        const now = new Date();
        const formattedTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // Calculate elapsed time since service started
        const elapsedMinutes = Math.round((Date.now() - client.startTimestamp) / (1000 * 60));
        
        // Move to completed list
        this.completedList.unshift({
          id: client.id,
          name: client.name,
          service: client.service,
          endTime: formattedTime,
          totalTime: elapsedMinutes,
          barber: client.barber
        });
        
        // Remove from in-service
        this.inServiceList.splice(clientIndex, 1);
        
        // Increment clients served counter
        this.clientsServedToday++;
      },
      
      archiveClient(id) {
        this.completedList = this.completedList.filter(client => client.id !== id);
      },
      
      getServiceWaitTime(service) {
        const times = {
          'Coupe homme': 15,
          'Coupe femme': 30,
          'Barbe': 20,
          'Coloration': 45,
          'Coupe + Barbe': 35
        };
        
        return times[service] || 20;
      },
      
      getWaitTimeClass(time) {
        if (time >= 40) return 'critical';
        if (time >= 25) return 'warning';
        return 'normal';
      },
      
      calculateEstimatedWaitTime() {
        // Simple calculation: average of all wait times
        if (this.queueList.length === 0) {
          this.estimatedWaitTime = 0;
          return;
        }
        
        const total = this.queueList.reduce((sum, client) => sum + client.waitTime, 0);
        this.estimatedWaitTime = Math.round(total / this.queueList.length);
      },
      
      optimizeQueue() {
        // Show optimization modal
        this.showOptimizationModal = true;
        
        // In a real app, this would call an API or run an algorithm
      },
      
      applyOptimization() {
        // This would apply the AI-suggested changes
        // For now, let's just simulate some changes
        
        // Reassign a client
        const marieIndex = this.queueList.findIndex(client => client.name === 'Marie Martin');
        if (marieIndex !== -1) {
          this.queueList[marieIndex].barber = 'Julie';
        }
        
        // Move high priority client to the front
        const emmaIndex = this.queueList.findIndex(client => client.name === 'Emma Petit');
        if (emmaIndex !== -1 && emmaIndex > 0) {
          const emma = this.queueList.splice(emmaIndex, 1)[0];
          this.queueList.splice(1, 0, emma); // Insert after first client
        }
        
        // Update estimated wait time
        this.estimatedWaitTime = this.optimizedWaitTime;
        
        // Close the modal
        this.showOptimizationModal = false;
      },
      
      // Progress methods for in-service clients
      getProgressPercentage(client) {
        if (!client.startTimestamp || !client.serviceTime) return 0;
        
        const elapsedMinutes = (Date.now() - client.startTimestamp) / (1000 * 60);
        const percentage = Math.min(Math.round((elapsedMinutes / client.serviceTime) * 100), 100);
        return percentage;
      },
      
      updateProgress() {
        // Update duration for all in-service clients
        this.inServiceList.forEach(client => {
          if (client.startTimestamp) {
            client.duration = Math.round((Date.now() - client.startTimestamp) / (1000 * 60));
          }
        });
      }
    },
    mounted() {
      this.calculateEstimatedWaitTime();
      
      // Set up a timer to update progress
      this.progressTimer = setInterval(() => {
        this.updateProgress();
      }, 30000); // Update every 30 seconds
    },
    beforeUnmount() {
      // Clear the timer when component is destroyed
      if (this.progressTimer) {
        clearInterval(this.progressTimer);
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .queue-management {
    width: 100%;
  }
  
  .queue-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h1 {
      margin: 0;
      font-weight: 500;
    }
  }
  
  .queue-actions {
    display: flex;
    gap: 10px;
    
    .btn {
      display: flex;
      align-items: center;
      gap: 5px;
      
      .icon {
        font-size: 1.2rem;
        font-weight: bold;
      }
    }
  }
  
  .queue-stats {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    
    .stat-pill {
      background-color: #f5f5f7;
      border-radius: 20px;
      padding: 8px 15px;
      display: flex;
      align-items: center;
      
      .label {
        color: #6c757d;
        margin-right: 8px;
      }
      
      .value {
        font-weight: 600;
        color: #2c3e50;
      }
    }
  }
  
  .queue-container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    overflow: hidden;
  }
  
  .queue-tabs {
    display: flex;
    border-bottom: 1px solid #e9ecef;
    
    .tab-btn {
      padding: 12px 20px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      font-weight: 500;
      color: #6c757d;
      cursor: pointer;
      
      &.active {
        color: #0066ff;
        border-bottom-color: #0066ff;
      }
      
      &:hover {
        background-color: #f8f9fa;
      }
    }
  }
  
  .queue-content {
    padding: 20px;
  }
  
  .queue-list {
    width: 100%;
    
    &-header {
      display: grid;
      grid-template-columns: 40px 1.5fr 1fr 1fr 1fr 1fr;
      padding: 10px 15px;
      background-color: #f5f5f7;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.9rem;
      margin-bottom: 12px;
      letter-spacing: 0.3px;
    }
  }
  
  .queue-item {
    display: grid;
    grid-template-columns: 40px 1.5fr 1fr 1fr 1fr 1fr;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 12px;
    border: none;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
    align-items: center;
    background-color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.08);
    }
    
    &.high-wait {
      border-left: 3px solid #ff3b30;
    }
    
    &.priority-client {
      border-left: 3px solid #ffcc00;
      background-color: rgba(255, 204, 0, 0.05);
    }
    
    .client-name {
      font-weight: 500;
    }
    
    .client-info {
      font-size: 0.85rem;
      color: #6c757d;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .priority-badge {
      background-color: #ffcc00;
      color: #212529;
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 10px;
      font-weight: 600;
    }
    
    .client-notes {
      font-size: 0.85rem;
      color: #6c757d;
      margin-top: 4px;
      font-style: italic;
    }
    
    .col-time {
    font-weight: 500;
    
    &.normal {
      color: #2c3e50;
    }
    
    &.warning {
      color: #ff9500;
    }
    
    &.critical {
      color: #ff3b30;
    }
  }
  
  .col-actions {
    display: flex;
    gap: 8px;
  }
}

/* Styles for position controls */
.position-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.position-btn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #f0f0f0;
  color: #666;
  padding: 0;
  margin: 2px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #0066ff;
    color: white;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.25);
  }
}

.position-number {
  font-weight: 600;
  margin: 3px 0;
}

.empty-list {
  border-radius: 10px;
  padding: 40px;
  background-color: #f5f5f7;
  text-align: center;
  color: #888;
  font-weight: 500;
}

.barber-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 140px;
  
  &:focus {
    border-color: #0066ff;
    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.25);
    outline: none;
  }
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 8px 12px;
  border: none;
  
  &-sm {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
  
  &-primary {
    background-color: #0066ff;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #0055d6;
      transform: translateY(-1px);
    }
  }
  
  &-danger {
    background-color: #ff3b30;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #e0352b;
      transform: translateY(-1px);
    }
  }
  
  &-success {
    background-color: #34c759;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #2db84d;
      transform: translateY(-1px);
    }
  }
  
  &-outline {
    background-color: transparent;
    border: 1px solid #8e8e93;
    color: #8e8e93;
    
    &:hover {
      background-color: #f5f5f7;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  backdrop-filter: blur(5px);
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
  
  h2 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 500;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #8e8e93;
  }
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
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .form-control {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 8px;
    
    &:focus {
      outline: none;
      border-color: #0066ff;
      box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.25);
    }
  }
  
  .radio-group {
    display: flex;
    gap: 15px;
  }
  
  .radio {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    
    input {
      cursor: pointer;
    }
  }
}

.optimization-info {
  p {
    margin-bottom: 15px;
  }
}

.optimization-changes {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  
  li {
    padding: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .icon {
      color: #34c759;
    }
  }
}

.optimization-stats {
  background-color: #f5f5f7;
  border-radius: 10px;
  padding: 15px;
  
  .stat {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e9ecef;
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: #6c757d;
    }
    
    .value {
      font-weight: 600;
      
      &.improved {
        color: #34c759;
      }
    }
  }
}

// Progress bar for in-service clients
.col-progress {
  display: flex;
  flex-direction: column;
  gap: 5px;
  
  .progress-bar-container {
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
  }
  
  .progress-bar {
    height: 100%;
    background-color: #0066ff;
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 0.8rem;
    color: #6c757d;
    text-align: right;
  }
}

// Responsive adjustments
@media (max-width: 1024px) {
  .queue-list-header, .queue-item {
    grid-template-columns: 40px 1.5fr 1fr 1fr 1fr;
    
    .col-actions {
      grid-column: 1 / -1;
      margin-top: 10px;
      justify-content: flex-end;
    }
  }
  
  .queue-item {
    padding-bottom: 20px;
  }
  
  .queue-stats {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .queue-list-header, .queue-item {
    grid-template-columns: 40px 1fr 1fr;
    
    .col-service, .col-barber, .col-actions {
      grid-column: 1 / -1;
      margin-top: 8px;
    }
    
    .col-service::before {
      content: 'Service: ';
      color: #6c757d;
      font-weight: normal;
    }
    
    .col-barber::before {
      content: 'Coiffeur: ';
      color: #6c757d;
      font-weight: normal;
    }
  }
  
  .queue-list-header {
    .col-service, .col-barber {
      display: none;
    }
  }
  
  .queue-item {
    padding: 15px 10px;
  }
}
</style>