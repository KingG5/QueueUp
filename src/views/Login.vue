<!-- src/views/Login.vue -->
<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-container">
        <span class="logo-icon">💇</span>
        <h1 class="logo-text">QueueUp</h1>
      </div>
      
      <h2>{{ isRegister ? 'Create an Account' : 'Login to Your Account' }}</h2>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group" v-if="isRegister">
          <label for="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            required
            placeholder="Enter your full name"
          >
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required
            placeholder="Enter your email"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required
            placeholder="Enter your password"
          >
        </div>
        
        <div class="form-group" v-if="isRegister">
          <label for="role">Account Type</label>
          <select id="role" v-model="form.role" required>
            <option value="client">Client</option>
            <option value="business">Business Owner</option>
          </select>
        </div>
        
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Login') }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p v-if="isRegister">
          Already have an account? 
          <a href="#" @click.prevent="toggleAuthMode">Login</a>
        </p>
        <p v-else>
          Don't have an account? 
          <a href="#" @click.prevent="toggleAuthMode">Create one</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      isRegister: false,
      form: {
        name: '',
        email: '',
        password: '',
        role: 'client'
      }
    }
  },
  computed: {
    ...mapState('auth', ['loading', 'error'])
  },
  methods: {
    ...mapActions('auth', [
      'login',
      'register'
    ]),
    toggleAuthMode() {
      this.isRegister = !this.isRegister;
    },
    async handleSubmit() {
      try {
        if (this.isRegister) {
          // Registration
          await this.register(this.form);
        } else {
          // Login
          await this.login({
            email: this.form.email,
            password: this.form.password
          });
        }
        
        // Redirect based on user role
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Authentication error:', error);
      }
    }
  }
}
</script>

<style scoped>
/* Add your styles here similar to the ones from your existing code */
</style>