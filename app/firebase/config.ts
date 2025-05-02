import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6evFwQAeggzt3jAAViV2BYfoOGaL_hOc",
  authDomain: "safisaana-aa5f4.firebaseapp.com",
  projectId: "safisaana-aa5f4",
  storageBucket: "safisaana-aa5f4.firebasestorage.app",
  messagingSenderId: "440479928975",
  appId: "1:440479928975:web:6dcbed8177211f09ed56fa"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 