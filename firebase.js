
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiRzE00LCR0_pJhIsxTHdV4OMy2_xcuvw",
  authDomain: "edu-project-f2bb3.firebaseapp.com",
  projectId: "edu-project-f2bb3",
  storageBucket: "edu-project-f2bb3.firebasestorage.app",
  messagingSenderId: "824073802332",
  appId: "1:824073802332:web:0965ddaf82e964c9d60c99",
  measurementId: "G-2T33TLS1YD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);