<template>
  <div class="profile-view">
    <div class="page-header">
      <h1>Business Profile</h1>
      <button v-if="!isEditing" class="btn btn-primary" @click="startEditing">
        <span class="icon">✏️</span> Edit Profile
      </button>
      <div v-else class="header-actions">
        <button class="btn btn-secondary" @click="cancelEditing">
          Cancel
        </button>
        <button class="btn btn-primary" @click="saveProfile" :disabled="isSaving">
          <span v-if="isSaving" class="spinner"></span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </div>
    
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-if="success" class="alert alert-success">
      {{ success }}
    </div>
    
    <div class="profile-content">
      <div class="profile-sidebar">
        <div class="profile-photo-container">
          <div class="profile-photo">
            <img v-if="profileImage" :src="profileImage" alt="Business profile" />
            <div v-else class="photo-placeholder">
              {{ getInitials(profileData.name) }}
            </div>
          </div>
          <div v-if="isEditing" class="photo-actions">
            <label class="btn btn-sm btn-upload">
              <input type="file" accept="image/*" @change="handlePhotoUpload" class="hidden-input" />
              <span>Upload Photo</span>
            </label>
            <button v-if="profileImage" class="btn btn-sm btn-danger" @click="removePhoto">
              Remove
            </button>
          </div>
        </div>
        
        <div class="profile-info">
          <h2>{{ profileData.name }}</h2>
          <div class="info-item">
            <span class="icon">📧</span>
            <span>{{ user.email }}</span>
          </div>
          <div class="info-item">
            <span class="icon">📱</span>
            <span>{{ profileData.phone || 'No phone number' }}</span>
          </div>
          <div class="info-item">
            <span class="icon">🔐</span>
            <a href="#" @click.prevent="showPasswordModal = true">Change Password</a>
          </div>
        </div>
      </div>
      
      <div class="profile-details">
        <form class="profile-form">
          <!-- Business Information -->
          <div class="form-section">
            <h3 class="section-title">Business Information</h3>
            
            <div class="form-group">
              <label for="businessName">Business Name</label>
              <input 
                type="text" 
                id="businessName" 
                v-model="profileData.name" 
                class="form-control" 
                :disabled="!isEditing"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="phone">Business Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="profileData.phone" 
                  class="form-control" 
                  :disabled="!isEditing"
                />
              </div>
              
              <div class="form-group">
                <label for="website">Website</label>
                <input 
                  type="url" 
                  id="website" 
                  v-model="profileData.website" 
                  class="form-control" 
                  :disabled="!isEditing"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="description">Business Description</label>
              <textarea 
                id="description" 
                v-model="profileData.description" 
                class="form-control" 
                :disabled="!isEditing"
                rows="4"
              ></textarea>
            </div>
          </div>
          
          <!-- Address Information -->
          <div class="form-section">
            <h3 class="section-title">Address</h3>
            
            <div class="form-group">
              <label for="street">Street Address</label>
              <input 
                type="text" 
                id="street" 
                v-model="profileData.address.street" 
                class="form-control" 
                :disabled="!isEditing"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="profileData.address.city" 
                  class="form-control" 
                  :disabled="!isEditing"
                />
              </div>
              
              <div class="form-group">
                <label for="zipCode">Postal Code</label>
                <input 
                  type="text" 
                  id="zipCode" 
                  v-model="profileData.address.zipCode" 
                  class="form-control" 
                  :disabled="!isEditing"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="country">Country</label>
              <select 
                id="country" 
                v-model="profileData.address.country" 
                class="form-control" 
                :disabled="!isEditing"
              >
                <option value="France">France</option>
                <option value="Belgium">Belgium</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
            </div>
          </div>
          
          <!-- Business Hours -->
          <div class="form-section">
            <h3 class="section-title">Business Hours</h3>
            
            <div class="hours-container">
              <div v-for="(day, index) in weekDays" :key="day.id" class="day-hours">
                <div class="day-name">
                  <label class="checkbox">
                    <input 
                      type="checkbox" 
                      v-model="profileData.openingHours[index].isOpen"
                      :disabled="!isEditing"
                    />
                    <span>{{ day.name }}</span>
                  </label>
                </div>
                
                <div class="hours-slots" v-if="profileData.openingHours[index].isOpen">
                  <div 
                    v-for="(slot, slotIndex) in profileData.openingHours[index].slots" 
                    :key="slotIndex"
                    class="time-slot"
                  >
                    <div class="time-inputs">
                      <input 
                        type="time" 
                        v-model="slot.from" 
                        class="form-control time-input"
                        :disabled="!isEditing"
                      />
                      <span class="separator">-</span>
                      <input 
                        type="time" 
                        v-model="slot.to" 
                        class="form-control time-input"
                        :disabled="!isEditing"
                      />
                    </div>
                    
                    <div v-if="isEditing" class="slot-actions">
                      <button 
                        type="button"
                        class="btn btn-sm btn-danger" 
                        @click="removeTimeSlot(index, slotIndex)"
                        v-if="profileData.openingHours[index].slots.length > 1"
                      >
                        <span class="icon">-</span>
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    v-if="isEditing"
                    type="button"
                    class="btn btn-sm" 
                    @click="addTimeSlot(index)"
                  >
                    <span class="icon">+</span> Add Time Slot
                  </button>
                </div>
                
                <div class="closed-message" v-else>
                  Closed
                </div>
              </div>
            </div>
          </div>
          
          <!-- Social Media -->
          <div class="form-section">
            <h3 class="section-title">Social Media</h3>
            
            <div class="form-group">
              <label for="instagram">Instagram</label>
              <div class="input-with-icon">
                <span class="input-icon">@</span>
                <input 
                  type="text" 
                  id="instagram" 
                  v-model="profileData.socialMedia.instagram" 
                  class="form-control with-icon" 
                  :disabled="!isEditing"
                  placeholder="your_instagram_handle"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="facebook">Facebook</label>
              <div class="input-with-icon">
                <span class="input-icon">fb.com/</span>
                <input 
                  type="text" 
                  id="facebook" 
                  v-model="profileData.socialMedia.facebook" 
                  class="form-control with-icon" 
                  :disabled="!isEditing"
                  placeholder="your_page_name"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="twitter">Twitter</label>
              <div class="input-with-icon">
                <span class="input-icon">@</span>
                <input 
                  type="text" 
                  id="twitter" 
                  v-model="profileData.socialMedia.twitter" 
                  class="form-control with-icon" 
                  :disabled="!isEditing"
                  placeholder="your_twitter_handle"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Change Password</h2>
          <button class="close-btn" @click="showPasswordModal = false">&times;</button>
        </div>
        
        <div class="modal-body">
          <div v-if="passwordError" class="alert alert-danger">
            {{ passwordError }}
          </div>
          
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input 
              type="password" 
              id="currentPassword" 
              v-model="passwordData.currentPassword" 
              class="form-control" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="passwordData.newPassword" 
              class="form-control" 
              required
              minlength="8"
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="passwordData.confirmPassword" 
              class="form-control" 
              required
            />
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            class="btn btn-secondary" 
            @click="showPasswordModal = false"
          >
            Cancel
          </button>
          <button 
            class="btn btn-primary" 
            @click="changePassword"
            :disabled="isChangingPassword"
          >
            <span v-if="isChangingPassword" class="spinner"></span>
            <span v-else>Update Password</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBarbershopStore } from '@/stores/barbershops'

