// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "e-commerce-web-app-c7552.firebaseapp.com",
  projectId: "e-commerce-web-app-c7552",
  storageBucket: "e-commerce-web-app-c7552.appspot.com",
  messagingSenderId: "388984591126",
  appId: "1:388984591126:web:518c482cc93ed5b007f637",
  measurementId: "G-FZMTWNV905",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
