import { database } from "../config/firebase";
import {ref, set, get, update, remove } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

// addDataOrder function
export const addOrder = async (name, orderId,noCustomer, idproduct, status, message, sn, sign, price ) => {
    try {
        const uid = await AsyncStorage.getItem('userUID'); 
        const create_at = new Date().toLocaleString();
        const update_at = create_at;
        const orderRef = ref(database, `orders/${uid}/${orderId}`);
        await set(orderRef, {
            orderId,
            name,
            uid,
            idproduct,
            noCustomer,
            status,
            message,
            sn,
            sign,
            price,
            create_at,
            update_at
        });

        return{success: true, message: " Order Berhasil Sedang Diproses !! "};
    } catch (error) {
        return {success: false, message: "Order Gagal DiProses "}
    }
};

// getOrder
export const getOrder = async () => {
    try {
        const uid = await AsyncStorage.getItem('userUID');
        if (!uid) {
            throw new Error("User UID tidak ditemukan");
        }

        const orderRef = ref(database, `orders/${uid}`);
        const snapshot = await get(orderRef);

        if (snapshot.exists()) {
            const Data = snapshot.val();
  
            return { success: true, data: Data };
        } else {
            return { success: false, message: "Order tidak ditemukan" };
        }
    } catch (error) {
        return { success: false, message: error.message || "Gagal mengambil data order" };
    }
};

// getOrder
export const getOrderNoId = async () => {
    try {
        const orderRef = ref(database, `orders`);
        const snapshot = await get(orderRef);

        if (snapshot.exists()) {
            const Data = snapshot.val();
  
            return { success: true, data: Data };
        } else {
            return { success: false, message: "Order tidak ditemukan" };
        }
    } catch (error) {
        return { success: false, message: error.message || "Gagal mengambil data order" };
    }
};

// updateStatus

export const updateStatus = async (ref_id, status, sn, message) => {
    try {
        const uid = await AsyncStorage.getItem('userUID');
        if (!uid) {
            throw new Error("User UID tidak ditemukan");
        }
        const orderRef = ref(database, `orders/${uid}/${ref_id}`);
        await update(orderRef,{
            status,
            sn,
            message
        });
    } catch (error) {
        
    }
    
};

// topupRequest function
export const topupRequest = async (nominal, idtopup) => {
    try {
        const now = new Date();
        const create_at = now.getFullYear() * 10000000000 + (now.getMonth() + 1) * 100000000 + now.getDate() * 1000000 + now.getHours() * 10000 + now.getMinutes() * 100 + now.getSeconds();
        const uid = await AsyncStorage.getItem('userUID');
        const Status = 'Pending';
        const topupRef = ref(database, `topupRequest/${uid}/${idtopup}`);
        await set(topupRef,{
            uid,
            idtopup,
            nominal,
            Status,
            create_at
        })
        return{success: true};
    } catch (error) {
        return{success: false, message: "Gagal Melakukan TopUp"};
    }
};

// deleteRequest function
export const deleteRequest = async (idtopup) => {
    try {
        const uid = await AsyncStorage.getItem('userUID');
        const topupRef = ref(database, `topupRequest/${uid}/${idtopup}`);
        await remove(topupRef);
        return{success: true};
    } catch (error) {
        return{success: false, message: "Gagal Melakukan TopUp"};
    }
};

// deleteRequestid function
export const deleteRequestid = async (idtopup, uid) => {
    try {
        const topupRef = ref(database, `topupRequest/${uid}/${idtopup}`);
        await remove(topupRef);
        return{success: true};
    } catch (error) {
        return{success: false, message: "Gagal Melakukan TopUp"};
    }
};

// getRequest
export const getRequest = async () => {
    try {
        const topupRef = ref(database, `topupRequest`);
        const result = await get(topupRef);
        const Data = result.val();
        return{success: true, data: Data};
    } catch (error) {
        return{success: false, message: "Gagal Ambil Data"};
    }
};

// getRequestbyid
export const getRequestid = async () => {
    try {
        const uid = await AsyncStorage.getItem('userUID');
        
        const topupRef = ref(database, `topupRequest/${uid}`);
        const result = await get(topupRef);

        const Data = result.val();

        return{success: true, data: Data};
    } catch (error) {
        return{success: false, message: "Gagal Ambil Data"};
    }
};

// updateRequest
export const updateRequest = async (uid, idtopup) => {
    try {
        const Status = "Sukses";
        const topupRef = ref(database, `topupRequest/${uid}/${idtopup}`);
        await update(topupRef,{
            Status
        })
        return{success: true};
    } catch (error) {
        return{success: false, message: "Gagal Melakukan TopUp"};
    }
};




