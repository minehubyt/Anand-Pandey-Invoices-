
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  getFirestore,
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

// Singleton App Instance: Prevents "App already exists" errors during HMR
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with checks
let dbInstance;
try {
  // Try to initialize with custom settings (offline cache)
  // This throws if Firestore is already initialized on this app instance
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (error: any) {
  // If it's already initialized (e.g. via HMR or default init), fallback to getting the existing instance
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
