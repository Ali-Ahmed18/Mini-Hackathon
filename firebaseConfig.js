 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
 import { getAuth ,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
 import { getFirestore , doc, setDoc, getDoc,collection, addDoc, getDocs, deleteDoc, updateDoc, serverTimestamp, query, orderBy} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
 import { getStorage ,ref, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyAoyfKo61wW5tuzJ1RBDDTyw58d4lqiIyA",
   authDomain: "mini-hackathon-f354f.firebaseapp.com",
   projectId: "mini-hackathon-f354f",
   storageBucket: "mini-hackathon-f354f.appspot.com",
   messagingSenderId: "979421976353",
   appId: "1:979421976353:web:9077ddb0fe7dc76c021060"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  
  export {
    app ,
    auth,
    createUserWithEmailAndPassword,
    db ,
    doc , 
    setDoc,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    getDoc,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    serverTimestamp,
    query,
    orderBy,
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} 