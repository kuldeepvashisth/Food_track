// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "food-track-app-d9932.firebaseapp.com",
  projectId: "food-track-app-d9932",
  storageBucket: "food-track-app-d9932.firebasestorage.app",
  messagingSenderId: "956545829284",
  appId: "1:956545829284:web:08dcc14aaf113f45df5931"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);//is app pr auth krna hai
export {app,auth}