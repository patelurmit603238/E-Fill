// Firebase SDKs and Utility Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { getValidRedirectLink, redirect } from "../common/utils/urls.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-0S_V5I-o80ZLtziMDAdtQuj0-QiVzBU",
  authDomain: "device-streaming-bad3af12.firebaseapp.com",
  projectId: "device-streaming-bad3af12",
  storageBucket: "device-streaming-bad3af12.firebasestorage.app",
  messagingSenderId: "595148851060",
  appId: "1:595148851060:web:15c3e1055af4276d1b0e21",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth();
export const dBase = getDatabase();
export const storage = getStorage();
export const USERS = "users/";
export const KEYS = "keys/";
export const authStateListener = onAuthStateChanged;

// Logout Current User
export const logoutUser = async () => {
  try {
    await signOut(auth);
    const currentPath = getValidRedirectLink();
    redirect(currentPath);
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};

// Get User Details by UID from Database
export const getUserDetails = async (uid) => {
  const userRef = child(ref(dBase), `${USERS}${uid}`);
  try {
    const userCred = await get(userRef);
    if (userCred.exists()) {
      return userCred.val();
    } else {
      console.warn("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return null;
  }
};

// Unique ID (key) generator/updater
export const keyTracker = async (key) => {
  const keyRef = ref(dBase, `${KEYS}${key}`);
  try {
    const nextKeyRef = await get(keyRef);
    let nextKey = nextKeyRef.val();
    if (nextKey == null) nextKey = "01";
    await set(keyRef, generateKey(nextKey));
    return nextKey;
  } catch (error) {
    console.error("Error generating/updating key:", error.message);
    return null;
  }
};

// Generate the next unique key
export const generateKey = (value) => {
  let newId = value ? parseInt(value) + 1 : 1;
  return newId < 10 ? `0${newId}` : `${newId}`;
};
