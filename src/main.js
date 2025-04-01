// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Import Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Ton config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAJkC8uFqV0TcFXgJRGQVZvSmrPAxfXS2c",
  authDomain: "queue-up-8fb9f.firebaseapp.com",
  projectId: "queue-up-8fb9f",
  storageBucket: "queue-up-8fb9f.appspot.com",
  messagingSenderId: "469020385378",
  appId: "1:469020385378:web:7107de25ae476145e7b13b",
  measurementId: "G-S9YWTSDFLX"
};

// 1. Initialise Firebase
const firebaseApp = initializeApp(firebaseConfig);
getAnalytics(firebaseApp);

// 2. Utilise getAuth() APRES initializeApp()
const auth = getAuth(firebaseApp);

let app;

onAuthStateChanged(auth, async (user) => {
  store.commit('SET_USER', user);

  if (user) {
    await store.dispatch('getUserData', user.uid);
  }

  store.commit('SET_AUTH_IS_READY', true);

  if (!app) {
    app = createApp(App);
    app.use(router);
    app.use(store);
    app.mount('#app');
  }
});