import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = { 
    apiKey : "AIzaSyDbaV5TZD3PWeAYu9tvfSSSuYosB6eX-_Y" , 
    authDomain : "devlink-761db.firebaseapp.com" , 
    projectId : "devlink-761db" , 
    storageBucket : "devlink-761db.firebasestorage.app" , 
    messagingSenderId : "1069828867633" , 
    appId : "1:1069828867633:web:4daeb4c8eaca67e190f710" , 
    measurementId : "G-P5N3469F3T" 
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
