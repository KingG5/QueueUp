// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJkC8uFqV0TcFXgJRGQVZvSmrPAxfXS2c",
  authDomain: "queue-up-8fb9f.firebaseapp.com",
  projectId: "queue-up-8fb9f",
  storageBucket: "queue-up-8fb9f.firebasestorage.app",
  messagingSenderId: "469020385378",
  appId: "1:469020385378:web:7107de25ae476145e7b13b",
  measurementId: "G-S9YWTSDFLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };