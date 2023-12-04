import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAV3Y9W0KFhYQLXJMmNEonKS0VTo5cFYsc",
  authDomain: "uber-91968.firebaseapp.com",
  projectId: "uber-91968",
  storageBucket: "uber-91968.appspot.com",
  messagingSenderId: "755157225371",
  appId: "1:755157225371:web:1e1e1b58b2c6c7ecfb5b3e",
  measurementId: "G-E59VSBN8FS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export { app, provider, auth };
