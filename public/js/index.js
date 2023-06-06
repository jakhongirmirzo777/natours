/* eslint-disable */
import Cookies from 'js-cookie';
import { showAlert } from './alert';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

const loginForm = document.querySelector('#login-form');
const userDataForm = document.querySelector('#credentials-form');
const passwordForm = document.querySelector('#password-form');
const logoutBtn = document.querySelector('#logout-btn');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    try {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const { data } = await login(email, password);
      showAlert('success', 'Logged in successfully!');
      Cookies.set('jwt', data.token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
      window.setTimeout(() => location.assign('/'), 0);
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    try {
      e.preventDefault();
      const form = new FormData();
      const photo = document.getElementById('photo').files[0];
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      form.append('name', name);
      form.append('email', email);
      form.append('photo', photo);

      await updateSettings(form, 'data');
      showAlert('success', 'Data updated successfully!');
      location.reload();
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    try {
      e.preventDefault();
      document.getElementById('btn-save-password').textContent = 'Updating...';
      const current_password =
        document.getElementById('password-current').value;
      const new_password = document.getElementById('password').value;
      const new_password_confirm =
        document.getElementById('password-confirm').value;
      const { data } = await updateSettings(
        { current_password, new_password, new_password_confirm },
        'password'
      );
      Cookies.set('jwt', data.token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
      showAlert('success', 'Password updated successfully!');

      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
      document.getElementById('btn-save-password').textContent =
        'Save password';
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await logout();
      showAlert('success', 'Logged out successfully!');
      Cookies.remove('jwt');
      location.reload(true);
    } catch (err) {
      showAlert('error', 'Error logging out! Try again.');
    }
  });
}
