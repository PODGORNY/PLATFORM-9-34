import axios from 'axios';
import { format } from 'date-fns';

import { addArticle, addArticles, addArticlesCount, setLiked } from '../Reducer/slices/articles-slice';
import { setStatus, goHome, setSubmit, setGoTo } from '../Reducer/slices/status-slice';
import { setErrors, setUser } from '../Reducer/slices/user-slice';

const baseUrl = 'https://blog.kata.academy/api';

const getArticleItem = (article) => ({
  slug: article.slug,
  title: article.title,
  likes: article.favoritesCount,
  tags: article.tagList,
  text: article.body,
  liked: article.favorited,
  description: article.description,
  username: article.author.username,
  updatedDate: format(new Date(article.updatedAt), 'MMMM d, yyyy'),
  avatarPath: article.author.image,
});

const getArticleItems = (articles) => articles.map((article) => getArticleItem(article));

// настройки запросов axios по умолчанию
/* работает не трожь
axios.defaults.headers.common.accept = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common[Authorization] = `Bearer ${token}`;

const token = localStorage.getItem('token');

// instance Axios - шаблон запроса
const config = {
    baseURL: 'https://blog.kata.academy/api/';
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
};
const instanceAxios = axios.create(config);

export const signUp = async (dataUser) => {
  const res = await instanceAxios.post('users', dataUser) // путь куда, данные что
  return res
}
*/

const getHeaders = (token) => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const fetchArticles =
  (page, limit = 5, token = '') =>
  async (dispatch) =>
    axios(`${baseUrl}/articles?&limit=${limit}&offset=${(page - 1) * limit}`, { headers: getHeaders(token) })
      .then((res) => {
        dispatch(addArticles(getArticleItems(res.data.articles)));
        dispatch(addArticlesCount(res.data.articlesCount));
        dispatch(setStatus('ok'));
      })
      .catch((err) => {
        switch (err.code) {
          case 'ERR_BAD_REQUEST':
            dispatch(setStatus('error'));
            break;
        }
      });

export const fetchArticle =
  (slug, token = '') =>
  async (dispatch) =>
    axios(`${baseUrl}/articles/${slug}`, { headers: getHeaders(token) }).then((res) => {
      dispatch(addArticle(getArticleItem(res.data.article)));
      dispatch(setStatus('ok'));
    });

export const editArticle = (data, tags, token, slug) => async (dispatch) => {
  const article = JSON.stringify({ article: { ...data, tagList: tags } });
  return axios({
    url: slug ? `${baseUrl}/articles/${slug}` : `${baseUrl}/articles`,
    method: slug ? 'put' : 'post',
    headers: getHeaders(token),
    data: article,
  })
    .then((res) => {
      dispatch(setStatus('ok'));
      dispatch(setGoTo(res.data.article.slug));
      dispatch(setSubmit(true));
    })
    .catch(() => {
      dispatch(setSubmit(true));
      dispatch(setStatus('error'));
    });
};

export const deleteArticle = (token, slug) => async (dispatch) =>
  axios({
    url: `${baseUrl}/articles/${slug}`,
    method: 'delete',
    headers: getHeaders(token),
  })
    .then((res) => res.data)
    .then(() => {
      dispatch(setStatus('ok'));
      dispatch(goHome(true));
      dispatch(setSubmit(true));
    })
    .catch(() => {
      dispatch(setSubmit(true));
      dispatch(setStatus('error'));
    });

// лайк проверка стоит или нет
export const setLike = (token, slug, liked) => async (dispatch) => {
  if (liked) {
    dispatch(delLike(token, slug));
  } else {
    dispatch(like(token, slug));
  }
};

// добавить лайк
export const like = (token, slug) => async (dispatch) =>
  axios({
    url: `${baseUrl}/articles/${slug}/favorite`,
    method: 'post',
    headers: getHeaders(token),
  })
    .then((res) => {
      dispatch(setStatus('ok'));
      dispatch(setLiked(getArticleItem(res.data.article)));
    })
    .catch(() => {
      dispatch(setSubmit(true));
      dispatch(setStatus('error'));
    });

