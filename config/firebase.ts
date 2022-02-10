import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAiTWutWFzcSIYaeIVWiymogMkpO6N4Bgo",
  authDomain: "contadores-distribuidos.firebaseapp.com",
  projectId: "contadores-distribuidos",
  storageBucket: "contadores-distribuidos.appspot.com",
  messagingSenderId: "192057130172",
  appId: "1:192057130172:web:76b210c11c133d9b3d64b9",
  measurementId: "G-42QWMEM43D"
}

export const app = initializeApp(firebaseConfig)
export const database = getFirestore(app)
