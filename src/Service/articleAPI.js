import axios from 'axios';

// токен авторизации из локала
import tokenIsLocal from './tokenIsLocal';

// создание новой статьи
export function newArticle(data) {
  const token = localStorage.getItem('token');
  const { title, body, description, tagList } = data;
  return fetch('https://blog.kata.academy/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      article: {
        title: title,
        description: description,
        tagList: tagList,
        body: body,
      },
    }),
  }).then((response) => response.json());
}

// удаление статьи
export const deleteArticle = async (slug) => {
  await axios.delete(`articles/${slug}`, { ...tokenIsLocal() }).catch((error) => {
    throw error;
  });
  return true;
};

// редактирование статьи
export function editArticle(slug, data) {
  const token = localStorage.getItem('token');
  const { title, body, description, tagList } = data;
  return fetch(`https://blog.kata.academy/api/articles/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      article: {
        title: title,
        description: description,
        tagList: tagList,
        body: body,
      },
    }),
  }).then((response) => response.json());
}

// получение статьи с сервера
export function getArticle(slug) {
  const token = localStorage.getItem('token');
  return fetch(`https://blog.kata.academy/api/articles/${slug}`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}

// получение количества статей с сервера
export const getArticleList = async (offset = 0, limit = 5) => {
  const articles = await axios
    .get('articles', { params: { offset, limit } })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

  return articles;
};

// поставить лайк
export const addLike = async (slug) => {
  const config = {
    method: 'post',
    url: `articles/${slug}/favorite`,
    ...tokenIsLocal(),
  };
  return axios(config)
    .then(() => true)
    .catch((e) => {
      throw e;
    });
};

//убрать лайк
export const deleteLike = async (slug) => {
  const config = {
    method: 'delete',
    url: `articles/${slug}/favorite`,
    ...tokenIsLocal(),
  };
  return axios(config)
    .then(() => true)
    .catch((e) => {
      throw e;
    });
};