// удалить лайк
export const delLike = (token, slug) => async (dispatch) =>
  axios({
    url: `${baseUrl}/articles/${slug}/favorite`,
    method: 'delete',
    headers: getHeaders(token),
  })
    .then((res) => {
      dispatch(setStatus('ok'));
      dispatch(setLiked(getArticleItem(res.data.article)));
    })
    .catch(() => {
      dispatch(setSubmit(true));
      dispatch(setStatus('error'));
    });

const getHeader = (token) => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

const fetchUser = axios.create({
  baseURL: `${baseUrl}`,
  method: 'post',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const getUser = (token) => async (dispatch) => {
  axios({
    url: `${baseUrl}/user`,
    headers: getHeader(token),
  })
    .then((res) => {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      dispatch(setUser({ user: res.data.user }));
      dispatch(setErrors(null));
    })
    .catch((err) => {
      dispatch(setErrors(err.response.data.errors));
    });
};

/* работает - не трожь
export const registerUser = (data) => async (dispatch) => {
  const user = JSON.stringify({
    user: data,
  });

  fetchUser({
    url: '/users',
    data: user,
  })
    .then((res) => {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      dispatch(setUser({ user: res.data.user }));
      dispatch(setErrors(null));
      dispatch(goHome(true));
      dispatch(setSubmit(true));
    })
    .catch((err) => {
      if (err?.response?.status === 422) {
        dispatch(setSubmit(true));
        dispatch(setUser(JSON.parse(user)));
        dispatch(setErrors(err.response.data.errors));
      }
    });
};
*/
export const registerUser = (data, callback) => async () => {
  const user = JSON.stringify({
    user: data,
  });

  try {
    const response = await fetchUser({
      url: '/users',
      data: user,
    });

    if (response.status === 200) {
      const userData = response.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
      callback({ success: true, user: userData });
    } else if (response.status === 422) {
      callback({ success: false, errors: response.data.errors, user: JSON.parse(user) });
    }
  } catch (err) {
    callback({ success: false, error: 'error' });
  }
};

/*
export const loginUser = (data) => async (dispatch) => {
  const user = JSON.stringify({
    user: data,
  });
  fetchUser({
    url: '/users/login',
    data: user,
  })
    .then((res) => {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      dispatch(setUser({ user: res.data.user }));
      dispatch(setErrors(null));
      dispatch(goHome(true));
      dispatch(setSubmit(true));
    })
    .catch((err) => {
      dispatch(setSubmit(true));
      if (err.response.status === 422) {
        dispatch(setUser(JSON.parse(user)));
        dispatch(setErrors(err.response.data.errors));
      }
    });
};
*/

export const loginUser = (data, callback) => async () => {
  const user = JSON.stringify({
    user: data,
  });
  try {
    const response = await fetchUser({
      url: '/users/login',
      data: user,
    });

    if (response.status === 200) {
      const userData = response.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
      callback({ success: true, user: userData });
    } else if (response.status === 422) {
      callback({ success: false, errors: response.data.errors, user: JSON.parse(user) });
    }
  } catch (err) {
    callback({ success: false, error: 'error' });
  }
};

export const updateUser = (data) => async (dispatch) => {
  const { token } = JSON.parse(localStorage.getItem('user'));

  const user = JSON.stringify({
    user: data,
  });

  axios({
    url: `${baseUrl}/user`,
    method: 'put',
    headers: getHeader(token),
    data: user,
  })
    .then((res) => {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      dispatch(setUser({ user: res.data.user }));
      dispatch(setErrors(null));
      dispatch(setSubmit(true));
    })
    .catch((err) => {
      dispatch(setSubmit(true));
      dispatch(setErrors(err.response.data.errors));
    });
};
