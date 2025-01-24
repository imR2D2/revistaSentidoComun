import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";
import { getFirestore} from "firebase/firestore"

const { C27_FIREBASE_API_KEY, C27_FIREBASE_AUTH_DOMAIN, C27_FIREBASE_PROJECT_ID, C27_FIREBASE_STORAGE_BUCKET, C27_FIREBASE_MESSAGING_SENDER_ID, C27_FIREBASE_APP_ID } = import.meta.env;

const firebaseConfig = {
    apiKey: C27_FIREBASE_API_KEY,
    authDomain: C27_FIREBASE_AUTH_DOMAIN,
    projectId: C27_FIREBASE_PROJECT_ID,
    storageBucket: C27_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: C27_FIREBASE_MESSAGING_SENDER_ID,
    appId: C27_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

const imgDB = getStorage(app)
const txtDB = getFirestore(app)

export {imgDB, txtDB}