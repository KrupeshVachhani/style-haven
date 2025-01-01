import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQJrwSpRt-ysA9MfAh2veKu0BZ9AIrSMU",
  authDomain: "salon-application-b72fb.firebaseapp.com",
  projectId: "salon-application-b72fb",
  storageBucket: "salon-application-b72fb.appspot.com",
  messagingSenderId: "1017956179412",
  appId: "1:1017956179412:web:24f14f0b6d1965c5074a41",
  measurementId: "G-2HSPSE0PDG",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
