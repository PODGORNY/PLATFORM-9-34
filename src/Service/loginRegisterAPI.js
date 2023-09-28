import axios from 'axios';

//import { setLogged, setUser, setErrorState } from '../store/action';

// шаблон запроса...pattern request
export const patternAxios = axios.create({
  baseURL: 'https://blog.kata.academy/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${localStorage.getItem('token')}`,
  },
});

// регистрация пользователя
export const signUp = async (dataUser) => {
  const res = await patternAxios.post('users', dataUser);
  return res;
};

// логин
export const signIn = async (dataUser) => {
  const res = await patternAxios.post('users/login', dataUser);
  return res;
};

// проверка авторизации
export const checkAuth = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://blog.kata.academy/api/user/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => response.json())
        .then((body) => {
          dispatch(setLogged(true));
          dispatch(setErrorState(''));
          dispatch(setUser(body.user));
        });
    } else return;
  } catch (error) {
    dispatch(setErrorState(error));
  }
};

// обновление пользователя - отправка редактированных данных на сервер
export const updateUser = async (dataUser) => {
  const res = await patternAxios.put('user', dataUser);
  return res;
};

// выход из системы
export const setlogOut = () => async (dispatch) => {
  try {
    localStorage.removeItem('token');
    dispatch(setUser({}));
    dispatch(setLogged(false));
    dispatch(setErrorState(''));
  } catch (error) {
    dispatch(setErrorState(error));
  }
};
