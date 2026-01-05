
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSoV1SsHB-0Ue-OcWXhh41lbek4URuHAg",
  authDomain: "anandpandeyindia.firebaseapp.com",
  databaseURL: "https://anandpandeyindia-default-rtdb.firebaseio.com",
  projectId: "anandpandeyindia",
  storageBucket: "anandpandeyindia.firebasestorage.app",
  messagingSenderId: "1080997825126",
  appId: "1:1080997825126:web:4e2508acd6b5ad17983ba7",
  measurementId: "G-86TZWEFCFL"
};

const app = initializeApp(firebaseConfig);

// Improved Firestore initialization with persistent local cache
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
