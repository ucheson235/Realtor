// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAO8f7Hi06G_zumlHzdUamizGWvfSosZCY",
  authDomain: "realtor-react-15c21.firebaseapp.com",
  projectId: "realtor-react-15c21",
  storageBucket: "realtor-react-15c21.firebasestorage.app",
  messagingSenderId: "296465955610",
  appId: "1:296465955610:web:e111a326605366dffb4aa3"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()