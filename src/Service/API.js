import axios from 'axios';

// получение полной статьи с сервера
export const fullArticleAPI = async (slug) => {
  try {
    const response = await axios.get(`https://blog.kata.academy/api/articles/${slug}`);
    return response.data.article;
  } catch (error) {
    throw new Error(error);
  }
};

// получение количества статей с сервера
export const allArticle = async () => {
  try {
    const response = await axios.get('https://blog.kata.academy/api/articles?limit=5&offset=5');
    return response.data.articleCount;
  } catch (error) {
    throw new Error(error.response.data.errors);
  }
};

// регистрация пользователя - отправка его данных на сервер
export const registerUser = async (userData) => {
  try {
    const response = await axios.post('https://blog.kata.academy/api/users', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.errors);
  }
};

// получение данных пользователя с сервера
export const userDataAPI = async (token) => {
  try {
    const response = await axios.get('https://blog.kata.academy/api/user', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    throw new Error(error.response.data.errors);
  }
};

// обновление пользователя - отправка редактированных данных на сервер
export const updateUserProfile = async (userData, token) => {
  try {
    const response = await axios.put('https://blog.kata.academy/api/user', userData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.errors);
  }
};
