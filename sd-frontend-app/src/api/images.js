import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/apiConfig';
import { isTokenExpired } from '../utils/isAuth';

// create api
const api = axios.create({
    baseURL: BASE_URL,
});

// add token to authorization
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

// get all generated images
export const getMyImages = async () => {
    try {
        const response = await api.get("images/myImages");
        return response.data;
    } catch (error) { 
        console.log("Error by getting my info: ", error);
        throw error;
    }
};

// create new image
export const generateImage = async (subject, artDirection, artist) => {
    try {
        const response = await api.post("images/txt2img", {
            subject,
            artDirection,
            artist
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Error by image generating: ", error.response ? error.response.data.error : error);
        throw error;
    }
};
