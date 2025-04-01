<template>
    <div class="queue-status">
      <div v-if="loading" class="loading">
        Loading queue information...
      </div>
      
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-else-if="!queueData" class="not-in-queue">
        <h2>You're not in any queue</h2>
        <p>Join a virtual queue to avoid waiting at the barbershop.</p>
        <router-link to="/join-queue" class="btn btn-primary">Join a Queue</router-link>
      </div>
      
      <div v-else class="queue-details">
        <h2>Your Queue Status</h2>
        
        <div class="status-card">
          <div class="status-header" :class="getStatusClass(queueData.status)">
            <span class="status-indicator"></span>
            <span class="status-text">{{ getStatusText(queueData.status) }}</span>
          </div>
          
          <div class="shop-info">
            <h3>{{ barbershopName }}</h3>
            <p v-if="barberName">Barber: {{ barberName }}</p>
            <p>Service: {{ getServiceName(queueData.service) }}</p>
          </div>
          
          <div class="queue-info">
            <div class="info-row">
              <span class="info-label">Position in queue:</span>
              <span class="info-value">{{ position }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Estimated wait:</span>
              <span class="info-value">{{ waitTime }} minutes</span>
            </div>
            <div class="info-row">
              <span class="info-label">Expected service time:</span>
              <span class="info-value">{{ expectedTime }}</span>
            </div>
          </div>
          
          <div class="queue-actions">
            <button v-if="queueData.status === 'waiting'" class="btn btn-danger" @click="leaveQueue">
              Leave Queue
            </button>
            <button v-if="queueData.status === 'ready'" class="btn btn-success" @click="confirmArrival">
              I've Arrived
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from '@/firebase/config';
  import firebase from 'firebase/app';
  
  export default {
    name: 'QueueStatus',
    data() {
      return {
        queueData: null,
        barbershopName: '',
        barberName: '',
        position: 0,
        waitTime: 0,
        loading: true,
        error: null,
        unsubscribe: null
      }
    },
    computed: {
      expectedTime() {
        if (!this.queueData) return '';
        
        const now = new Date();
        const waitMillis = this.waitTime * 60 * 1000;
        const expected = new Date(now.getTime() + waitMillis);
        
        // Format time as HH:MM AM/PM
        return expected.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    },
    async created() {
      await this.loadQueueData();
    },
    beforeUnmount() {
      // Clean up the listener when component is destroyed
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    },
    methods: {
      async loadQueueData() {
        this.loading = true;
        
        try {
          const user = firebase.auth().currentUser;
          if (!user) {
            this.loading = false;
            return;
          }
          
          // Set up a real-time listener for queue changes
          this.unsubscribe = db.collection('queues')
            .where('clientId', '==', user.uid)
            .where('status', 'in', ['waiting', 'ready', 'serving'])
            .onSnapshot(async (snapshot) => {
              if (snapshot.empty) {
                this.queueData = null;
                this.loading = false;
                return;
              }
              
              // Get the first active queue entry
              let queueDoc = null;
              snapshot.forEach(doc => {
                queueDoc = {
                  id: doc.id,
                  ...doc.data()
                };
              });
              
              if (queueDoc) {
                this.queueData = queueDoc;
                
                // Load barbershop info
                const shopDoc = await db.collection('barbershops').doc(queueDoc.barbershopId).get();
                if (shopDoc.exists) {
                  this.barbershopName = shopDoc.data().name;
                }
                
                // Load barber info if selected
                if (queueDoc.barberId) {
                  const barberDoc = await db.collection('barbers').doc(queueDoc.barberId).get();
                  if (barberDoc.exists) {
                    this.barberName = barberDoc.data().name;
                  }
                } else {
                  this.barberName = 'Any available barber';
                }
                
                // Calculate position and wait time
                await this.calculatePosition();
              }
              
              this.loading = false;
            }, error => {
              this.error = "Error loading queue status: " + error.message;
              this.loading = false;
            });
        } catch (error) {
          this.error = "Failed to load queue data: " + error.message;
          this.loading = false;
        }
      },
      
      async calculatePosition() {
        if (!this.queueData) return;
        
        try {
          // Count how many people are ahead in the queue
          const snapshot = await db.collection('queues')
            .where('barbershopId', '==', this.queueData.barbershopId)
            .where('status', '==', 'waiting')
            .where('joinedAt', '<', this.queueData.joinedAt)
            .get();
            
          this.position = snapshot.size + 1;
          
          // Calculate wait time based on position and service times
          // For simplicity, estimate 20 minutes per person
          this.waitTime = this.position * 20;
          
          // If status is "ready", wait time is 0
          if (this.queueData.status === 'ready') {
            this.waitTime = 0;
          }
        } catch (error) {
          console.error("Error calculating position:", error);
        }
      },
      
      getStatusClass(status) {
        switch(status) {
          case 'waiting': return 'status-waiting';
          case 'ready': return 'status-ready';
          case 'serving': return 'status-serving';
          case 'completed': return 'status-completed';
          default: return '';
        }
      },
      
      getStatusText(status) {
        switch(status) {
          case 'waiting': return 'Waiting in queue';
          case 'ready': return 'Ready - Please arrive now!';
          case 'serving': return 'Currently being served';
          case 'completed': return 'Service completed';
          default: return status;
        }
      },
      
      getServiceName(serviceCode) {
        switch(serviceCode) {
          case 'haircut': return 'Haircut';
          case 'beard-trim': return 'Beard Trim';
          case 'combo': return 'Haircut & Beard Trim';
          case 'styling': return 'Hair Styling';
          default: return serviceCode;
        }
      },
      
      async leaveQueue() {
        if (!confirm('Are you sure you want to leave the queue?')) return;
        
        try {
          await db.collection('queues').doc(this.queueData.id).update({
            status: 'cancelled'
          });
          
          this.queueData = null;
        } catch (error) {
          this.error = "Failed to leave queue: " + error.message;
        }
      },
      
      async confirmArrival() {
        try {
          await db.collection('queues').doc(this.queueData.id).update({
            status: 'arrived'
          });
          
          alert('Thank you for confirming your arrival! The barber will call you shortly.');
        } catch (error) {
          this.error = "Failed to confirm arrival: " + error.message;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .queue-status {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .loading, .not-in-queue {
    text-align: center;
    padding: 40px 0;
  }
  
  .not-in-queue h2 {
    margin-bottom: 16px;
    color: #333;
  }
  
  .not-in-queue p {
    margin-bottom: 24px;
    color: #666;
  }
  
  .status-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .status-header {
    display: flex;
    align-items: center;
    padding: 16px;
    color: white;
  }
  
  .status-waiting {
    background-color: #f59e0b;
  }
  
  .status-ready {
    background-color: #10b981;
  }
  
  .status-serving {
    background-color: #3b82f6;
  }
  
  .status-completed {
    background-color: #6b7280;
  }
  
  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: white;
    margin-right: 10px;
  }
  
  .status-text {
    font-weight: 600;
  }
  
  .shop-info {
    padding: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .shop-info h3 {
    margin: 0 0 10px;
    color: #333;
  }
  
  .shop-info p {
    margin: 5px 0;
    color: #555;
  }
  
  .queue-info {
    padding: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .info-label {
    color: #666;
  }
  
  .info-value {
    font-weight: 600;
    color: #333;
  }
  
  .queue-actions {
    padding: 20px;
    text-align: center;
  }
  
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-primary {
    background-color: #0066ff;
    color: white;
    text-decoration: none;
    display: inline-block;
  }
  
  .btn-danger {
    background-color: #ef4444;
    color: white;
  }
  
  .btn-success {
    background-color: #10b981;
    color: white;
  }
  
  .error-message {
    background-color: #ffeeee;
    color: #cc0000;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 20px;
  }
  </style>