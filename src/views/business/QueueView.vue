<template>
  <div class="queues">
    <AppNavbar />
    <div class="container">
      <div class="header-actions">
        <h1>My Queues</h1>
        <button class="btn btn-primary" @click="showCreateQueueModal = true">Create New Queue</button>
      </div>
      
      <div class="queues-list" v-if="queues.length > 0">
        <div v-for="queue in queues" :key="queue.id" class="queue-card">
          <div class="queue-header">
            <h2>{{ queue.name }}</h2>
            <div class="queue-status" :class="{ 'active': queue.isActive }">
              {{ queue.isActive ? 'Active' : 'Inactive' }}
            </div>
          </div>
          
          <div class="queue-details">
            <div class="detail-item">
              <span class="detail-label">Created:</span>
              <span class="detail-value">{{ formatDate(queue.createdAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Current visitors:</span>
              <span class="detail-value">{{ queue.currentVisitors }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Average wait time:</span>
              <span class="detail-value">{{ queue.avgWaitTime }} minutes</span>
            </div>
          </div>
          
          <div class="queue-actions">
            <button class="btn btn-secondary" @click="viewQueue(queue.id)">View</button>
            <button class="btn btn-primary" @click="editQueue(queue.id)">Edit</button>
            <button class="btn btn-danger" @click="deleteQueue(queue.id)">Delete</button>
          </div>
        </div>
      </div>
      
      <div class="empty-state" v-else>
        <p>You don't have any queues yet.</p>
        <button class="btn btn-primary" @click="showCreateQueueModal = true">Create Your First Queue</button>
      </div>
      
      <!-- Create Queue Modal (Simplified) -->
      <div class="modal" v-if="showCreateQueueModal">
        <div class="modal-content">
          <h2>Create New Queue</h2>
          
          <div class="form-group">
            <label for="queue-name">Queue Name</label>
            <input type="text" id="queue-name" v-model="newQueue.name" placeholder="Enter queue name">
          </div>
          
          <div class="form-group">
            <label for="queue-description">Description</label>
            <textarea id="queue-description" v-model="newQueue.description" placeholder="Enter queue description"></textarea>
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="showCreateQueueModal = false">Cancel</button>
            <button class="btn btn-primary" @click="createQueue">Create Queue</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppNavbar from '@/views/AppNavbar.vue';

export default {
  name: 'QueuesView',
  components: {
    AppNavbar
  },
  data() {
    return {
      queues: [
        {
          id: 1,
          name: 'Customer Support',
          isActive: true,
          createdAt: new Date('2023-01-15'),
          currentVisitors: 12,
          avgWaitTime: 15
        },
        {
          id: 2,
          name: 'Technical Help',
          isActive: true,
          createdAt: new Date('2023-02-10'),
          currentVisitors: 8,
          avgWaitTime: 10
        },
        {
          id: 3,
          name: 'Product Demo',
          isActive: false,
          createdAt: new Date('2023-01-28'),
          currentVisitors: 0,
          avgWaitTime: 20
        }
      ],
      showCreateQueueModal: false,
      newQueue: {
        name: '',
        description: ''
      }
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    viewQueue(id) {
      console.log('Viewing queue', id);
      // Navigate to queue details
      this.$router.push(`/queues/${id}`);
    },
    editQueue(id) {
      console.log('Editing queue', id);
      // Open edit modal or navigate to edit page
    },
    deleteQueue(id) {
      if (confirm('Are you sure you want to delete this queue?')) {
        console.log('Deleting queue', id);
        this.queues = this.queues.filter(queue => queue.id !== id);
      }
    },
    createQueue() {
      if (!this.newQueue.name) {
        alert('Please enter a queue name');
        return;
      }
      
      // Create a new queue
      const newId = Math.max(...this.queues.map(q => q.id), 0) + 1;
      
      this.queues.push({
        id: newId,
        name: this.newQueue.name,
        description: this.newQueue.description,
        isActive: true,
        createdAt: new Date(),
        currentVisitors: 0,
        avgWaitTime: 0
      });
      
      // Reset form and close modal
      this.newQueue = { name: '', description: '' };
      this.showCreateQueueModal = false;
    }
  }
};
</script>

<style scoped>
.queues {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.container {
  padding: 2rem;
  position: relative;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.queues-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.queue-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.queue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.queue-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  background-color: #dc3545;
  color: white;
}

.queue-status.active {
  background-color: #28a745;
}

.queue-details {
  margin-bottom: 1.5rem;
}

.detail-item {
  margin-bottom: 0.5rem;
  display: flex;
}

.detail-label {
  font-weight: 500;
  width: 150px;
}

.queue-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  margin: 4rem 0;
}

.empty-state p {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  color: #666;
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
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
}

.modal-content h2 {
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}
</style>