<template>
    <div class="auth-container">
      <h1>Register</h1>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <select v-model="role">
          <option disabled value="">Select role</option>
          <option value="client">Client</option>
          <option value="manager">Barbershop Manager</option>
        </select>
        <button :disabled="loading">{{ loading ? 'Registering...' : 'Register' }}</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      <router-link to="/login">Already have an account? Login</router-link>
    </div>
  </template>
  
  <script>
  import { registerUser, fetchUserData } from '../firebase/auth';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  
  export default {
    setup() {
      const store = useStore();
      const router = useRouter();
  
      const email = ref('');
      const password = ref('');
      const role = ref('');
      const error = ref(null);
      const loading = ref(false);
  
      const register = async () => {
        error.value = null;
        loading.value = true;
        try {
          const user = await registerUser(email.value, password.value, role.value);
          store.commit('SET_USER', user);
          const data = await fetchUserData(user.uid);
          store.commit('SET_USER_DATA', data);
          router.push('/dashboard');
        } catch (err) {
          error.value = err.message;
        } finally {
          loading.value = false;
        }
      };
  
      return { email, password, role, error, loading, register };
    }
  };
  </script>
  
  <style scoped>
  .auth-container {
    max-width: 400px;
    margin: auto;
    padding: 2rem;
  }
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>