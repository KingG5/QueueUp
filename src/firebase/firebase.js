// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAJkC8uFqV0TcFXgJRGQVZvSmrPAxfXS2c',
  authDomain: 'queue-up-8fb9f.firebaseapp.com',
  projectId: 'queue-up-8fb9f',
  storageBucket: 'queue-up-8fb9f.appspot.com',
  messagingSenderId: '469020385378',
  appId: '1:469020385378:web:7107de25ae476145e7b13b'
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };