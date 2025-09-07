import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "logiflow-8oju4",
  appId: "1:719952558782:web:dc7dddf4ec6ba35baf7cef",
  storageBucket: "logiflow-8oju4.firebasestorage.app",
  apiKey: "AIzaSyDxS__aq2vbL6mSV4xsaLWnWCh7oyFu8EE",
  authDomain: "logiflow-8oju4.firebaseapp.com",
  messagingSenderId: "719952558782",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
