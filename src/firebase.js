import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBYKnJ-Bcp8Uoe2n3Z_M9t-y_25_zeZXgw",
    authDomain: "finance-app-523c5.firebaseapp.com",
    projectId: "finance-app-523c5",
    storageBucket: "finance-app-523c5.appspot.com",
    messagingSenderId: "787147224632",
    appId: "1:787147224632:web:10deb5631bd877156958cd",
    measurementId: "G-8YMQFMKN06"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

