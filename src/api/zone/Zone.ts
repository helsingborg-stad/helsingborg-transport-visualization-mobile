import { User } from '@src/context/auth/AuthTypes';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '@src/utils/Constants';
import { Zones } from '@src/modules/home/types';
import { EventRequestType } from '../types';

export const getAllZones = () => {
  return new Promise(async (resolve, reject) => {
    const url = BASE_URL + '/zones';
    const token = await getUserToken();

    if (!token) reject('token not found');

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then((res: Zones) => {
        resolve(res);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const postEvent = (id: string, request: EventRequestType) => {
  return new Promise(async (resolve, reject) => {
    const url = BASE_URL + `/zones/${id}/events`;
    const token = await getUserToken();

    if (!token) reject('token not found');

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then((res) => {
        resolve(res);
      })
      .catch(function (error) {
        console.log('-------->ERROR', error);
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
