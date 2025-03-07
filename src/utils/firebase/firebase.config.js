import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";
import { getFirestore} from "firebase/firestore"

const { SC_FIREBASE_API_KEY, SC_FIREBASE_AUTH_DOMAIN, SC_FIREBASE_PROJECT_ID, SC_FIREBASE_STORAGE_BUCKET, SC_FIREBASE_MESSAGING_SENDER_ID, SC_FIREBASE_APP_ID } = import.meta.env;

const firebaseConfig = {
    apiKey: SC_FIREBASE_API_KEY,
    authDomain: SC_FIREBASE_AUTH_DOMAIN,
    projectId: SC_FIREBASE_PROJECT_ID,
    storageBucket: SC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: SC_FIREBASE_MESSAGING_SENDER_ID,
    appId: SC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

const imgDB = getStorage(app)
const txtDB = getFirestore(app)

export {imgDB, txtDB}