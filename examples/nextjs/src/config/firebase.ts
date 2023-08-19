// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlXJQmiDGeNUIvRlFV3xdoq0C33-KQ804",
  authDomain: "next-firebase-b9486.firebaseapp.com",
  projectId: "next-firebase-b9486",
  storageBucket: "next-firebase-b9486.appspot.com",
  messagingSenderId: "756492916853",
  appId: "1:756492916853:web:8bdd10e8455cde3a29803c",
  measurementId: "G-J7KQ8H5M17",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore, firebaseConfig };
