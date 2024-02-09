import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuG6lfm4ZFaadkTSw5E5NfbRmYm2Ph1qA",
  authDomain: "discourse-e9aff.firebaseapp.com",
  projectId: "discourse-e9aff",
  storageBucket: "discourse-e9aff.appspot.com",
  messagingSenderId: "923534487620",
  appId: "1:923534487620:web:2f6770d605ccc3dcd40c11",
  measurementId: "G-Q1395E62Z1",
  databaseURL: "https://discourse-e9aff-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const providerGoogleAuth = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtDB = getDatabase(app);
