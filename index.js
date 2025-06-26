// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUPBYaLZv6_6lOQtSs6GbtxZTBQHMc9hI",
  authDomain: "block-lend.firebaseapp.com",
  projectId: "block-lend",
  storageBucket: "block-lend.firebasestorage.app",
  messagingSenderId: "757464182238",
  appId: "1:757464182238:web:39bb40b8884c8f3eb2014f",
  measurementId: "G-8EC069VKM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);