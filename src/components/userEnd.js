import { database } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ref, get, update, remove} from "firebase/database";

//getAllUser function
export const getAllUser = async () => {
    try {
        const allref = ref(database, `users`);
        const getUsers = await get(allref);

        if (getUsers.exists) {
            return{success: true, data: getUsers.val()}
        }
    } catch (error) {
        
    }
};


//getAllUser function
export const getUserid = async () => {
    try {
        const uid = await AsyncStorage.getItem('userUID');
        
        const allref = ref(database, `users/${uid}`);
        const getUsers = await get(allref);

        if (getUsers.exists) {
            return{success: true, data: getUsers.val()}
        }
    } catch (error) {
        return{success: false};
    }
};

//DeleteUser function
export const deleteUser = async (uid) => {
    try {
        const allref = ref(database, `users/${uid}`);
        await remove(allref);

        return{success: true}

    } catch (error) {
        
    }
};

// getSaldo User function
export const getSaldoUser = async () => {
   const uid = await AsyncStorage.getItem('userUID');
    try {
        const saldoref = ref(database, `users/${uid}`);
        const snapshot =await get(saldoref);

        if (snapshot.exists) {
            const data = snapshot.val();
            return{success: true, saldo: data.balance};
        }
    } catch (error) {
        return{success: false}
    }
}

// getSaldoid User function
export const getSaldoUserid = async (uid) => {
     try {
         const saldoref = ref(database, `users/${uid}`);
         const snapshot = await get(saldoref);
 
         if (snapshot.exists) {
             const data = snapshot.val();
             return{success: true, saldo: data.balance };
         }
     } catch (error) {
         return{success: false}
     }
 }

// update saldo
export const updateSaldoUser = async (uid, balance) => {
     try {
         const saldoref = ref(database, `users/${uid}`);
         await update(saldoref, {
            balance
         });
             return{success: true}
     } catch (error) {
         return{success: false}
     }
 }

 // update saldo by id
export const updateSaldoUserid = async (price) => {
    try {
        const uid = await AsyncStorage.getItem('userUID');
        const saldo = await getSaldoUser();
        const balance = parseInt(saldo.saldo) - price;
        balance.toLocaleString();

        const saldoref = ref(database, `users/${uid}`);
        await update(saldoref, {
           balance
        });

        return{success: true}
    } catch (error) {
        return{success: false}
    }
}