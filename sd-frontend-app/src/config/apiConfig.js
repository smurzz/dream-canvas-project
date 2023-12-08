import { Platform } from 'react-native';

export const BASE_URL =
  Platform.OS === 'ios'
    ? 'http://192.168.178.33:4848/api/'
    : 'http://localhost:4848/api/';