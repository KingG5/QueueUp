<template>
    <div class="client-card" :class="getCardClasses()">
      <!-- Waiting client card -->
      <template v-if="mode === 'waiting'">
        <div class="col-position">
          <div class="position-controls">
            <button 
              class="position-btn" 
              @click="$emit('move-up')" 
              :disabled="position === 1"
              aria-label="Move up"
            >
              <span class="up-icon">↑</span>
            </button>
            <span class="position-number">{{ position }}</span>
            <button 
              class="position-btn" 
              @click="$emit('move-down')" 
              aria-label="Move down"
            >
              <span class="down-icon">↓</span>
            </button>
          </div>
        </div>
        
        <div class="col-client">
          <div class="client-name">{{ client.name }}</div>
          <div class="client-info">
            Added at {{ client.addedTime }}
            <span v-if="client.priority === 'high'" class="priority-badge">Priority</span>
          </div>
          <div v-if="client.notes" class="client-notes">{{ client.notes }}</div>
        </div>
        
        <div class="col-service">{{ client.service }}</div>
        
        <div class="col-time" :class="getWaitTimeClass(client.waitTime)">
          {{ client.waitTime }} min
        </div>
        
        <div class="col-barber">
          <select 
            v-model="selectedBarber" 
            class="barber-select"
            @change="updateBarber"
          >
            <option value="">Not assigned</option>
            <option 
              v-for="barber in availableBarbers" 
              :key="barber.id" 
              :value="barber.id"
              :disabled="!barber.isActive"
            >
              {{ barber.name }} {{ !barber.isActive ? '(Unavailable)' : '' }}
            </option>
          </select>
        </div>
        
        <div class="col-actions">
          <button 
            class="btn btn-sm btn-primary"
            @click="$emit('start-service', client.id)"
            :disabled="!client.barber"
          >
            Serve
          </button>
          <button 
            class="btn btn-sm btn-danger"
            @click="confirmRemove"
          >
            Remove
          </button>
        </div>
      </template>
      
      <!-- In-service client card -->
      <template v-else-if="mode === 'in-service'">
        <div class="col-client">
          <div class="client-name">{{ client.name }}</div>
          <div class="client-info">Started at {{ client.startTime }}</div>
        </div>
        
        <div class="col-service">{{ client.service }}</div>
        
        <div class="col-time">
          {{ client.duration }} min
        </div>
        
        <div class="col-barber">{{ client.barber }}</div>
        
        <div class="col-progress">
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: getProgressPercentage() + '%' }"></div>
          </div>
          <div class="progress-text">{{ getProgressPercentage() }}%</div>
        </div>
        
        <div class="col-actions">
          <button 
            class="btn btn-sm btn-success"
            @click="$emit('complete-service', client.id)"
          >
            Complete
          </button>
        </div>
      </template>
      
      <!-- Completed client card -->
      <template v-else-if="mode === 'completed'">
        <div class="col-client">
          <div class="client-name">{{ client.name }}</div>
          <div class="client-info">Completed at {{ client.endTime }}</div>
        </div>
        
        <div class="col-service">{{ client.service }}</div>
        
        <div class="col-time">
          {{ client.totalTime }} min
        </div>
        
        <div class="col-barber">{{ client.barber }}</div>
        
        <div class="col-actions">
          <button 
            class="btn btn-sm btn-outline"
            @click="$emit('archive', client.id)"
          >
            Archive
          </button>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  
  export default {
    name: 'ClientCard',
    props: {
      client: {
        type: Object,
        required: true
      },
      position: {
        type: Number,
        default: 0
      },
      availableBarbers: {
        type: Array,
        default: () => []
      },
      mode: {
        type: String,
        default: 'waiting',
        validator: value => ['waiting', 'in-service', 'completed'].includes(value)
      }
    },
    
    emits: [
      'start-service', 
      'complete-service', 
      'remove-from-queue', 
      'update-barber',
      'move-up',
      'move-down',
      'archive'
    ],
    
    setup(props, { emit }) {
      // Initialize selected barber based on client's barber
      const selectedBarber = ref('')
      
      onMounted(() => {
        if (props.client.barber && props.availableBarbers.length > 0) {
          const barber = props.availableBarbers.find(b => b.name === props.client.barber)
          if (barber) {
            selectedBarber.value = barber.id
          }
        }
      })
      
      // Get card classes based on client status
      const getCardClasses = () => {
        const classes = []
        
        if (props.mode === 'waiting') {
          if (props.client.waitTime > 30) {
            classes.push('high-wait')
          }
          
          if (props.client.priority === 'high') {
            classes.push('priority-client')
          }
        }
        
        return classes
      }
      
      // Get class for wait time based on duration
      const getWaitTimeClass = (waitTime) => {
        if (waitTime >= 40) return 'critical'
        if (waitTime >= 25) return 'warning'
        return 'normal'
      }
      
      // Calculate progress percentage for in-service clients
      const getProgressPercentage = () => {
        if (props.mode !== 'in-service' || !props.client.startTimestamp || !props.client.serviceTime) {
          return 0
        }
        
        const elapsedMinutes = (Date.now() - props.client.startTimestamp) / (1000 * 60)
        const percentage = Math.min(Math.round((elapsedMinutes / props.client.serviceTime) * 100), 100)
        
        return percentage
      }
      
      // Update barber assignment
      const updateBarber = () => {
        emit('update-barber', props.client.id, selectedBarber.value)
      }
      
      // Confirm before removing a client from the queue
      const confirmRemove = () => {
        if (confirm(`Are you sure you want to remove ${props.client.name} from the queue?`)) {
          emit('remove-from-queue', props.client.id)
        }
      }
      
      return {
        selectedBarber,
        getCardClasses,
        getWaitTimeClass,
        getProgressPercentage,
        updateBarber,
        confirmRemove
      }
    }
  }
  </script>
  
  <style scoped>
  .client-card {
    display: grid;
    grid-template-columns: 40px 1.5fr 1fr 1fr 1fr 1fr;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 12px;
    border: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    align-items: center;
    background-color: white;
  }
  
  .client-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }
  
  .client-card.high-wait {
    border-left: 3px solid #ff3b30;
  }
  
  .client-card.priority-client {
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
  }
  
  .col-time.normal {
    color: #2c3e50;
  }
  
  .col-time.warning {
    color: #ff9500;
  }
  
  .col-time.critical {
    color: #ff3b30;
  }
  
  .col-actions {
    display: flex;
    gap: 8px;
  }
  
  /* Position controls */
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
  }
  
  .position-btn:hover:not(:disabled) {
    background-color: #0066ff;
    color: white;
  }
  
  .position-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .position-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.25);
  }
  
  .position-number {
    font-weight: 600;
    margin: 3px 0;
  }
  
  /* Barber select dropdown */
  .barber-select {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: white;
    transition: all 0.2s ease;
    width: 100%;
    max-width: 140px;
  }
  
  .barber-select:focus {
    border-color: #0066ff;
    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.25);
    outline: none;
  }
  
  /* Buttons */
  .btn {
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
    border: none;
  }
  
  .btn-sm {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
  
  .btn-primary {
    background-color: #0066ff;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background-color: #0055d6;
    transform: translateY(-1px);
  }
  
  .btn-danger {
    background-color: #ff3b30;
    color: white;
  }
  
  .btn-danger:hover:not(:disabled) {
    background-color: #e0352b;
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
  
  .btn-outline {
    background-color: transparent;
    border: 1px solid #8e8e93;
    color: #8e8e93;
  }
  
  .btn-outline:hover {
    background-color: #f5f5f7;
  }
  
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Progress bar */
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
    margin-top: 4px;
  }
  
  /* Responsive adjustments */
  @media (max-width: 992px) {
    .client-card {
      grid-template-columns: 40px 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr;
    }
    
    .barber-select {
      max-width: 110px;
    }
  }
  
  @media (max-width: 768px) {
    .client-card {
      grid-template-columns: 40px 1.5fr 1fr 1fr 1fr;
      position: relative;
      padding-bottom: 50px;
    }
    
    .col-actions {
      position: absolute;
      bottom: 10px;
      right: 15px;
    }
  }
  
  @media (max-width: 576px) {
    .client-card {
      grid-template-columns: 40px 1fr;
      grid-template-areas:
        "position name"
        "info info"
        "actions actions";
      gap: 10px;
      padding: 15px;
    }
    
    .col-position {
      grid-area: position;
    }
    
    .col-client {
      grid-area: name;
    }
    
    .col-service, .col-time, .col-barber, .col-progress {
      grid-area: info;
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }
    
    .col-service::before {
      content: 'Service: ';
      color: #6c757d;
      font-weight: normal;
      width: 70px;
    }
    
    .col-time::before {
      content: 'Time: ';
      color: #6c757d;
      font-weight: normal;
      width: 70px;
    }
    
    .col-barber::before {
      content: 'Barber: ';
      color: #6c757d;
      font-weight: normal;
      width: 70px;
    }
    
    .col-progress::before {
      content: 'Progress: ';
      color: #6c757d;
      font-weight: normal;
      width: 70px;
    }
    
    .col-actions {
      grid-area: actions;
      position: static;
      justify-content: flex-end;
      width: 100%;
    }
  }
  </style>