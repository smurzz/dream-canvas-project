import axios from "axios";
import { BASE_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: BASE_URL,
});

/* Add token to request */
api.interceptors.request.use(async (config) => {
    const token = JSON.parse(await AsyncStorage.getItem('token'));
    console.log(token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
},
    (error) => {
        console.log("Error by adding a token to headers: ", error);
        return Promise.reject(error);
    }
);

/* Get user by email */
export const getUserByEmail = async (email) => {
    try {
        const response = await api.get("users", { params: { email: email } });
        if (response.data) {
            const foundUser = response.data[0];
            return foundUser;
        }
        return null;
    } catch (error) {
        throw error;
    }
};

/* Update user data */
export const updateUser = async (userID, firstname, lastname, oldPassword, newPassword, confirmedPassword) => {
    try {
        const reqBody = { firstname, lastname, oldPassword, newPassword, confirmedPassword };
        const response = await api.put("users/" + userID, reqBody);
        return response;
    } catch (error) {
        throw error;
    }
};

/* Delete user by id */
export const deleteUserById = async (id) => {
    try {
        const response = await api.delete(`users/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};