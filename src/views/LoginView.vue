<template>
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>BarberQ</h1>
          <p>Système de gestion de file d'attente</p>
        </div>
        
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="credentials.email" 
              class="form-control" 
              required
              placeholder="votre@email.com"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="password-input">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="credentials.password" 
                class="form-control" 
                required
                placeholder="••••••••"
              />
              <button 
                type="button" 
                class="toggle-password" 
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              >
                <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="form-check">
            <input type="checkbox" id="remember" v-model="credentials.remember" class="form-check-input" />
            <label for="remember" class="form-check-label">Se souvenir de moi</label>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner"></span>
            <span v-else>Connexion</span>
          </button>
        </form>
        
        <div class="login-footer">
          <p>Vous avez oublié votre mot de passe? <a href="#" @click.prevent="forgotPassword">Réinitialiser</a></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    data() {
      return {
        credentials: {
          email: '',
          password: '',
          remember: false
        },
        showPassword: false,
        isSubmitting: false,
        errorMessage: ''
      }
    },
    methods: {
      async handleLogin() {
        this.isSubmitting = true;
        this.errorMessage = '';
        
        try {
          // Call your authentication API
          const response = await this.$store.dispatch('auth/login', this.credentials);
          
          // Redirect based on user role
          if (this.$store.getters['auth/userRole'] === 'manager') {
            this.$router.push('/dashboard');
          } else {
            this.$router.push('/queue');
          }
        } catch (error) {
          this.errorMessage = error.message || 'Identifiants incorrects. Veuillez réessayer.';
        } finally {
          this.isSubmitting = false;
        }
      },
      
      forgotPassword() {
        // Implement password reset functionality
        alert('Fonctionnalité de réinitialisation de mot de passe à implémenter');
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f7;
    padding: 20px;
  }
  
  .login-card {
    width: 100%;
    max-width: 420px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 40px;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 32px;
    
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #0066ff;
    }
    
    p {
      color: #666;
      font-size: 16px;
    }
  }
  
  .login-form {
    margin-bottom: 24px;
  }
  
  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
  }
  
  .form-control {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.2s ease;
    
    &:focus {
      border-color: #0066ff;
      box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
      outline: none;
    }
  }
  
  .password-input {
    position: relative;
    
    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #777;
      cursor: pointer;
      
      &:hover {
        color: #333;
      }
    }
  }
  
  .form-check {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    
    .form-check-input {
      margin-right: 8px;
    }
    
    .form-check-label {
      font-size: 14px;
      color: #666;
    }
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
    
    &-primary {
      background-color: #0066ff;
      border: none;
      color: white;
      
      &:hover:not(:disabled) {
        background-color: #0055d6;
        transform: translateY(-1px);
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
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
  
  .login-footer {
    text-align: center;
    font-size: 14px;
    color: #666;
    
    a {
      color: #0066ff;
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .alert {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-size: 14px;
    
    &-danger {
      background-color: #fff2f2;
      border-left: 3px solid #ff3b30;
      color: #e0352b;
    }
  }
  </style>