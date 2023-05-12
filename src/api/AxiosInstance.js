/* eslint-disable no-underscore-dangle */
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const URL = Constants.expoConfig.extra?.API_URL + '/auth/login';

const getUserCredentials = async () => {
  const user = await SecureStore.getItemAsync('user');

  if (user) {
    return user;
  }
  return null;
};

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
  const userCred = await getUserCredentials();
  if (error.response && userCred) {
    if (
      error.response.data.message === 'Token expired.' &&
      !originalConfig._retry
    ) {
      originalConfig._retry = true;

      return client
        .post(URL, {
          identifier: userCred.orgNumber,
          pinCode: userCred.pinCode,
        })
        .then(async (response) => {
          console.log('Axios Instace response', response);
          // const newToken = response.data.token;
          // const token = await SecureStore.getItemAsync('token');
          // if (token) {
          //   await SecureStore.setItemAsync('token', newToken);
          // }
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
