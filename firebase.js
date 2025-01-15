import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
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

export const registerUser = async (email, password, name) => {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (name) {
    await updateProfile(auth.currentUser, { displayName: name });
  }

  return userCredential;
};
export const loginUser = async (email, password) => {
  const auth = getAuth();
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};
