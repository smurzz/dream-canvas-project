import { Platform } from 'react-native';

import axios from "axios";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = Platform.OS === 'ios' ? 'http://localhost:4848/api/auth/' : 'http://127.0.0.1:4848/api/auth/';

export const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL + "login", {
            email,
            password,
        });

        if (response.data.token) {
            const token = response.data.token;
            const decodedToken = jwt_decode(token);
            const userEmail = decodedToken.email;

            await AsyncStorage.setItem("token", JSON.stringify(token));
            await AsyncStorage.setItem("email", JSON.stringify(userEmail));
        }
        /* var savedToken = await AsyncStorage.getItem("token");
        var savedEmail = await AsyncStorage.getItem("email");
        console.log(savedToken, savedEmail); */
        return response;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("email");
    } catch (error) {
        throw error;
    }
};

export const register = async (firstname, lastname, email, password) => {
    try {
        const response = await axios.post(API_URL + "signup", {
            firstname,
            lastname,
            email,
            password,
        });

        return response;
    } catch (error) {
        throw error;
    }
};
