import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/apiConfig';
import { isTokenExpired } from '../utils/isAuth';

// create api
const api = axios.create({
    baseURL: BASE_URL,
});

// add token to authorization
api.interceptors.request.use(async (config) => {
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

// get my model
export const getMyModel = async () => {
    try {
        const response = await api.get("models/myModel");
        return response.data;
    } catch (error) {
        console.log("Error by getting my model: ", error.response.data);
        throw error;
    }
};

// create new image
export const createModel = async (files, category, type) => {
    try {
        const data = new FormData();

        files.forEach((file) => data.append('files', file));
        data.append('category', category);
        data.append('type', type);

        const requestOptions = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }

        console.log(data);

        const response = await api.post("models", data, requestOptions);
        console.log(response.data);

        return response;
    } catch (error) {
        console.log("Error by creating model: ", error.response ? error.response.data.error : error);
        throw error;
    }
};

// delete model
export const deleteModel = async (modelId) => {
    try {
        const response = await api.delete(`models/${modelId}`);
        return response;
    } catch (error) {
        throw error;
    }
};