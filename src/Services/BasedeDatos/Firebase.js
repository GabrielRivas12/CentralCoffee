// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHwgy38U17q0XNGMi3W0JZHC5iq_2pgAU",
  authDomain: "centralcoffee-2910d.firebaseapp.com",
  projectId: "centralcoffee-2910d",
  storageBucket: "centralcoffee-2910d.firebasestorage.app",
  messagingSenderId: "958973898936",
  appId: "1:958973898936:web:5eea29827d599de35b444d"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;
const auth = getAuth(appFirebase);
export { auth };