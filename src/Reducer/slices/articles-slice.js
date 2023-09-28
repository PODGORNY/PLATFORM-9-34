import { createSlice } from '@reduxjs/toolkit';

const articlesSlice = createSlice({
  name: 'article',
  initialState: {
    articles: [],
    articlesCount: 0,
    page: Number(localStorage.getItem('page')) || 1,
    limit: 5,
  },
  reducers: {
    addArticles(state, action) {
      state.articles = action.payload;
    },
    addArticle(state, action) {
      state.articles = [action.payload];
    },
    addArticlesCount(state, action) {
      state.articlesCount = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
    },
    setLiked(state, action) {
      state.articles = state.articles.map((art) => (art.slug === action.payload.slug ? action.payload : art));
    },
  },
});

export default articlesSlice.reducer;
export const { addArticles, addArticlesCount, setPage, setLimit, addArticle, setLiked } = articlesSlice.actions;
