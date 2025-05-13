import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfQpkiha2RW-fx_fx_9UT2ZSiaEXKIgbs",
  authDomain: "tradox-83898.firebaseapp.com",
  projectId: "tradox-83898",
  storageBucket: "tradox-83898.appspot.com",
  messagingSenderId: "329490063197",
  appId: "1:329490063197:web:67487cdace7b378c0012b4",
  measurementId: "G-G6NVFVYHV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app; 