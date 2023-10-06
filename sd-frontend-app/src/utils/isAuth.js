import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../api/auth";

export const isTokenExpired = async () => {
    try {
        var savedToken = await AsyncStorage.getItem("token");
        if (savedToken) {
            const decodedToken = jwt_decode(savedToken);
            const tokenExp = decodedToken.exp;
            const expirationTime = (tokenExp * 1000) - 60000;
            const isExpired = Date.now() >= expirationTime;

            if (isExpired) await logout();

            console.log("Token is expired: ", isExpired);
            return isExpired;
        } else {
            return true;
        }
    } catch (error) {
        await logout();
        throw error;
    }
};