import client from '@src/api/AxiosInstance';
import { LoginRequest, LoginResponse } from '@src/api/types';
import Constants from 'expo-constants';

export const login = async (request: LoginRequest) => {
  const url = Constants.expoConfig.extra?.API_URL + '/auth/login';
  const { data } = await client.post<LoginResponse>(url, request);
  return data;
};
