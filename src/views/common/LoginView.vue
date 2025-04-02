<template>
    <div class="login-page">
      <div class="login-container">
        <h1>Login to QueueUp</h1>
        
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="credentials.email" 
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="credentials.password" 
              required
              placeholder="Enter your password"
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
        
        <div class="login-footer">
          <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '@/stores/auth';
  import { useRouter, useRoute } from 'vue-router';
  
  export default {
    name: 'LoginView',
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
      const route = useRoute();
      
      return {
        authStore,
        router,
        route
      };
    },
    data() {
      return {
        credentials: {
          email: '',
          password: ''
        },
        loading: false,
        error: null
      };
    },
    methods: {
      async login() {
        this.loading = true;
        this.error = null;
        
        try {
          const result = await this.authStore.login(this.credentials);
          
          if (result.success) {
            // Redirect to dashboard or the page they tried to access before
            const redirectPath = this.route.query.redirect || '/dashboard';
            this.router.push(redirectPath);
          } else {
            this.error = result.error || 'Login failed. Please try again.';
          }
        } catch (err) {
          this.error = 'An unexpected error occurred. Please try again.';
          console.error('Login error:', err);
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f7fa;
  }
  
  .login-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 400px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
  
  .login-form {
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-actions {
    margin-top: 2rem;
  }
  
  .btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #0069d9;
  }
  
  .login-footer {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #666;
  }
  
  .login-footer a {
    color: #007bff;
    text-decoration: none;
  }
  
  .login-footer a:hover {
    text-decoration: underline;
  }
  </style>