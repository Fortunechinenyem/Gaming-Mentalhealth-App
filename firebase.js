import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOsyTgVsn5G-4e-jxa5a0LMr-uXQXp2FU",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "mentalhealthapp-c0a70",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "384219487549",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};
