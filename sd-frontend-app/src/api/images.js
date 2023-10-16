import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/apiConfig';
import { isTokenExpired } from '../utils/isAuth';

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use( async (config) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));

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

export const getMyImages = async () => {
    try {
        const response = await api.get("images/myImages");
        return response.data;
    } catch (error) { 
        console.log("Error by getting my info: ", error);
        throw error;
    }
};
