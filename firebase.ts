// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZo8eKhg9VjtaOV4vkuGeXzvSnwgF4HlE",
  authDomain: "burger-app-c9d80.firebaseapp.com",
  projectId: "burger-app-c9d80",
  storageBucket: "burger-app-c9d80.appspot.com",
  messagingSenderId: "596132058755",
  appId: "1:596132058755:web:2c9d40a6803757f39eedb6",
  baseUrl: "https://burger-app-c9d80-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const dbr = getDatabase(app);
export const storage = getStorage(app)