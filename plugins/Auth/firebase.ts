import firebase from 'firebase'

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

export const db = firebase.firestore()

export default firebase
