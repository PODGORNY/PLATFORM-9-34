// часть(slice) редуктора для авторизации и регистрации пользователя
// createSlice - берёт редуктор и его стейт и создаёт Часть редуктора...чтобы configureStore собрал
// createAsyncThunk - встроенный thunk
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// плагин запросов к API
import axios from 'axios';

// API------------------------------------------------------запросы на сервер

// авторизация на сервере...отправка логина, получение токена на вход
export const authAPI = createAsyncThunk('auth/authAPI', async (userData) => {
  const response = await axios.post('https://blog.kata.academy/api/users/login', userData);
  localStorage.setItem('token', response.data.user.token);
  localStorage.setItem('data', JSON.stringify(response.data));
  return response.data;
});

// регистрация на сервере
export const registerAPI = createAsyncThunk('auth/registerAPI', async (userData) => {
  try {
    const response = await axios.post('https://blog.kata.academy/api/users', userData);
    localStorage.setItem('token', response.data.user.token);
    localStorage.setItem('data', JSON.stringify(response.data));
    return response.data;
  } catch (e) {
    throw new Error('request error');
  }
});

// добавить регистрационные данные
export const editDataAPI = createAsyncThunk('auth/registerAPI', async (userData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('https://blog.kata.academy/api/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  localStorage.setItem('data', JSON.stringify(data));
  localStorage.setItem('image', JSON.stringify(data.user.image));
  return data;
});

// автоавторизация когда регистрировался ранее
export const initAuth = createAsyncThunk('auth/initAuth', async () => {
  const token = localStorage.getItem('token');
  if (token) {
    const response = await axios.get('https://blog.kata.academy/api/user', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    localStorage.setItem('data', JSON.stringify(response.data));
    return response.data;
  }
  return null;
});

//-------------------------------------------------------------------редуктор
const initialState = {
  data: null,
  status: 'loading',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logout: (state) => {
      state.data = null;
    },
    login: (state, action) => {
      state.data = action.payload;
      localStorage.setItem('data', JSON.stringify(action.payload));
      localStorage.setItem('token', action.payload.user.token);
    },
    edit: (state, action) => {
      state.data = action.payload;
      localStorage.setItem('data', JSON.stringify(action.payload));
      localStorage.setItem('image', JSON.stringify(action.payload.user.image));
    },
  },
  extraReducers: {
    [authAPI.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
    },
    [authAPI.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.data = action.payload;
    },
    [authAPI.rejected]: (state) => {
      state.status = 'rejected';
      state.data = null;
    },
    [registerAPI.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
    },
    [registerAPI.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.data = action.payload;
    },
    [registerAPI.rejected]: (state, action) => {
      state.status = 'rejected';
      state.data = null;
      state.error = action.payload;
    },
    [editDataAPI.pending]: (state) => {
      state.status = 'loading';
      state.data = null;
    },
    [editDataAPI.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.data = action.payload;
    },
    [editDataAPI.rejected]: (state) => {
      state.status = 'rejected';
      state.data = null;
    },
    [initAuth.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.data = action.payload;
    },
    [initAuth.rejected]: (state) => {
      state.status = 'rejected';
      state.data = null;
    },
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const { logout, login, edit } = authSlice.actions;
export default authSlice.reducer;
