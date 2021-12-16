// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx2I0tLJ6GBAZtmd3-J_0g-K_Yufzgz3Y",
  authDomain: "tinder-4d5ab.firebaseapp.com",
  projectId: "tinder-4d5ab",
  storageBucket: "tinder-4d5ab.appspot.com",
  messagingSenderId: "976835916315",
  appId: "1:976835916315:web:8ab788cde6c183ec633ebe",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
export { auth, db };
