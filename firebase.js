// Import the functions you need from the SDKs you need
import {
  initializeApp
} from "firebase/app";
import {
  getFirestore
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4q-5XXBkAAhO1hOgGaCXmBe1eCViQOWk",
  authDomain: "inventory-management-d1e24.firebaseapp.com",
  projectId: "inventory-management-d1e24",
  storageBucket: "inventory-management-d1e24.appspot.com",
  messagingSenderId: "90448108820",
  appId: "1:90448108820:web:c5ffdb730fa99986bbf601",
  measurementId: "G-KS5Z3V4S95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}