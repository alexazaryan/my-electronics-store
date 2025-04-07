import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { FIREBASE_CONFIG } from "./config";

const app = initializeApp(FIREBASE_CONFIG);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const database = getDatabase(app);

const onAuthStateChangedListener = (callback) => {
   return onAuthStateChanged(auth, callback);
};

export {
   db,
   storage,
   auth,
   database,
   doc,
   getDoc,
   setDoc,
   onAuthStateChangedListener,
};
