import { database } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ref, get, set, update} from "firebase/database";

// updateProfile Function
const updateProfile = async (name) => {
    try {
        const userUID = await AsyncStorage.getItem('userUID');
        const userRef = ref(database, `users/${userUID}`);
    } catch (error) {
        
    }
};