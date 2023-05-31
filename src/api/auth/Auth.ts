import { LoginRequest, OrganisationResponse } from '@src/api/types';
import { BASE_URL } from '@src/utils/Constants';

export const login = (request: LoginRequest) => {
  return new Promise((resolve, reject) => {
    const url = BASE_URL + '/auth/login/';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
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
      .then((res: OrganisationResponse[]) => {
        // console.log('User', res);
        resolve(res);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const getOrganisations = () => {
  return new Promise((resolve, reject) => {
    const url = BASE_URL + '/organisations';

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
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
      .then((res) => {
        resolve(res);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
