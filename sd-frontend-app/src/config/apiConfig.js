import { Platform } from 'react-native';

const ip_address = "192.168.178.33";

export const BASE_URL =
  Platform.OS === 'ios' || Platform.OS === 'android'
    ? 'http://' + ip_address + ':4848/api/'
    : 'http://localhost:4848/api/';