export default {
  name: 'ProfileView',
  
  setup() {
    const authStore = useAuthStore()
    const barbershopStore = useBarbershopStore()
    
    // State
    const isEditing = ref(false)
    const isSaving = ref(false)
    const error = ref('')
    const success = ref('')
    const profileImage = ref('')
    const showPasswordModal = ref(false)
    const isChangingPassword = ref(false)
    const passwordError = ref('')
    
    // Form data
    const user = reactive(authStore.currentUser || {})
    const profileData = reactive({
      name: 'My Barbershop',
      phone: '01 23 45 67 89',
      website: 'https://www.mybarbershop.com',
      description: 'Modern barbershop offering quality services for men and women in a relaxed atmosphere.',
      address: {
        street: '123 Main Street',
        city: 'Paris',
        zipCode: '75001',
        country: 'France'
      },
      openingHours: [
        { isOpen: true, slots: [{ from: '09:00', to: '19:00' }] },  // Monday
        { isOpen: true, slots: [{ from: '09:00', to: '19:00' }] },  // Tuesday
        { isOpen: true, slots: [{ from: '09:00', to: '19:00' }] },  // Wednesday
        { isOpen: true, slots: [{ from: '09:00', to: '21:00' }] },  // Thursday
        { isOpen: true, slots: [{ from: '09:00', to: '21:00' }] },  // Friday
        { isOpen: true, slots: [{ from: '10:00', to: '18:00' }] },  // Saturday
        { isOpen: false, slots: [{ from: '10:00', to: '15:00' }] }  // Sunday
      ],
      socialMedia: {
        instagram: 'mybarbershop',
        facebook: 'MyBarbershop',
        twitter: 'mybarbershop'
      }
    })
    
    const passwordData = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    const weekDays = [
      { id: 'monday', name: 'Monday' },
      { id: 'tuesday', name: 'Tuesday' },
      { id: 'wednesday', name: 'Wednesday' },
      { id: 'thursday', name: 'Thursday' },
      { id: 'friday', name: 'Friday' },
      { id: 'saturday', name: 'Saturday' },
      { id: 'sunday', name: 'Sunday' }
    ]
    
    // Methods
    const getInitials = (name) => {
      if (!name) return ''
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
    }
    
    const startEditing = () => {
      isEditing.value = true
    }
    
    const cancelEditing = () => {
      isEditing.value = false
      
      // Reset to original values (in a real app, this would fetch from API again)
      // For now we'll just keep the current values
    }
    
    const saveProfile = async () => {
      try {
        isSaving.value = true
        error.value = ''
        success.value = ''
        
        // In a real app, this would call an API to update the profile
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        
        // Update store if needed
        // barbershopStore.updateBusinessProfile(profileData)
        
        isEditing.value = false
        success.value = 'Profile updated successfully!'
      } catch (err) {
        error.value = 'Failed to update profile. Please try again.'
        console.error('Error updating profile:', err)
      } finally {
        isSaving.value = false
      }
    }
    
    const handlePhotoUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        error.value = 'Please select an image file'
        return
      }
      
      // In a real app, you would upload this to a server
      // For now, we'll just create a local URL
      const reader = new FileReader()
      reader.onload = (e) => {
        profileImage.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
    
    const removePhoto = () => {
      profileImage.value = ''
    }
    
    const addTimeSlot = (dayIndex) => {
      profileData.openingHours[dayIndex].slots.push({ from: '09:00', to: '18:00' })
    }
    
    const removeTimeSlot = (dayIndex, slotIndex) => {
      profileData.openingHours[dayIndex].slots.splice(slotIndex, 1)
    }
    
    const changePassword = async () => {
      try {
        passwordError.value = ''
        isChangingPassword.value = true
        
        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          passwordError.value = 'New passwords do not match'
          return
        }
        
        if (passwordData.newPassword.length < 8) {
          passwordError.value = 'Password must be at least 8 characters'
          return
        }
        
        // In a real app, this would call an API to change the password
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        
        // Reset password fields
        passwordData.currentPassword = ''
        passwordData.newPassword = ''
        passwordData.confirmPassword = ''
        
        // Close modal
        showPasswordModal.value = false
        
        // Show success message
        success.value = 'Password changed successfully!'
      } catch (err) {
        passwordError.value = 'Failed to change password. Please try again.'
        console.error('Error changing password:', err)
      } finally {
        isChangingPassword.value = false
      }
    }
    
    // Load profile data on mount
    onMounted(async () => {
      try {
        // In a real app, this would fetch the profile data from the API
        // For now, we'll just use the default values
      } catch (err) {
        error.value = 'Failed to load profile. Please refresh the page.'
        console.error('Error loading profile:', err)
      }
    })
    
    return {
      user,
      profileData,
      weekDays,
      isEditing,
      isSaving,
      error,
      success,
      profileImage,
      showPasswordModal,
      isChangingPassword,
      passwordError,
      passwordData,
      getInitials,
      startEditing,
      cancelEditing,
      saveProfile,
      handlePhotoUpload,
      removePhoto,
      addTimeSlot,
      removeTimeSlot,
      changePassword
    }
  }
}
</script>

