import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6UiPmUjlwxpsXzQyTZsvoi2doJR_u5X4",
  authDomain: "smart-negotiation-hub.firebaseapp.com",
  projectId: "smart-negotiation-hub",
  storageBucket: "smart-negotiation-hub.firebasestorage.app",
  messagingSenderId: "826302504404",
  appId: "1:826302504404:web:d093ddbc3b8283c6664a41",
  measurementId: "G-BX8Z4KDXCX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);