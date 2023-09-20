// часть(slice) редуктора для выдачи статьи
// createSlice - берёт редуктор и его стейт и создаёт Часть редуктора
// createAsyncThunk - встроенный thunk
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// плагин запросов к API
import axios from 'axios';

// API------------------------------------------------------запросы на сервер
const _URL = 'https://blog.kata.academy/api/';

//получение статей c сервера
export const articleAPI = createAsyncThunk('articles/articleAPI', async (offset) => {
  const response = await fetch(`https://blog.kata.academy/api/articles?limit=5&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Server Error!');
  }
  const data = await response.json();
  return data.articles;
});

//создание новой статьи с отправкой на сервер
export const createArticleAPI = createAsyncThunk('articles/createArticleAPI', async (userData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post('https://blog.kata.academy/api/articles', userData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  return response.data.article;
});

//удаление статьи c сервера
export const deleteArticleAPI = createAsyncThunk('articles/deleteArticleAPI', async (slug) => {
  const token = localStorage.getItem('token');
  await axios.delete(`https://blog.kata.academy/api/articles/${slug}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
});

//редактирование статьи c обновлением на сервере
export const editArticleAPI = createAsyncThunk('articles/editArticleAPI', async (payload) => {
  // статья и данные юзера статьи
  const { slug, userData } = payload;
  const token = localStorage.getItem('token');
  const response = await axios.put(`https://blog.kata.academy/api/articles/${slug}`, userData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  return response.data;
});

//лайк поставлю и отправлю на сервер
export const likeArticleAPI = createAsyncThunk('articles/likeArticleAPI', async (slug) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `https://blog.kata.academy/api/articles/${slug}/favorite`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data.article;
});

//лайк сниму отправлю на сервер
export const likeDeleteAPI = createAsyncThunk('articles/likeDeleteAPI', async (slug) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`https://blog.kata.academy/api/articles/${slug}/favorite`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  return response.data.article;
});

//---------------------------------------------------------редуктор
const articleSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    article: null,
    status: null,
    error: null,
    page: 1,
    flag: false,
  },

  reducers: {
    changePage(state, action) {
      state.page = action.payload;
    },
    addArticlesArr(state, action) {
      state.articles = state.articles.concat(action.payload);
    },
    getArticle(state, action) {
      state.article = action.payload;
    },
  },
  extraReducers: {
    [articleAPI.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [articleAPI.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.articles = action.payload;
    },
    [articleAPI.rejected]: (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    },
    [createArticleAPI.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [createArticleAPI.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.articles.push(action.payload);
    },
    [createArticleAPI.rejected]: (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    },
    [editArticleAPI.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [editArticleAPI.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.articles.push(action.payload.article);
    },
    [editArticleAPI.rejected]: (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    },
    [likeArticleAPI.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.articles = state.articles.map((article) =>
        article.slug === action.payload.slug ? action.payload : article
      );
      localStorage.setItem(`like_${action.payload.slug}`, true); // сохраняем состояние лайка
    },
    [likeDeleteAPI.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.articles = state.articles.map((article) =>
        article.slug === action.payload.slug ? action.payload : article
      );
      localStorage.removeItem(`like_${action.payload.slug}`, false);
    },
  },
});

export const { changePage, getArticle } = articleSlice.actions;
export default articleSlice.reducer;
