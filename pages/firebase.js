
// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB7sCUgP8jOJoHTb4MLXLhrizWc6MwvstY",
authDomain: "login-form-fccb4.firebaseapp.com",
projectId: "login-form-fccb4",
storageBucket: "login-form-fccb4.appspot.com",
messagingSenderId: "155329786121",
appId: "1:155329786121:web:e5854a92019d6f1cc823d8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

