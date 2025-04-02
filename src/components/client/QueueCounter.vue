<template>
    <div class="queue-counter" :class="{ 'busy': isBusy, 'moderate': isModerate, 'light': isLight }">
      <div class="counter-circle">
        <span class="counter-value">{{ count }}</span>
      </div>
      <div class="counter-details">
        <div class="counter-label">People in queue</div>
        <div class="wait-time">~{{ waitTime }} min wait</div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  
  export default {
    name: 'QueueCounter',
    props: {
      count: {
        type: Number,
        required: true
      },
      waitTime: {
        type: Number,
        required: true
      }
    },
    
    setup(props) {
      // Computed properties to determine the queue status
      const isBusy = computed(() => props.count > 7)
      const isModerate = computed(() => props.count > 3 && props.count <= 7)
      const isLight = computed(() => props.count <= 3)
      
      return {
        isBusy,
        isModerate,
        isLight
      }
    }
  }
  </script>
  
  <style scoped>
  .queue-counter {
    display: flex;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    background-color: #f8f9fa;
    transition: background-color 0.3s;
  }
  
  .queue-counter.busy {
    background-color: #fff2f2;
  }
  
  .queue-counter.moderate {
    background-color: #fff8e6;
  }
  
  .queue-counter.light {
    background-color: #f0f9e6;
  }
  
  .counter-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
    flex-shrink: 0;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .counter-value {
    font-size: 24px;
    font-weight: 700;
  }
  
  .busy .counter-value {
    color: #ff3b30;
  }
  
  .moderate .counter-value {
    color: #ff9500;
  }
  
  .light .counter-value {
    color: #34c759;
  }
  
  .counter-details {
    flex: 1;
  }
  
  .counter-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
  }
  
  .wait-time {
    font-size: 18px;
    font-weight: 600;
  }
  
  .busy .wait-time {
    color: #ff3b30;
  }
  
  .moderate .wait-time {
    color: #ff9500;
  }
  
  .light .wait-time {
    color: #34c759;
  }
  </style>