<style scoped>
.profile-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-danger {
  background-color: #fff2f2;
  border-left: 3px solid #ff3b30;
  color: #e0352b;
}

.alert-success {
  background-color: #f0f9e6;
  border-left: 3px solid #34c759;
  color: #2db84d;
}

.profile-content {
  display: flex;
  gap: 24px;
}

.profile-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.profile-photo-container {
  margin-bottom: 20px;
}

.profile-photo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e9ecef;
  color: #495057;
  font-size: 64px;
  font-weight: 600;
}

.photo-actions {
  display: flex;
  gap: 8px;
}

.hidden-input {
  display: none;
}

.profile-info {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.profile-info h2 {
  margin: 0 0 16px 0;
  font-size: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #666;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .icon {
  font-size: 18px;
}

.info-item a {
  color: #0066ff;
  text-decoration: none;
}

.info-item a:hover {
  text-decoration: underline;
}

.profile-details {
  flex: 1;
}

.profile-form {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-control {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: #0066ff;
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
  outline: none;
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  padding: 0 14px;
  display: flex;
  align-items: center;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 8px 0 0 8px;
  border: 1px solid #ddd;
  border-right: none;
}

.form-control.with-icon {
  padding-left: 90px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.hours-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.day-hours {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

.day-hours:last-child {
  border-bottom: none;
}

.day-name {
  width: 100px;
  flex-shrink: 0;
}

.hours-slots {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-slot {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-input {
  width: 120px;
}

.separator {
  font-weight: 500;
}

.slot-actions {
  margin-left: auto;
}

.closed-message {
  flex: 1;
  color: #dc3545;
  font-style: italic;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-decoration: none;
  border: none;
}

.btn-primary {
  background-color: #0066ff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0055d6;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background-color: #f5f5f7;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e5e5ea;
}

.btn-sm {
  padding: 6px 10px;
  font-size: 14px;
}

.btn-danger {
  background-color: #ff3b30;
  color: white;
}

.btn-danger:hover {
  background-color: #e0352b;
}

.btn-upload {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.icon {
  margin-right: 6px;
}

.spinner {
  display: inline-block;
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

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  font-size: 20px;
  margin: 0;
}

.close-btn {
  font-size: 24px;
  font-weight: 700;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Responsive styles */
@media (max-width: 992px) {
  .profile-content {
    flex-direction: column;
  }
  
  .profile-sidebar {
    width: 100%;
    display: flex;
    gap: 24px;
  }
  
  .profile-photo-container {
    margin-bottom: 0;
  }
  
  .profile-info {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .profile-sidebar {
    flex-direction: column;
  }
  
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .day-hours {
    flex-direction: column;
    gap: 12px;
  }
  
  .day-name {
    width: 100%;
  }
}
</style>