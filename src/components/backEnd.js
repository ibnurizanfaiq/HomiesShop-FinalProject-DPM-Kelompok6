import { authentication, database } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';


// signUp Function
export const signupUser = async (name, phone, email, password, date, gender, role, balance, create_at, update_at) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
        const uid = userCredential.user.uid;

        const userRef = ref(database, `users/${uid}`);
        await set(userRef, {
            uid, 
            name,
            email,
            phone,
            date,
            gender,
            role,
            balance,
            create_at,
            update_at,
        });

        return {success: true, message: "Selamat Pendaftaran Berhasil"};
        
    } catch (error) {
      let errorMessage = "gagal";
        if (error.code === "auth/email-already-in-use") {
          return {success: false, message: "Email sudah terdaftar."};
          } else if (error.code === "auth/weak-password") {
            return {success: false, message: "Password terlalu lemah. Minimal 6 karakter."};
          } else if (error.code === "auth/invalid-email") {
            return {success: false, message: "Format email tidak valid."};
          }
          throw new Error(errorMessage);
    }
};


// logIn Function
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(authentication, email, password);
        const uid = userCredential.user.uid;
        
        const userRef = ref(database, `users/${uid}`);
        
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists) {
            const userData = userSnapshot.val();
            await AsyncStorage.setItem('userUID', uid);
            await AsyncStorage.setItem('Role', userData.role);
            return { success: true, message: "Login berhasil!"};
        }else{
            throw new Error("Data pengguna tidak ditemukan di database.");
        }

    } catch (error) {
        let errorMessage = "Login gagal.";
      throw new Error(errorMessage);
    }
};


// Check LoginUser and Role User
export const checkLoginStatus = async () => {
    try {
      const uid = await AsyncStorage.getItem('userUID');
      const role = await AsyncStorage.getItem('Role');
      if (uid  && role) {
        console.log("Pengguna sudah login dengan UID:", uid, role);
        return { success: true, uid , role};
      } else {
        console.log("Pengguna belum login.");
        return { success: false };
      }
    } catch (error) {
      console.error("Gagal mengecek status login:", error);
      return { success: false };
    }
  };


// logOut User and Admin
export const logoutUser = async () => {
  try {
    await signOut(authentication);
    await AsyncStorage.removeItem('userUID'); 
    await AsyncStorage.removeItem('Role');
    return { success: true, message: "Logout Berhasil" };
  } catch (error) {
      console.log("Gagal Logout", error);
      throw new Error("Gagal Logout");
  }
};