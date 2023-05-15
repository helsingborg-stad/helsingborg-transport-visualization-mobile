import { User } from '@src/context/auth/AuthTypes';
import * as SecureStore from 'expo-secure-store';

const baseUrl =
  'https://helsingborg-transport-visualization-backend-3ca3faqvfa-lz.a.run.app';

export const getAllZones = () => {
  return new Promise(async (resolve, reject) => {
    const url = baseUrl + '/zones';
    const token = await getUserToken();

    if (!token) reject('token not found');

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authentication: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          reject(res.status);
        }
        return res.json();
      })
      .then((res) => {
        resolve(res);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

const getUserToken = async () => {
  let user: User = null;
  const userStr = await SecureStore.getItemAsync('user');
  if (!userStr) return null;
  user = JSON.parse(userStr);
  return user.token;
};
