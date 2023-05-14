import { LoginRequest } from '@src/api/types';

const baseUrl =
  'https://helsingborg-transport-visualization-backend-3ca3faqvfa-lz.a.run.app';

export const login = (request: LoginRequest) => {
  return new Promise((resolve, reject) => {
    const url = baseUrl + '/auth/login/';

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

  // const { data } = await client.post<LoginResponse>(
  //   url,
  //   JSON.stringify(request)
  // );

  // return data;
};

export const getOrganiztions = () => {
  return new Promise((resolve, reject) => {
    const url = baseUrl + '/organisations';

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
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

  // const { data } = await client.get<LoginResponse>(url);
  // return data;
};
