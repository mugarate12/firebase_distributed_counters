import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// console.log(`
//   apiKey: ${process.env.apiKey},
//   authDomain: ${process.env.authDomain},
//   projectId: ${process.env.projectId},
//   storageBucket: ${process.env.storageBucket},
//   messagingSenderId: ${process.env.messagingSenderId},
//   appId: ${process.env.appId},
//   measurementId: ${process.env.measurementId}
// `);

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
}

export const app = initializeApp(firebaseConfig)
export const database = getFirestore(app)
