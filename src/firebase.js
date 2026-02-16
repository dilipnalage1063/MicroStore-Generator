import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase Configuration
 * NOTE: Replace these placeholder values with your actual Firebase project settings.
 * You can find these in the Firebase Console: Project Settings > General > Your apps.
 */
const firebaseConfig = {
  apiKey: "AIzaSyAd62-PMKlml1rDNiT79NVJAYLHJmgEcbs",
  authDomain: "microstore-generator.firebaseapp.com",
  projectId: "microstore-generator",
  storageBucket: "microstore-generator.firebasestorage.app",
  messagingSenderId: "625048784862",
  appId: "1:625048784862:web:91b1ff4901b6be51a9574f",
  measurementId: "G-T9N72NWTC9"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore (Cloud Database)
const db = getFirestore(app);

export { db };
