import { Platform } from 'react-native';

export const BASE_URL =
  Platform.OS === 'ios'
    ? 'http://localhost:4848/api/'
    : 'http://127.0.0.1:4848/api/';