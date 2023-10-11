// аналог createStore, но удобнее в настройке
// собирает части редуктора - slice reducers,
// и redux-thunk включен по умолчанию...понял, в работе таких комментариев не будет)
import { configureStore } from '@reduxjs/toolkit';

// части редуктора
import userSlice from './slices/user-slice';
import articlesSlice from './slices/articles-slice';
import statusSlice from './slices/status-slice';
import tagsSlice from './slices/tags-slice';

// собираю части редукторов в один
const store = configureStore({
  reducer: {
    user: userSlice,
    articles: articlesSlice,
    status: statusSlice,
    tags: tagsSlice,
  },
});

export default store;
