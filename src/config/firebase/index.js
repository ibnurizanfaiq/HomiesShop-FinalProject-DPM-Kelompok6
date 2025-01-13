import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {APIKEY, AUTHDOMAIN,DATABASEURL,PROJECTID,STORAGEBUCKET,APPID,MEASUREMENTID,MESSAGINGSENDERID} from "@env";



const firebaseConfig = {
      apiKey: APIKEY,
      authDomain: AUTHDOMAIN,
      databaseURL: DATABASEURL,
      projectId: PROJECTID,
      storageBucket: STORAGEBUCKET,
      appId: APPID,
      measurementId: MEASUREMENTID,
      messagingSenderId: MESSAGINGSENDERID
    };

  const app = initializeApp(firebaseConfig);

  const auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

  export const database = getDatabase(app);
  export const authentication = auth;