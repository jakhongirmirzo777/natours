/* eslint-disable */
import axios from 'axios';

export const login = async (email, password) => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const logout = async (email, password) => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: '/api/v1/users/logout',
    });
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
};
