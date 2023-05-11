/* eslint-disable no-underscore-dangle */
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

//TODO: we dont need Refresh Login Logic for this MVP
// Read the SecureStorage for organization and pin and
// Login back the user

const URL = 'CHANGE ME';

const client = axios.create({
  baseURL: Constants?.expoConfig?.extra?.API_URL,
});

client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return config;
});

client.interceptors.response.use(undefined, async (error) => {
  const originalConfig = error.config;
  if (error.response) {
    if (
      error.response.data.message === 'Token expired.' &&
      !originalConfig._retry
    ) {
      originalConfig._retry = true;

      return client
        .post(URL)
        .then(async (response) => {
          const newToken = response.data.token;
          const token = await SecureStore.getItemAsync('token');
          if (token) {
            await SecureStore.setItemAsync('token', newToken);
          }
          return client(originalConfig);
        })
        .catch(async () => {
          await SecureStore.deleteItemAsync('token');
        });
    }
  }
  return Promise.reject(error);
});

export default client;
