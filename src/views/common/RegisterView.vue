<template>
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1>Create an Account</h1>
          <p v-if="!selectedRole">Choose your account type</p>
          <p v-else>{{ selectedRole === 'client' ? 'Join as a customer' : 'Register your business' }}</p>
        </div>
        
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        
        <!-- Role selection step -->
        <div v-if="!selectedRole" class="role-selection">
          <div class="role-options">
            <div 
              class="role-option" 
              @click="selectRole('client')"
            >
              <div class="role-icon">👤</div>
              <div class="role-info">
                <h2>Customer</h2>
                <p>Join queues and get haircuts faster</p>
              </div>
            </div>
            
            <div 
              class="role-option" 
              @click="selectRole('business')"
            >
              <div class="role-icon">💈</div>
              <div class="role-info">
                <h2>Business</h2>
                <p>Manage your barbershop's waiting list</p>
              </div>
            </div>
          </div>
          
          <div class="register-footer">
            <p>Already have an account? <router-link to="/login">Sign in</router-link></p>
          </div>
        </div>
        
        <!-- Registration form -->
        <form v-else @submit.prevent="handleRegister" class="register-form">
          <!-- Common fields for both roles -->
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              class="form-control" 
              required
              placeholder="Your name"
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              class="form-control" 
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="formData.password" 
                class="form-control" 
                required
                placeholder="••••••••"
                minlength="8"
              />
              <button 
                type="button" 
                class="toggle-password" 
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <span v-if="showPassword">Hide</span>
                <span v-else>Show</span>
              </button>
            </div>
            <div class="password-strength" v-if="formData.password">
              <div 
                class="strength-bar" 
                :class="passwordStrengthClass"
                :style="{ width: passwordStrength + '%' }"
              ></div>
              <div class="strength-text">{{ passwordStrengthText }}</div>
            </div>
          </div>
          
          <!-- Business-specific fields -->
          <div v-if="selectedRole === 'business'" class="business-fields">
            <div class="form-group">
              <label for="businessName">Business Name</label>
              <input 
                type="text" 
                id="businessName" 
                v-model="formData.businessName" 
                class="form-control" 
                required
                placeholder="Your barbershop name"
              />
            </div>
            
            <div class="form-group">
              <label for="phone">Business Phone</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="formData.phone" 
                class="form-control" 
                required
                placeholder="Business phone number"
              />
            </div>
            
            <div class="form-group">
              <label for="address">Business Address</label>
              <textarea 
                id="address" 
                v-model="formData.address" 
                class="form-control"
                rows="3"
                required
                placeholder="Full business address"
              ></textarea>
            </div>
          </div>
          
          <div class="form-group terms-check">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="formData.acceptTerms" 
                required
              />
              <span>I agree to the <a href="#" @click.prevent="showTerms = true">Terms of Service</a> and <a href="#" @click.prevent="showPrivacy = true">Privacy Policy</a></span>
            </label>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner"></span>
            <span v-else>Create Account</span>
          </button>
          
          <div class="register-footer">
            <p>Already have an account? <router-link to="/login">Sign in</router-link></p>
            <button type="button" class="btn-back" @click="selectedRole = null">
              <span class="back-icon">←</span> Back to account types
            </button>
          </div>
        </form>
      </div>
      
      <!-- Terms of Service Modal -->
      <div v-if="showTerms" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Terms of Service</h2>
            <button class="close-btn" @click="showTerms = false">&times;</button>
          </div>
          <div class="modal-body">
            <p>These Terms of Service govern your use of QueueUp, operated by QueueUp Inc.</p>
            <p>By creating an account and using our service, you agree to these terms.</p>
            
            <h3>1. Account Registration</h3>
            <p>To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
            
            <h3>2. Use of Service</h3>
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service in any way that could damage the Service or general business of QueueUp.</p>
            
            <h3>3. Data Privacy</h3>
            <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and disclose information about you.</p>
            
            <h3>4. Termination</h3>
            <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason.</p>
          </div>
          <div class="modal-footer">
            <button class="btn" @click="showTerms = false">Close</button>
          </div>
        </div>
      </div>
      
      <!-- Privacy Policy Modal -->
      <div v-if="showPrivacy" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Privacy Policy</h2>
            <button class="close-btn" @click="showPrivacy = false">&times;</button>
          </div>
          <div class="modal-body">
            <p>This Privacy Policy describes how your personal information is collected, used, and shared when you use QueueUp.</p>
            
            <h3>1. Information We Collect</h3>
            <p>When you create an account, we collect your name, email address, and password. If you register as a business, we also collect your business name, phone number, and address.</p>
            
            <h3>2. How We Use Your Information</h3>
            <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with applicable laws.</p>
            
            <h3>3. Information Sharing</h3>
            <p>We share your information with service providers who help us provide the Service, with your consent, and to comply with legal obligations.</p>
            
            <h3>4. Data Security</h3>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </div>
          <div class="modal-footer">
            <button class="btn" @click="showPrivacy = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  export default {
    name: 'RegisterView',
    
    setup() {
      const route = useRoute()
      const router = useRouter()
      const authStore = useAuthStore()
      
      // State
      const selectedRole = ref(null)
      const showPassword = ref(false)
      const isSubmitting = ref(false)
      const errorMessage = ref('')
      const showTerms = ref(false)
      const showPrivacy = ref(false)
      
      // Form data
      const formData = ref({
        name: '',
        email: '',
        password: '',
        businessName: '',
        phone: '',
        address: '',
        acceptTerms: false,
        role: ''
      })
      
      // Password strength calculation
      const passwordStrength = computed(() => {
        const password = formData.value.password || ''
        if (!password) return 0
        
        let strength = 0
        
        // Length check
        if (password.length >= 8) strength += 25
        
        // Contains uppercase
        if (/[A-Z]/.test(password)) strength += 25
        
        // Contains number
        if (/[0-9]/.test(password)) strength += 25
        
        // Contains special character
        if (/[^A-Za-z0-9]/.test(password)) strength += 25
        
        return strength
      })
      
      const passwordStrengthClass = computed(() => {
        const strength = passwordStrength.value
        
        if (strength < 50) return 'weak'
        if (strength < 75) return 'medium'
        return 'strong'
      })
      
      const passwordStrengthText = computed(() => {
        const strength = passwordStrength.value
        
        if (strength < 50) return 'Weak'
        if (strength < 75) return 'Medium'
        return 'Strong'
      })
      
      // Methods
      const selectRole = (role) => {
        selectedRole.value = role
        formData.value.role = role
      }
      
      const handleRegister = async () => {
        try {
          isSubmitting.value = true
          errorMessage.value = ''
          
          // Validate form
          if (!formData.value.acceptTerms) {
            errorMessage.value = 'You must accept the Terms of Service and Privacy Policy'
            return
          }
          
          // Additional business validation
          if (selectedRole.value === 'business' && 
              (!formData.value.businessName || !formData.value.phone || !formData.value.address)) {
            errorMessage.value = 'Please fill in all business details'
            return
          }
          
          // Register the user
          const result = await authStore.register(formData.value)
          
          if (result.success) {
            // Redirect to appropriate page based on role
            if (selectedRole.value === 'business') {
              router.push('/dashboard')
            } else {
              router.push('/nearby')
            }
          }
        } catch (error) {
          errorMessage.value = error.message || 'Registration failed. Please try again.'
        } finally {
          isSubmitting.value = false
        }
      }
      
      // Check for role parameter in URL
      onMounted(() => {
        if (route.query.type === 'business') {
          selectRole('business')
        }
      })
      
      return {
        selectedRole,
        formData,
        showPassword,
        isSubmitting,
        errorMessage,
        showTerms,
        showPrivacy,
        passwordStrength,
        passwordStrengthClass,
        passwordStrengthText,
        selectRole,
        handleRegister
      }
    }
  }
  </script>
  
  <style scoped>
  .register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f7;
    padding: 20px;
  }
  
  .register-card {
    width: 100%;
    max-width: 500px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 40px;
  }
  
  .register-header {
    text-align: center;
    margin-bottom: 32px;
  }
  
  .register-header h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #0066ff;
  }
  
  .register-header p {
    color: #666;
    font-size: 16px;
  }
  
  .role-options {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
  }
  
  .role-option {
    flex: 1;
    background-color: #f8f9fa;
    border: 2px solid #f0f0f0;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }
  
  .role-option:hover {
    border-color: #0066ff;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 102, 255, 0.1);
  }
  
  .role-icon {
    font-size: 36px;
    margin-bottom: 16px;
  }
  
  .role-info h2 {
    font-size: 18px;
    margin-bottom: 8px;
    color: #333;
  }
  
  .role-info p {
    font-size: 14px;
    color: #666;
  }
  
  .register-form {
    margin-bottom: 24px;
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
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.2s ease;
  }
  
  .form-control:focus {
    border-color: #0066ff;
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
    outline: none;
  }
  
  .password-input {
    position: relative;
  }
  
  .toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #777;
    cursor: pointer;
    font-size: 14px;
  }
  
  .toggle-password:hover {
    color: #333;
  }
  
  .password-strength {
    margin-top: 8px;
  }
  
  .strength-bar {
    height: 4px;
    background-color: #e0e0e0;
    border-radius: 2px;
    margin-bottom: 4px;
  }
  
  .strength-bar.weak {
    background-color: #ff3b30;
  }
  
  .strength-bar.medium {
    background-color: #ff9500;
  }
  
  .strength-bar.strong {
    background-color: #34c759;
  }
  
  .strength-text {
    font-size: 12px;
    text-align: right;
  }
  
  .strength-text:empty {
    display: none;
  }
  
  .business-fields {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }
  
  .terms-check {
    display: flex;
    align-items: flex-start;
  }
  
  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;
  }
  
  .checkbox-label input {
    margin-top: 4px;
  }
  
  .checkbox-label span {
    font-size: 14px;
    color: #666;
  }
  
  .checkbox-label a {
    color: #0066ff;
    text-decoration: none;
  }
  
  .checkbox-label a:hover {
    text-decoration: underline;
  }
  
  .btn {
    width: 100%;
    padding: 14px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #0066ff;
    border: none;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background-color: #0055d6;
    transform: translateY(-1px);
  }
  
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  
  .register-footer {
    text-align: center;
    font-size: 14px;
    color: #666;
    margin-top: 24px;
  }
  
  .register-footer a {
    color: #0066ff;
    text-decoration: none;
    font-weight: 500;
  }
  
  .register-footer a:hover {
    text-decoration: underline;
  }
  
  .btn-back {
    background: none;
    border: none;
    color: #666;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px auto 0;
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  .btn-back:hover {
    background-color: #f5f5f7;
  }
  
  .back-icon {
    margin-right: 4px;
  }
  
  .alert {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-size: 14px;
  }
  
  .alert-danger {
    background-color: #fff2f2;
    border-left: 3px solid #ff3b30;
    color: #e0352b;
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
    max-width: 600px;
    max-height: 80vh;
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
    font-size: 14px;
    line-height: 1.6;
    color: #333;
  }
  
  .modal-body h3 {
    font-size: 16px;
    margin: 20px 0 10px;
  }
  
  .modal-body p {
    margin: 0 0 10px;
  }
  
  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
    text-align: right;
  }
  
  .modal-footer .btn {
    width: auto;
    padding: 8px 16px;
    background-color: #f5f5f7;
    color: #333;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .register-card {
      padding: 30px 20px;
    }
    
    .role-options {
      flex-direction: column;
      gap: 16px;
    }
  }
  </style>