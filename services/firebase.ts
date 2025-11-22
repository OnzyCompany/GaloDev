import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCowE9pgG4rfh5N9L8Gja7aUGKDKeGM6q4",
  authDomain: "galodev-fb783.firebaseapp.com",
  projectId: "galodev-fb783",
  storageBucket: "galodev-fb783.firebasestorage.app",
  messagingSenderId: "853597359630",
  appId: "1:853597359630:web:e5e8f63cd536e768c1f65f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);