<template>
    <div class="join-queue-form">
      <h3 class="form-title">Join the Queue</h3>
      
      <div v-if="formStep === 1" class="form-step">
        <p class="step-description">Fill in your details to join the queue</p>
        
        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            class="form-control"
            placeholder="Your name"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            class="form-control"
            placeholder="Your phone number"
            required
          />
          <small class="help-text">We'll send you SMS updates about your position in the queue</small>
        </div>
        
        <div class="form-group">
          <label>Service</label>
          <div class="service-options">
            <div 
              v-for="service in services" 
              :key="service.id" 
              class="service-option"
              :class="{ 'selected': formData.service === service.id }"
              @click="selectService(service.id)"
            >
              <div class="service-info">
                <div class="service-name">{{ service.name }}</div>
                <div class="service-details">{{ service.duration }} min • {{ formatPrice(service.price) }}</div>
              </div>
              <div class="service-checkbox">
                <div v-if="formData.service === service.id" class="checkbox-checked">✓</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Preferred Barber (Optional)</label>
          <div class="barber-options">
            <div 
              v-for="barber in availableBarbers" 
              :key="barber.id" 
              class="barber-option"
              :class="{ 'selected': formData.barber === barber.id }"
              @click="selectBarber(barber.id)"
            >
              <div class="barber-avatar">
                <img :src="barber.photo" :alt="barber.name">
              </div>
              <div class="barber-info">
                <div class="barber-name">{{ barber.name }}</div>
                <div class="barber-rating">
                  <span class="star">⭐</span>
                  <span>{{ barber.rating }}</span>
                </div>
              </div>
              <div class="barber-checkbox">
                <div v-if="formData.barber === barber.id" class="checkbox-checked">✓</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="notes">Special Requests (Optional)</label>
          <textarea
            id="notes"
            v-model="formData.notes"
            class="form-control"
            placeholder="Any special requests?"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button class="btn cancel-btn" @click="cancel">Cancel</button>
          <button 
            class="btn next-btn" 
            @click="goToStep(2)"
            :disabled="!formData.name || !formData.phone || !formData.service"
          >
            Next
          </button>
        </div>
      </div>
      
      <div v-if="formStep === 2" class="form-step">
        <p class="step-description">Confirm your details</p>
        
        <div class="confirmation-details">
          <div class="detail-item">
            <span class="detail-label">Name:</span>
            <span class="detail-value">{{ formData.name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">{{ formData.phone }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Service:</span>
            <span class="detail-value">{{ getServiceName(formData.service) }}</span>
          </div>
          <div class="detail-item" v-if="formData.barber">
            <span class="detail-label">Barber:</span>
            <span class="detail-value">{{ getBarberName(formData.barber) }}</span>
          </div>
          <div class="detail-item" v-if="formData.notes">
            <span class="detail-label">Notes:</span>
            <span class="detail-value">{{ formData.notes }}</span>
          </div>
          
          <div class="queue-info">
            <div class="info-item">
              <span class="info-icon">👥</span>
              <span>{{ peopleInQueue }} people in queue</span>
            </div>
            <div class="info-item">
              <span class="info-icon">🕒</span>
              <span>Estimated wait: ~{{ estimatedWaitTime }} minutes</span>
            </div>
          </div>
          
          <div class="notifications-option">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.notifications">
              <span>Receive SMS notifications about my position</span>
            </label>
          </div>
        </div>
        
        <div class="form-actions">
          <button class="btn back-btn" @click="goToStep(1)">Back</button>
          <button 
            class="btn submit-btn" 
            @click="submitForm"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="spinner"></span>
            <span v-else>Join Queue</span>
          </button>
        </div>
      </div>
      
      <div v-if="formStep === 3" class="form-step success-step">
        <div class="success-icon">✅</div>
        <h3 class="success-title">You're in the Queue!</h3>
        <div class="ticket-info">
          <div class="ticket-number">{{ ticketNumber }}</div>
          <p>Your position: <strong>{{ queuePosition }}</strong></p>
          <p>Estimated wait time: <strong>{{ estimatedWaitTime }} minutes</strong></p>
        </div>
        <p class="success-message">
          We'll send you SMS updates as your turn approaches.
          You can also check your position online.
        </p>
        <div class="form-actions">
          <button class="btn view-btn" @click="viewQueue">View My Place in Line</button>
          <button class="btn done-btn" @click="done">Done</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useQueueStore } from '@/stores/queues'
  
  export default {
    name: 'JoinQueueForm',
    props: {
      barbershopId: {
        type: [Number, String],
        required: true
      },
      services: {
        type: Array,
        required: true
      },
      barbers: {
        type: Array,
        required: true
      },
      peopleInQueue: {
        type: Number,
        default: 0
      },
      estimatedWaitTime: {
        type: Number,
        default: 15
      }
    },
    
    emits: ['cancel', 'done', 'joined'],
    
    setup(props, { emit }) {
      const router = useRouter()
      const queueStore = useQueueStore()
      
      const formStep = ref(1)
      const isSubmitting = ref(false)
      const ticketNumber = ref('')
      const queuePosition = ref(0)
      
      // Form data
      const formData = ref({
        name: '',
        phone: '',
        service: null,
        barber: null,
        notes: '',
        notifications: true
      })
      
      // Computed properties
      const availableBarbers = computed(() => {
        // If no service is selected, show all barbers
        if (!formData.value.service) return props.barbers
        
        // Filter barbers who can perform the selected service
        const selectedService = props.services.find(s => s.id === formData.value.service)
        if (!selectedService) return props.barbers
        
        return props.barbers.filter(barber => 
          barber.specialties.includes(selectedService.name)
        )
      })
      
      // Methods
      const formatPrice = (price) => {
        return `${price.toFixed(2)}€`
      }
      
      const selectService = (serviceId) => {
        formData.value.service = serviceId
        
        // If the currently selected barber can't perform this service, reset barber selection
        if (formData.value.barber) {
          const selectedBarber = props.barbers.find(b => b.id === formData.value.barber)
          const selectedService = props.services.find(s => s.id === serviceId)
          
          if (selectedBarber && selectedService && 
              !selectedBarber.specialties.includes(selectedService.name)) {
            formData.value.barber = null
          }
        }
      }
      
      const selectBarber = (barberId) => {
        formData.value.barber = formData.value.barber === barberId ? null : barberId
      }
      
      const getServiceName = (serviceId) => {
        const service = props.services.find(s => s.id === serviceId)
        return service ? service.name : ''
      }
      
      const getBarberName = (barberId) => {
        const barber = props.barbers.find(b => b.id === barberId)
        return barber ? barber.name : ''
      }
      
      const goToStep = (step) => {
        formStep.value = step
      }
      
      const cancel = () => {
        emit('cancel')
      }
      
      const submitForm = async () => {
        try {
          isSubmitting.value = true
          
          // Prepare data for API
          const clientData = {
            name: formData.value.name,
            phone: formData.value.phone,
            service: getServiceName(formData.value.service),
            barber: formData.value.barber ? getBarberName(formData.value.barber) : null,
            notes: formData.value.notes,
            sendNotifications: formData.value.notifications
          }
          
          // Call the API through the queue store
          const result = await queueStore.joinQueue(props.barbershopId, clientData)
          
          if (result.success) {
            ticketNumber.value = result.ticketId || 'Q-' + Math.floor(Math.random() * 1000)
            queuePosition.value = result.queueNumber || Math.floor(Math.random() * 10) + 1
            
            // Go to success step
            goToStep(3)
            
            // Emit joined event with ticket info
            emit('joined', {
              ticketId: ticketNumber.value,
              position: queuePosition.value,
              waitTime: props.estimatedWaitTime
            })
          }
        } catch (error) {
          console.error('Error joining queue:', error)
          // TODO: Handle error properly
        } finally {
          isSubmitting.value = false
        }
      }
      
      const viewQueue = () => {
        router.push(`/my-queue?ticket=${ticketNumber.value}`)
      }
      
      const done = () => {
        emit('done', {
          ticketId: ticketNumber.value,
          position: queuePosition.value
        })
      }
      
      return {
        formStep,
        formData,
        isSubmitting,
        ticketNumber,
        queuePosition,
        availableBarbers,
        formatPrice,
        selectService,
        selectBarber,
        getServiceName,
        getBarberName,
        goToStep,
        cancel,
        submitForm,
        viewQueue,
        done
      }
    }
  }
  </script>
  
  <style scoped>
  .join-queue-form {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 24px;
  }
  
  .form-title {
    margin: 0 0 20px 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
    text-align: center;
  }
  
  .step-description {
    margin: 0 0 20px 0;
    text-align: center;
    color: #666;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }
  
  .form-control {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s;
  }
  
  .form-control:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
  }
  
  .help-text {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: #666;
  }
  
  .service-options,
  .barber-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .service-option,
  .barber-option {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .service-option:hover,
  .barber-option:hover {
    background-color: #f5f7fa;
  }
  
  .service-option.selected,
  .barber-option.selected {
    border-color: #0066ff;
    background-color: rgba(0, 102, 255, 0.05);
  }
  
  .service-info {
    flex: 1;
  }
  
  .service-name {
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .service-details {
    font-size: 14px;
    color: #666;
  }
  
  .barber-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
  }
  
  .barber-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .barber-info {
    flex: 1;
  }
  
  .barber-name {
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .barber-rating {
    font-size: 14px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .star {
    color: #ffcc00;
  }
  
  .service-checkbox,
  .barber-checkbox {
    width: 24px;
    height: 24px;
    border: 2px solid #ddd;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .checkbox-checked {
    color: #0066ff;
    font-weight: bold;
  }
  
  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }
  
  .btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
  }
  
  .cancel-btn,
  .back-btn {
    background-color: #f5f5f7;
    color: #333;
  }
  
  .cancel-btn:hover,
  .back-btn:hover {
    background-color: #e5e5ea;
  }
  
  .next-btn,
  .submit-btn {
    background-color: #0066ff;
    color: white;
  }
  
  .next-btn:hover,
  .submit-btn:hover {
    background-color: #0055d6;
  }
  
  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .confirmation-details {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .detail-item {
    display: flex;
    margin-bottom: 10px;
  }
  
  .detail-label {
    font-weight: 500;
    width: 80px;
    flex-shrink: 0;
  }
  
  .detail-value {
    flex: 1;
  }
  
  .queue-info {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  
  .info-icon {
    font-size: 18px;
  }
  
  .notifications-option {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .success-step {
    text-align: center;
  }
  
  .success-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .success-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #34c759;
  }
  
  .ticket-info {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .ticket-number {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #0066ff;
  }
  
  .success-message {
    margin-bottom: 24px;
    color: #666;
  }
  
  .view-btn {
    background-color: #0066ff;
    color: white;
  }
  
  .view-btn:hover {
    background-color: #0055d6;
  }
  
  .done-btn {
    background-color: #f5f5f7;
    color: #333;
  }
  
  .done-btn:hover {
    background-color: #e5e5ea;
  }
  </style>