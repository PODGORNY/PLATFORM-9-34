// аналог createStore, но удобнее в настройке
// собирает части редуктора - slice reducers,
// и redux-thunk включен по умолчанию
import { configureStore } from '@reduxjs/toolkit';

// часть редуктора, по работе со статьями...запросы на сервер и прочее
import articleSlice from './articleSlice';
// часть редуктора, для авторизации и регистрации пользователя
import authSlice from './authSlice';

// собираю части редукторов в один
const store = configureStore({
  reducer: {
    articles: articleSlice,
    auth: authSlice,
  },
});

export default store;
