
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// It's recommended to store this in environment variables for a real application
const firebaseConfig = {
    apiKey: "AIzaSyBFVHef0TP6yvATniYBuluUqM_AJSXaT8Y",
    authDomain: "marketing-camera-log.firebaseapp.com",
    databaseURL: "https://marketing-camera-log-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "marketing-camera-log",
    storageBucket: "marketing-camera-log.appspot.com",
    messagingSenderId: "1023342594751",
    appId: "1:1023342594751:web:c5c9c43fc0c3f9cd47540a",
    measurementId: "G-B8C0LF9G73"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
