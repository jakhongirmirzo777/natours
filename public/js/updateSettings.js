/* eslint-disable */
import axios from 'axios';

export const updateSettings = async (formData, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/update-password'
        : 'http://localhost:3000/api/v1/users/update-me';
    const { data } = await axios.patch(url, formData, {
      withCredentials: true,
    });
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};
